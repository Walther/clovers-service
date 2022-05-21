use clovers_svc_common::*;
use redis::aio::ConnectionManager;
use sqlx::postgres::PgPoolOptions;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres};
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
                tracing::debug!("no tasks in queue, sleeping");
                sleep(Duration::from_millis(POLL_DELAY_MS)).await;
            }
        }
    }
}

async fn render(id: Uuid, postgres_pool: &Pool<Postgres>) {
    tracing::info!("starting the render: {id}");
    // TODO process call to actual renderer
    let data = vec![0u8; 16];
    let render_result = RenderResult { data };
    tracing::info!("render complete: {id}");
    match store::save_render_result(render_result, postgres_pool).await {
        Ok(result_id) => tracing::info!("saved render {id} result at {result_id}"),
        Err(e) => tracing::error!("could not save render result for: {id} - {e}"),
    };
    match store::delete_render_task(id.to_string(), postgres_pool).await {
        Ok(id) => tracing::info!("deleted rendertask: {id}"),
        Err(e) => tracing::error!("could not delete rendertask: {id} - {e}"),
    };
}
