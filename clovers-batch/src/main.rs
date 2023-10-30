use std::io::Cursor;

use clovers_svc_common::clovers::scenes::{self, Scene};
use clovers_svc_common::clovers::RenderOpts;
use clovers_svc_common::render_result::*;
use clovers_svc_common::render_task::*;
use clovers_svc_common::*;

use image::imageops::FilterType::Lanczos3;
use image::{DynamicImage, ImageBuffer, Rgb, RgbImage};
use redis::aio::ConnectionManager;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres};
use tokio::time::{sleep, Duration};
use tracing::{error, info};
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const POLL_DELAY_MS: u64 = 1_000;
const MAX_WIDTH: u32 = 3840;
const MAX_HEIGHT: u32 = 2160;
const MAX_SAMPLES: u32 = 1024;
const MAX_DEPTH: u32 = 100;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // load configs
    let config = load_configs()?;
    // FIXME: https://github.com/awslabs/aws-sdk-rust/issues/932
    let endpoint_url = dotenv::var("AWS_ENDPOINT_URL")?;
    let awsconfig = aws_config::from_env()
        .endpoint_url(&endpoint_url)
        .load()
        .await;
    let endpoint_url_s3 = dotenv::var("AWS_ENDPOINT_URL_S3")?;
    let s3config = aws_sdk_s3::config::Builder::from(&awsconfig)
        .endpoint_url(&endpoint_url_s3)
        .force_path_style(true)
        .build();
    let s3client = aws_sdk_s3::Client::from_conf(s3config);

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
                render(render_task_id, &postgres_pool, &s3client).await;
            }
            Err(_e) => {
                sleep(Duration::from_millis(POLL_DELAY_MS)).await;
            }
        }
    }
}

async fn render(id: Uuid, postgres_pool: &Pool<Postgres>, s3client: &aws_sdk_s3::Client) {
    info!("fetching rendertask: {id}");
    let t: RenderTask = match get_render_task(id, postgres_pool).await {
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

    let scene_file = t.scene_file;
    // Enforce limits for renders
    let width = t.opts.width.min(MAX_WIDTH);
    let height = t.opts.height.min(MAX_HEIGHT);
    let samples = t.opts.samples.min(MAX_SAMPLES);
    let max_depth = t.opts.max_depth.min(MAX_DEPTH);
    let opts = RenderOpts {
        width,
        height,
        samples,
        max_depth,
        ..t.opts
    };

    info!("initializing scene: {id}");
    let scene: Scene = scenes::initialize(scene_file, width, height);

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
    // Write the image png
    let mut image: Vec<u8> = Vec::new();
    match img.write_to(&mut Cursor::new(&mut image), image::ImageOutputFormat::Png) {
        Ok(_) => (),
        Err(e) => {
            error!("could not write image data to buffer: {id} - {e}");
            return;
        }
    };
    // Write the thumbnail png
    let thumb_img = DynamicImage::from(img).resize(256, 256, Lanczos3);
    let mut thumb: Vec<u8> = Vec::new();
    match thumb_img.write_to(&mut Cursor::new(&mut thumb), image::ImageOutputFormat::Png) {
        Ok(_) => (),
        Err(e) => {
            error!("could not write image data to buffer: {id} - {e}");
            return;
        }
    };

    let render_result = RenderResult { image, thumb };
    match save_render_result(render_result, postgres_pool, s3client).await {
        Ok(result_id) => info!("saved render {id} result at {result_id}"),
        Err(e) => error!("could not save render result for: {id} - {e}"),
    };
    match delete_render_task(id, postgres_pool).await {
        Ok(id) => info!("deleted rendertask: {id}"),
        Err(e) => error!("could not delete rendertask: {id} - {e}"),
    };
}
