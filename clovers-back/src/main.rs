use axum::{
    extract::{FromRef, Path, State},
    http::{
        header::{self, CONTENT_TYPE},
        HeaderValue, Method, StatusCode,
    },
    response::{AppendHeaders, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use redis::aio::ConnectionManager;
use sqlx::{postgres::PgPoolOptions, types::Uuid, Pool, Postgres};
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::{fmt::time, layer::SubscriberExt, util::SubscriberInitExt};

use clovers_svc_common::*;

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
        // `POST /queue` goes to `queue`
        .route("/queue", post(queue_post))
        // `GET /queue` lists all the tasks in the queue
        .route("/queue", get(queue_list_all))
        // `GET /queue/:id` gets the specific task by id
        .route("/queue/:id", get(queue_get))
        // `GET /render/` gets all the render results in the db
        .route("/render", get(render_result_list_all))
        // `GET /render/:id` gets the specific render result by id
        .route("/render/:id", get(render_result_get))
        // redis and postgres
        .with_state(state)
        // 404 handler
        .fallback(not_found)
        // CORS layer
        .layer(
            CorsLayer::new()
                .allow_origin(config.frontend_address.parse::<HeaderValue>().unwrap())
                .allow_headers([header::CONTENT_TYPE])
                .allow_methods([Method::GET, Method::POST]),
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
    (StatusCode::OK, Json("ok\n"))
}

/// 404 not found handler
async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, Json("not found\n"))
}

/// Queues a rendering task to the Redis rendering queue, to be processed by the batch worker.
async fn queue_post(
    State(mut redis_connection): State<ConnectionManager>,
    State(postgres_pool): State<Pool<Postgres>>,
    Json(render_request): Json<RenderTask>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let uuid = match store::queue_rendertask(render_request, &mut redis_connection, &postgres_pool)
        .await
    {
        Ok(data) => data,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };

    Ok((StatusCode::OK, Json(uuid.to_string())))
}

/// List the task ids currently in the queue
async fn queue_list_all(
    State(mut redis_connection): State<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let rendertasks = match store::list_render_tasks(&mut redis_connection).await {
        Ok(data) => data,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    Ok((StatusCode::OK, Json(rendertasks)))
}

/// Get the task by id in the queue
async fn queue_get(
    Path(id): Path<String>,
    State(postgres_pool): State<Pool<Postgres>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let id: Uuid = match id.parse() {
        Ok(id) => id,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let rendertask = match store::get_render_task(id, &postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };

    Ok((StatusCode::OK, Json(rendertask)))
}

/// Get the render result by id
async fn render_result_get(
    Path(id): Path<String>,
    State(postgres_pool): State<Pool<Postgres>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let id: Uuid = match id.parse() {
        Ok(id) => id,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let render_result: Vec<u8> = match store::get_render_result(id, &postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };

    Ok((
        StatusCode::OK,
        AppendHeaders([(CONTENT_TYPE, "image/png")]),
        render_result,
    ))
}

/// Get a list of all the render results
async fn render_result_list_all(
    State(postgres_pool): State<Pool<Postgres>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let render_results: Vec<Uuid> = match store::list_render_results(&postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            tracing::error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    // TODO: can this be cleaned up somehow?
    let render_results: Vec<String> = render_results.iter().map(|id| id.to_string()).collect();

    Ok((StatusCode::OK, Json(render_results)))
}
