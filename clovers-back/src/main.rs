use std::{net::SocketAddr, sync::Arc};

mod rest;
mod ws;

use axum::{
    error_handling::HandleErrorLayer,
    extract::FromRef,
    http::{
        header::{self},
        HeaderValue, Method, StatusCode,
    },
    response::IntoResponse,
    routing::{get, post},
    BoxError, Json, Router,
};
use clovers_svc_common::load_configs;
use redis::aio::ConnectionManager;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use tokio::sync::Mutex;
use tower::ServiceBuilder;
use tower_governor::{errors::display_error, governor::GovernorConfigBuilder, GovernorLayer};
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::{fmt::time, layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone, FromRef)]
struct AppState {
    redis: Arc<Mutex<ConnectionManager>>,
    postgres: Pool<Postgres>,
    s3: aws_sdk_s3::Client,
}

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
    let redis_connection_manager = ConnectionManager::new(redis).await?;

    let state = AppState {
        redis: Arc::new(Mutex::new(redis_connection_manager)),
        postgres: postgres_pool,
        s3: s3client,
    };

    // set up ratelimiting
    // TODO: endpoint specific ratelimits, especially for POST /render
    let governor_conf = Box::new(GovernorConfigBuilder::default().finish().unwrap());

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
        // `GET /thumb/:id` gets the specific thumbnail by id
        .route("/thumb/:id", get(rest::thumb_get))
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
        )
        .layer(
            ServiceBuilder::new()
                // this middleware goes above `GovernorLayer` because it will receive
                // errors returned by `GovernorLayer` below
                .layer(HandleErrorLayer::new(|e: BoxError| async move {
                    display_error(e)
                }))
                .layer(GovernorLayer {
                    config: Box::leak(governor_conf),
                }),
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
