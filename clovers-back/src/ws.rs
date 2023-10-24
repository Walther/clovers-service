use anyhow::{anyhow, Result};
use axum::extract::ws::Message;
use axum::extract::ws::WebSocket;
use axum::extract::ConnectInfo;
use axum::extract::State;
use axum::extract::WebSocketUpgrade;
use axum::response::IntoResponse;
use futures::stream::SplitSink;
use futures::{sink::SinkExt, stream::StreamExt};
use redis::aio::ConnectionManager;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::types::Uuid;
use sqlx::Pool;
use sqlx::Postgres;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;
use tokio::time::sleep;
use tracing::error;
use tracing::info;

use crate::preview::exists_preview_result;
use crate::preview::queue_previewtask;
use crate::render_result::list_render_results;
use crate::render_task::list_render_tasks;

/// WebSocket connection initiation handler
pub(crate) async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
    State(postgres_pool): State<Pool<Postgres>>,
) -> impl IntoResponse {
    info!("client {addr} connected");
    ws // load-bearing formatting comment
        .on_failed_upgrade(|err| error!("unable to upgrade websocket connection: {err}"))
        .on_upgrade(move |socket| {
            handle_socket(
                socket,
                addr,
                axum::extract::State(redis_connection),
                axum::extract::State(postgres_pool),
            )
        })
}

/// Actual websocket statemachine (one will be spawned per connection)
pub(crate) async fn handle_socket(
    socket: WebSocket,
    who: SocketAddr,
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
    State(postgres_pool): State<Pool<Postgres>>,
) {
    let (mut sender, mut receiver) = socket.split();
    let r1 = redis_connection.clone();
    let r2 = redis_connection.clone();

    let preview_id: Arc<Mutex<Option<Uuid>>> = Arc::new(Mutex::new(None));
    let p1 = preview_id.clone();
    let p2 = preview_id.clone();

    // message sending loop
    let mut send_task: JoinHandle<Result<(), anyhow::Error>> = tokio::spawn(async move {
        // stateful list of existing render queue and render results
        let mut re = r1.lock().await;
        let mut render_queue = list_render_tasks(&mut re).await?;
        let mut render_results = list_render_results(&postgres_pool).await?;

        // drop the lock after read to ensure others can read too
        drop(re);

        loop {
            // wait first; this way locks get dropped immediately after processing
            sleep(Duration::from_secs(1)).await;

            // check for queue changes
            let mut re = r1.lock().await;
            let new_queue = list_render_tasks(&mut re).await?;
            if new_queue != render_queue {
                render_queue = new_queue;
                send_ws_message(
                    &mut sender,
                    TypedMessage::new("refreshQueue".to_owned(), ()),
                )
                .await;
            }
            drop(re);

            // check for results changes
            let new_results = list_render_results(&postgres_pool).await?;
            if new_results != render_results {
                render_results = new_results;
                send_ws_message(&mut sender, TypedMessage::new("refreshResults", ())).await;
            }

            // check for preview id
            let mut re = r1.lock().await;
            let mut preview_id = p1.lock().await;
            if let Some(id) = *preview_id {
                if exists_preview_result(id, &mut re).await {
                    send_ws_message(&mut sender, TypedMessage::new("preview", id.to_string()))
                        .await;
                    *preview_id = None;
                }
            }
            drop(re);
        }
    });

    // message receiving loop
    let mut recv_task = tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(msg) => {
                    log_ws(&msg, who);

                    if let Message::Text(t) = msg {
                        let parsed: TypedMessage = match serde_json::from_str(&t) {
                            Ok(tm) => tm,
                            Err(e) => return anyhow!(e),
                        };
                        if parsed.kind == "preview" {
                            let mut redis_connection = r2.lock().await;
                            match handle_ws_preview(parsed, &mut redis_connection).await {
                                Ok(id) => {
                                    let mut preview_id = p2.lock().await;
                                    *preview_id = Some(id);
                                }
                                Err(err) => return anyhow!(err),
                            };
                        }
                    }
                }
                Err(e) => return anyhow!(e),
            }
        }
        anyhow!("no messages to receive")
    });

    // If any one of the tasks exit, abort the other.
    tokio::select! {
        _rv_a = (&mut send_task) => {
            recv_task.abort();
        },
        _rv_b = (&mut recv_task) => {
            send_task.abort();
        }
    }
}

pub(crate) async fn handle_ws_preview(
    parsed: TypedMessage,
    redis_connection: &mut ConnectionManager,
) -> Result<Uuid> {
    let render_task = serde_json::from_value(parsed.body).unwrap();
    let preview_id = match queue_previewtask(render_task, redis_connection).await {
        Ok(id) => id,
        Err(e) => {
            return Err(anyhow!(e));
        }
    };
    Ok(preview_id)
}

pub(crate) async fn send_ws_message(
    socket: &mut SplitSink<WebSocket, Message>,
    tmsg: TypedMessage,
) {
    socket.send(tmsg.into()).await.unwrap();
}

/// Helper to print contents of messages to stdout. Has special treatment for Close.
pub(crate) fn log_ws(msg: &Message, who: SocketAddr) {
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
pub(crate) struct TypedMessage {
    pub(crate) kind: String,
    pub(crate) body: serde_json::Value,
}

impl TypedMessage {
    pub(crate) fn new(kind: impl Into<String>, body: impl Into<serde_json::Value>) -> Self {
        Self {
            kind: kind.into(),
            body: body.into(),
        }
    }
}

impl From<anyhow::Error> for TypedMessage {
    fn from(val: anyhow::Error) -> Self {
        TypedMessage {
            kind: "error".to_owned(),
            body: serde_json::from_str(&val.to_string()).unwrap(),
        }
    }
}

impl From<TypedMessage> for Message {
    fn from(val: TypedMessage) -> Self {
        let json = json!(val);
        let msg: Message = json.to_string().into();
        msg
    }
}
