use std::net::SocketAddr;

mod rest;
mod ws;

use axum::{
    extract::FromRef,
    http::{
        header::{self},
        HeaderValue, Method, StatusCode,
    },
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use clovers_svc_common::load_configs;
use redis::aio::ConnectionManager;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::{fmt::time, layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone, FromRef)]
struct AppState {
    redis: ConnectionManager,
    postgres: Pool<Postgres>,
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

    // set up postgres
    let postgres_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.postgres_connectioninfo)
        .await?;

    // set up redis
    let redis = redis::Client::open(config.redis_connectioninfo).unwrap();
    let redis_connection_manager = ConnectionManager::new(redis).await?;

    let state = AppState {
        redis: redis_connection_manager,
        postgres: postgres_pool,
    };

    // assemble the application
    let app = Router::new()
        // `GET /` goes to `hello`
        .route("/", get(hello))
        // `GET /healthz` goes to `healthz`
        .route("/healthz", get(healthz))
        // `POST /preview` goes to preview queue
        .route("/preview", post(rest::preview_post))
        // `GET /preview` gets the specific preview by id
        .route("/preview/:id", get(rest::preview_get))
        // `POST /queue` goes to `queue`
        .route("/queue", post(rest::queue_post))
        // `GET /queue` lists all the tasks in the queue
        .route("/queue", get(rest::queue_list_all))
        // `GET /queue/:id` gets the specific task by id
        .route("/queue/:id", get(rest::queue_get))
        // `GET /render/` gets all the render results in the db
        .route("/render", get(rest::render_result_list_all))
        // `GET /render/:id` gets the specific render result by id
        .route("/render/:id", get(rest::render_result_get))
        // WebSocket
        .route("/ws", get(ws::ws_handler))
        // redis and postgres
        .with_state(state)
        // 404 handler
        .fallback(not_found)
        // CORS layer
        .layer(
            CorsLayer::new()
                .allow_origin(config.frontend_address.parse::<HeaderValue>().unwrap())
                .allow_headers([header::CONTENT_TYPE])
                .allow_methods([Method::GET, Method::POST, Method::PUT]),
        )
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
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();

    Ok(())
}

/// simple example route handler
async fn hello() -> impl IntoResponse {
    (StatusCode::OK, Json("clovers-service (c) 2023"))
}

/// healthcheck endpoint
async fn healthz() -> impl IntoResponse {
    (StatusCode::OK, Json("ok"))
}

/// 404 not found handler
async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, Json("not found"))
}
