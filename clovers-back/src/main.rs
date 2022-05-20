use axum::{
    extract::Path,
    handler::Handler,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use redis::aio::ConnectionManager;
use tower_http::{
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use clovers_svc_common::*;

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
    let redis_connection_manager = ConnectionManager::new(redis).await?;

    // assemble the application
    let app = Router::new()
        // `GET /` goes to `hello`
        .route("/", get(hello))
        // `GET /healthz` goes to `healthz`
        .route("/healthz", get(healthz))
        // `POST /queue` goes to `queue`
        .route("/queue", post(queue_post))
        // `GET /queue` lists all the tasks in the queue
        .route("/queue", get(queue_list_all))
        // `GET /queue/:id` gets the specific task by id
        .route("/queue/:id", get(queue_get))
        // `GET /render/:id` gets the specific render result by id
        .route("/render/:id", get(render_result_get))
        // redis connection
        .layer(Extension(redis_connection_manager))
        // 404 handler
        .fallback(not_found.into_service())
        // tracing layer
        .layer(
            TraceLayer::new_for_http()
                .on_request(DefaultOnRequest::new().level(Level::INFO))
                .on_response(
                    DefaultOnResponse::new()
                        .level(Level::INFO)
                        .latency_unit(LatencyUnit::Micros),
                ),
        );

    // run the app
    tracing::info!("listening on {}", config.listen_address);
    axum::Server::bind(&config.listen_address)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

/// simple example route handler
async fn hello() -> &'static str {
    "Hello, World!\n"
}

/// healthcheck endpoint
async fn healthz() -> impl IntoResponse {
    (StatusCode::OK, "ok\n")
}

/// 404 not found handler
async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "not found\n")
}

/// Queues a rendering task to the Redis rendering queue, to be processed by the batch worker.
async fn queue_post(
    Json(render_request): Json<RenderRequest>,
    Extension(mut redis_connection): Extension<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let ok = match store::queue_rendertask(render_request, &mut redis_connection).await {
        Ok(data) => data,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };

    Ok((StatusCode::OK, Json(ok)))
}

/// List the task ids currently in the queue
async fn queue_list_all(
    Extension(mut redis_connection): Extension<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let rendertasks = match store::list_render_tasks(&mut redis_connection).await {
        Ok(data) => data,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    Ok((StatusCode::OK, Json(rendertasks)))
}

/// Get the task by id in the queue
async fn queue_get(
    Path(id): Path<String>,
    Extension(mut redis_connection): Extension<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let rendertask = match store::get_render_task(id, &mut redis_connection).await {
        Ok(data) => data,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    // this field already contains json, so we don't need to json-ify it again
    Ok((StatusCode::OK, rendertask))
}

/// Get the render result by id
async fn render_result_get(
    Path(id): Path<String>,
    Extension(mut redis_connection): Extension<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let render_result = match store::get_render_result(id, &mut redis_connection).await {
        Ok(data) => data,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    Ok((StatusCode::OK, render_result))
}
