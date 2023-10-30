use std::io::Cursor;

use clovers_svc_common::clovers::scenes::{self, Scene};
use clovers_svc_common::clovers::RenderOpts;
use clovers_svc_common::preview_result::save_preview_result;
use clovers_svc_common::preview_task::*;
use clovers_svc_common::*;
use image::{ImageBuffer, Rgb, RgbImage};
use redis::aio::ConnectionManager;
use tokio::time::{sleep, Duration};
use tracing::{error, info};
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const POLL_DELAY_MS: u64 = 1_000;
const MAX_WIDTH: u32 = 1920;
const MAX_HEIGHT: u32 = 1080;
const MAX_SAMPLES: u32 = 1;
const MAX_DEPTH: u32 = 10;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // load configs
    let config = load_configs()?;

    // set up the tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(&config.rustlog))
        .with(tracing_subscriber::fmt::layer().with_timer(time::UtcTime::rfc_3339()))
        .init();

    // set up redis
    let redis = redis::Client::open(config.redis_connectioninfo).unwrap();
    let mut redis_connection_manager = ConnectionManager::new(redis).await?;

    // main loop
    loop {
        match pop_preview_queue(&mut redis_connection_manager).await {
            Ok(preview_task) => {
                info!("got a preview task");
                render(preview_task, &mut redis_connection_manager).await;
            }
            Err(_e) => {
                sleep(Duration::from_millis(POLL_DELAY_MS)).await;
            }
        }
    }
}

async fn render(preview_task: PreviewTask, redis: &mut ConnectionManager) {
    let preview_id = preview_task.preview_id;
    let t = preview_task.render_task;
    let scene_file = t.scene_file;
    // Enforce limits for previews
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

    info!("initializing preview {preview_id}");
    let scene: Scene = scenes::initialize(scene_file, width, height);

    info!("rendering preview {preview_id}");
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
    let mut image: Vec<u8> = Vec::new();
    match img.write_to(&mut Cursor::new(&mut image), image::ImageOutputFormat::Png) {
        Ok(_) => (),
        Err(e) => {
            error!("could not write image data to buffer {preview_id} error {e}");
            return;
        }
    };
    // No thumbnail for previews
    // FIXME: cleaner abstractions
    let thumb: Vec<u8> = vec![];
    let preview_result = RenderResult { image, thumb };
    match save_preview_result(preview_id, preview_result, redis).await {
        Ok(_) => info!("saved new preview {preview_id}"),
        Err(e) => error!("could not save preview result {preview_id} error {e}"),
    };
}
