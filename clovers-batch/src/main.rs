use std::io::Cursor;

use clovers_svc_common::clovers::scenes::{self, Scene};
use clovers_svc_common::render_result::*;
use clovers_svc_common::render_task::*;
use clovers_svc_common::*;

use image::{ImageBuffer, Rgb, RgbImage};
use redis::aio::ConnectionManager;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres};
use tokio::time::{sleep, Duration};
use tracing::{error, info};
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const POLL_DELAY_MS: u64 = 1_000;

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
        match pop_render_queue(&mut redis_connection_manager).await {
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
    let render_task: RenderTask = match get_render_task(id, postgres_pool).await {
        Ok(Some(data)) => data,
        Ok(None) => {
            error!("rendertask not found: {id}");
            return;
        }
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
    let pixelbuffer = draw(opts, &scene);

    info!("converting pixelbuffer to an image");
    let mut img: RgbImage = ImageBuffer::new(width, height);
    img.enumerate_pixels_mut().for_each(|(x, y, pixel)| {
        let index = y * width + x;
        *pixel = Rgb(pixelbuffer[index as usize].into());
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
    match save_render_result(render_result, postgres_pool).await {
        Ok(result_id) => info!("saved render {id} result at {result_id}"),
        Err(e) => error!("could not save render result for: {id} - {e}"),
    };
    match delete_render_task(id, postgres_pool).await {
        Ok(id) => info!("deleted rendertask: {id}"),
        Err(e) => error!("could not delete rendertask: {id} - {e}"),
    };
}
