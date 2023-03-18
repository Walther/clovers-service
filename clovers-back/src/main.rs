use std::{net::SocketAddr, str::FromStr, time::Duration};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, FromRef, Path, State, WebSocketUpgrade,
    },
    http::{
        header::{self, CONTENT_TYPE},
        HeaderValue, Method, StatusCode,
    },
    response::{AppendHeaders, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use redis::aio::ConnectionManager;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::{postgres::PgPoolOptions, types::Uuid, Pool, Postgres};
use tokio::time::sleep;
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::{debug, error, info, Level};
use tracing_subscriber::{fmt::time, layer::SubscriberExt, util::SubscriberInitExt};

use clovers_svc_common::{preview_result::*, preview_task::*, render_result::*, render_task::*, *};

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
        .route("/preview", post(preview_post))
        // `GET /preview` gets the specific preview by id
        .route("/preview/:id", get(preview_get))
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
        // WebSocket
        .route("/ws", get(ws_handler))
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
async fn hello() -> &'static str {
    info!("hello() called");
    "Hello, World!\n"
}

/// healthcheck endpoint
async fn healthz() -> impl IntoResponse {
    (StatusCode::OK, Json("ok"))
}

/// 404 not found handler
async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, Json("not found"))
}

/// Queues a preview task to the Redis preview queue, to be processed by the batch worker.
async fn preview_post(
    State(mut redis_connection): State<ConnectionManager>,
    Json(render_request): Json<RenderTask>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let preview_id = match queue_previewtask(render_request, &mut redis_connection).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };

    Ok((StatusCode::OK, Json(preview_id.to_string())))
}

/// Gets a preview result
async fn preview_get(
    Path(id): Path<String>,
    State(mut redis_connection): State<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let preview_id = match Uuid::from_str(&id) {
        Ok(id) => id,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::BAD_REQUEST, Json(e.to_string())));
        }
    };
    let preview = match get_preview_result(preview_id, &mut redis_connection).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let mut res = (StatusCode::OK, preview).into_response();
    res.headers_mut()
        .insert(CONTENT_TYPE, "image/png".parse().unwrap());
    Ok(res)
}

/// Queues a rendering task to the Redis rendering queue, to be processed by the batch worker.
async fn queue_post(
    State(mut redis_connection): State<ConnectionManager>,
    State(postgres_pool): State<Pool<Postgres>>,
    Json(render_request): Json<RenderTask>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let uuid = match queue_rendertask(render_request, &mut redis_connection, &postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };

    Ok((StatusCode::OK, Json(uuid.to_string())))
}

/// List the task ids currently in the queue
async fn queue_list_all(
    State(mut redis_connection): State<ConnectionManager>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let rendertasks = match list_render_tasks(&mut redis_connection).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
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
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let rendertask = match get_render_task(id, &postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
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
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let render_result: Vec<u8> = match get_render_result(id, &postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
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
    let render_results: Vec<Uuid> = match list_render_results(&postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    // TODO: can this be cleaned up somehow?
    let render_results: Vec<String> = render_results.iter().map(|id| id.to_string()).collect();

    Ok((StatusCode::OK, Json(render_results)))
}

/// WebSocket connection initiation handler
async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(redis_connection): State<ConnectionManager>,
) -> impl IntoResponse {
    info!("client {addr} connected");
    ws.on_failed_upgrade(|err| error!("unable to upgrade websocket connection: {err}"))
        .on_upgrade(move |socket| {
            handle_socket(socket, addr, axum::extract::State(redis_connection))
        })
}

/// Actual websocket statemachine (one will be spawned per connection)
async fn handle_socket(
    mut socket: WebSocket,
    who: SocketAddr,
    State(mut redis_connection): State<ConnectionManager>,
) {
    // TODO: refactor this monstrosity
    loop {
        if let Some(msg) = socket.recv().await {
            match msg {
                Ok(msg) => {
                    log_ws(&msg, who);

                    if let Message::Text(t) = msg {
                        debug!(t);
                        let parsed: WSMessage = serde_json::from_str(&t).unwrap();
                        if parsed.kind == "preview" {
                            let render_task = serde_json::from_value(parsed.body).unwrap();
                            let preview_id =
                                match queue_previewtask(render_task, &mut redis_connection).await {
                                    Ok(id) => id,
                                    Err(e) => {
                                        error!("{e}");
                                        return;
                                    }
                                };

                            // TODO: smarter solution than polling?
                            // 100 retries at 100 ms each = 10 seconds max timeout
                            let mut retries = 100;
                            while retries > 0 {
                                match exists_preview_result(preview_id, &mut redis_connection).await
                                {
                                    true => {
                                        let reply = json!({
                                            "kind": "preview",
                                            "body": preview_id,
                                        })
                                        .to_string();
                                        socket.send(reply.into()).await.unwrap();
                                        break;
                                    }
                                    false => {
                                        retries -= 1;
                                        sleep(Duration::from_millis(100)).await;
                                    }
                                };
                            }

                            if retries == 0 {
                                let reply = json!({
                                    "kind": "error",
                                    "body": "preview timed out",
                                })
                                .to_string();
                                socket.send(reply.into()).await.unwrap();
                            }
                        }
                    }
                }
                Err(e) => error!("{e}"),
            }
        }
    }
}

/// Helper to print contents of messages to stdout. Has special treatment for Close.
fn log_ws(msg: &Message, who: SocketAddr) {
    match msg {
        Message::Text(t) => {
            info!(">>> {} sent str: {:?}", who, t);
        }
        Message::Binary(d) => {
            info!(">>> {} sent {} bytes: {:?}", who, d.len(), d);
        }
        Message::Close(c) => {
            if let Some(cf) = c {
                info!(
                    ">>> {} sent close with code {} and reason `{}`",
                    who, cf.code, cf.reason
                );
            } else {
                info!(">>> {} somehow sent close message without CloseFrame", who);
            }
        }

        Message::Pong(v) => {
            info!(">>> {} sent pong with {:?}", who, v);
        }
        Message::Ping(v) => {
            info!(">>> {} sent ping with {:?}", who, v);
        }
    }
}

#[derive(Serialize, Deserialize)]
struct WSMessage {
    kind: String,
    body: serde_json::Value,
}
