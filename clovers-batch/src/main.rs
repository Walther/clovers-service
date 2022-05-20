use clovers_svc_common::*;
use redis::aio::ConnectionManager;
use tokio::time::{sleep, Duration};
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const POLL_DELAY_MS: u64 = 10_000;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // load configs
    let config = load_configs()?;

    // set up the tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(&config.rustlog))
        .with(tracing_subscriber::fmt::layer().with_timer(time::UtcTime::rfc_3339()))
        .init();
    tracing::debug!("starting with configuration: {:?}", &config);

    // set up redis
    let redis = redis::Client::open(config.redis_connectioninfo).unwrap();
    let mut redis_connection_manager = ConnectionManager::new(redis).await?;

    // main loop
    loop {
        match store::pop_render_queue(&mut redis_connection_manager).await {
            Ok(render_task_id) => {
                render(render_task_id, &mut redis_connection_manager).await;
            }
            Err(_e) => {
                tracing::debug!("no tasks in queue, sleeping");
                sleep(Duration::from_millis(POLL_DELAY_MS)).await;
            }
        }
    }
}

async fn render(id: String, con: &mut ConnectionManager) {
    tracing::info!("starting the render: {id}");
    // TODO process call to actual renderer
    tracing::info!("render complete: {id}");
    match store::delete_render_task(id.clone(), con).await {
        Ok(_data) => tracing::info!("deleted rendertask: {id}"),
        Err(e) => tracing::error!("could not delete rendertask: {id} - {e}"),
    };
}
