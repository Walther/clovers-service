use std::io::Cursor;

use image::{ImageBuffer, Rgb, RgbImage};
use redis::aio::ConnectionManager;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres};
use tokio::time::{sleep, Duration};
use tracing::{error, info};
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod draw_cpu;
mod store;

const POLL_DELAY_MS: u64 = 1_000;

use clovers::{scenes, scenes::Scene, scenes::SceneFile, RenderOpts};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

/// Redis list name for the rendering queue
pub const RENDER_QUEUE_NAME: &str = "render_queue";

/// Main configuration structure for the application
#[derive(Debug)]
pub struct Config {
    /// Address and port to start the server at, eg. `0.0.0.0:8080`.
    pub listen_address: SocketAddr,
    /// Log level configuration. Example: `clovers_back=trace,tower_http=trace`.
    pub rustlog: String,
    /// Full address string of the redis server to connect to, e.g. `redis://redis:6379/`
    pub redis_connectioninfo: redis::ConnectionInfo,
    /// Full address string of the postgres server to connect to, e.g. `postgres://postgres:password@localhost/test`
    pub postgres_connectioninfo: String,
    /// Address of the frontend. Used for CORS allow purposes
    pub frontend_address: String,
}

/// Loads the configuration from the .env file, erroring if required fields are missing or malformed.
pub fn load_configs() -> anyhow::Result<Config> {
    dotenv().ok();
    let listen_address = dotenv::var("LISTEN_ADDRESS")?.parse()?;
    let rustlog = dotenv::var("RUST_LOG")?;
    let redis_connectioninfo = dotenv::var("REDIS_CONNETIONINFO")?.parse()?;
    let postgres_connectioninfo = dotenv::var("POSTGRES_CONNETIONINFO")?.parse()?;
    let frontend_address = dotenv::var("FRONTEND_ADDRESS")?.parse()?;

    Ok(Config {
        listen_address,
        rustlog,
        redis_connectioninfo,
        postgres_connectioninfo,
        frontend_address,
    })
}

/// The main object for a rendering request. Contains all the information necessary for performing a full render of a scene.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RenderTask {
    /// All the details of the scene to be rendered
    pub scene_file: SceneFile,
    /// Rendering options for the render
    pub opts: RenderOpts,
}

/// The main object for the rendering result. Contains an image and assorted metadata.
#[derive(Serialize, Deserialize, Debug)]
pub struct RenderResult {
    /// minimum viable test: vec of bytes
    pub data: Vec<u8>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // load configs
    let config = load_configs()?;

    // set up the tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(&config.rustlog))
        .with(tracing_subscriber::fmt::layer().with_timer(time::UtcTime::rfc_3339()))
        .init();

    // set up postgres
    let postgres_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.postgres_connectioninfo)
        .await?;

    // set up redis
    let redis = redis::Client::open(config.redis_connectioninfo).unwrap();
    let mut redis_connection_manager = ConnectionManager::new(redis).await?;

    // main loop
    loop {
        match store::pop_render_queue(&mut redis_connection_manager).await {
            Ok(render_task_id) => {
                render(render_task_id, &postgres_pool).await;
            }
            Err(_e) => {
                sleep(Duration::from_millis(POLL_DELAY_MS)).await;
            }
        }
    }
}

async fn render(id: Uuid, postgres_pool: &Pool<Postgres>) {
    info!("fetching rendertask: {id}");
    let render_task: RenderTask = match store::get_render_task(id, postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("could not fetch rendertask: {id} - {e}");
            return;
        }
    };

    info!("initializing scene: {id}");
    let scene: Scene = scenes::initialize(
        render_task.scene_file,
        render_task.opts.width,
        render_task.opts.height,
    );
    let opts = render_task.opts;
    let width = opts.width;
    let height = opts.height;

    info!("rendering scene: {id}");
    let pixelbuffer = draw_cpu::draw(opts, scene);

    info!("converting pixelbuffer to an image");
    let mut img: RgbImage = ImageBuffer::new(width, height);
    img.enumerate_pixels_mut().for_each(|(x, y, pixel)| {
        let index = y * width + x;
        *pixel = Rgb(pixelbuffer[index as usize].to_rgb_u8());
    });
    // Graphics assume origin at bottom left corner of the screen
    // Our buffer writes pixels from top left corner. Simple fix, just flip it!
    image::imageops::flip_vertical_in_place(&mut img);
    let mut data: Vec<u8> = Vec::new();
    match img.write_to(&mut Cursor::new(&mut data), image::ImageOutputFormat::Png) {
        Ok(_) => (),
        Err(e) => {
            error!("could not write image data to buffer: {id} - {e}");
            return;
        }
    };
    let render_result = RenderResult { data };
    match store::save_render_result(render_result, postgres_pool).await {
        Ok(result_id) => info!("saved render {id} result at {result_id}"),
        Err(e) => error!("could not save render result for: {id} - {e}"),
    };
    match store::delete_render_task(id, postgres_pool).await {
        Ok(id) => info!("deleted rendertask: {id}"),
        Err(e) => error!("could not delete rendertask: {id} - {e}"),
    };
}
