use axum::{
    extract::Path,
    handler::Handler,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use dotenv::dotenv;
use redis::{AsyncCommands, AsyncIter};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::net::SocketAddr;
use tower_http::{
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

/// Main configuration structure for the application
#[derive(Debug)]
struct Config {
    /// Address and port to start the server at, eg. `0.0.0.0:8080`.
    listen_address: SocketAddr,
    /// Log level configuration. Example: `clovers_back=trace,tower_http=trace`.
    rustlog: String,
    /// Full address string of the redis server to connect to, e.g. `redis://redis:6379/`
    redis_connectioninfo: redis::ConnectionInfo,
}

/// Loads the configuration from the .env file, erroring if required fields are missing or malformed.
fn load_configs() -> anyhow::Result<Config> {
    dotenv().ok();
    let listen_address = dotenv::var("LISTEN_ADDRESS")?.parse()?;
    let rustlog = dotenv::var("RUST_LOG")?;
    let redis_connectioninfo = dotenv::var("REDIS_CONNETIONINFO")?.parse()?;

    Ok(Config {
        listen_address,
        rustlog,
        redis_connectioninfo,
    })
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
    tracing::debug!("starting with configuration: {:?}", &config);

    // set up redis
    let redis_client = redis::Client::open(config.redis_connectioninfo).unwrap();

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
        // redis connection
        .layer(Extension(redis_client))
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

#[derive(Serialize, Deserialize, Debug)]
struct RenderRequest {
    /// minimum viable test: name of existing scene file
    path: String,
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
    Extension(redis_client): Extension<redis::Client>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let id = Uuid::new_v4();
    let data = json!(render_request).to_string();
    // TODO: this feels extremely unergonomic
    let mut con = match redis_client.get_async_connection().await {
        Ok(con) => con,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    // queue:{uuidv4} -> data
    let _result: String = match con.set(format!("queue:{id}"), data).await {
        Ok(result) => result,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };

    Ok((StatusCode::CREATED, Json(id)))
}

/// List the task ids currently in the queue
async fn queue_list_all(
    Extension(redis_client): Extension<redis::Client>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    // TODO: this feels extremely unergonomic
    let mut con = match redis_client.get_async_connection().await {
        Ok(con) => con,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    // queue:{uuidv4} -> data
    let mut async_iter: AsyncIter<String> = match con.scan_match("queue*").await {
        Ok(async_iter) => async_iter,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    let mut results: Vec<String> = Vec::new();
    while let Some(mut element) = async_iter.next_item().await {
        // remove the `queue:` text from start, leave only uuid
        let id: String = element.split_off("queue:".len());
        results.push(id)
    }

    Ok((StatusCode::OK, Json(results)))
}

/// Get the task by id in the queue
async fn queue_get(
    Path(id): Path<String>,
    Extension(redis_client): Extension<redis::Client>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let key = format!("queue:{id}");
    // TODO: this feels extremely unergonomic
    let mut con = match redis_client.get_async_connection().await {
        Ok(con) => con,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    let result: String = match con.get(key).await {
        Ok(result) => result,
        Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    };
    // this field already contains json, so we don't need to json-ify it again
    Ok((StatusCode::OK, result))
}
