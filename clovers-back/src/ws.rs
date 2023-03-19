use anyhow::anyhow;
use axum::extract::ws::Message;
use axum::extract::ws::WebSocket;
use axum::extract::ConnectInfo;
use axum::extract::State;
use axum::extract::WebSocketUpgrade;
use axum::response::IntoResponse;
use clovers_svc_common::preview_result::exists_preview_result;
use clovers_svc_common::preview_task::queue_previewtask;
use redis::aio::ConnectionManager;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::net::SocketAddr;
use std::time::Duration;
use tokio::time::sleep;
use tracing::error;
use tracing::info;

/// WebSocket connection initiation handler
pub(crate) async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(redis_connection): State<ConnectionManager>,
) -> impl IntoResponse {
    info!("client {addr} connected");
    ws // load-bearing formatting comment
        .on_failed_upgrade(|err| error!("unable to upgrade websocket connection: {err}"))
        .on_upgrade(move |socket| {
            handle_socket(socket, addr, axum::extract::State(redis_connection))
        })
}

/// Actual websocket statemachine (one will be spawned per connection)
pub(crate) async fn handle_socket(
    mut socket: WebSocket,
    who: SocketAddr,
    State(mut redis_connection): State<ConnectionManager>,
) {
    loop {
        if let Some(msg) = socket.recv().await {
            match msg {
                Ok(msg) => {
                    log_ws(&msg, who);

                    if let Message::Text(t) = msg {
                        let parsed: TypedMessage = match serde_json::from_str(&t) {
                            Ok(tm) => tm,
                            Err(e) => return send_ws_error(&mut socket, anyhow!(e)).await,
                        };
                        if parsed.kind == "preview" {
                            handle_ws_preview(parsed, &mut redis_connection, &mut socket).await
                        }
                    }
                }
                Err(e) => error!("{e}"),
            }
        } else {
            // Stream has closed, return to drop the socket
            return;
        }
    }
}

pub(crate) async fn handle_ws_preview(
    parsed: TypedMessage,
    redis_connection: &mut ConnectionManager,
    socket: &mut WebSocket,
) {
    let render_task = serde_json::from_value(parsed.body).unwrap();
    let preview_id = match queue_previewtask(render_task, redis_connection).await {
        Ok(id) => id,
        Err(e) => {
            send_ws_error(socket, anyhow!(e)).await;
            return;
        }
    };

    // TODO: smarter solution than polling?
    // 300 retries at 100 ms each = 30 seconds max timeout
    let mut retries = 300;
    while retries > 0 {
        if exists_preview_result(preview_id, redis_connection).await {
            let reply = TypedMessage::new("preview", preview_id.to_string());
            send_ws_message(socket, reply).await;
            break;
        } else {
            retries -= 1;
            sleep(Duration::from_millis(100)).await;
        };
    }

    if retries == 0 {
        send_ws_error(socket, anyhow!("preview timed out")).await;
    }
}

pub(crate) async fn send_ws_message(socket: &mut WebSocket, tmsg: TypedMessage) {
    socket.send(tmsg.into()).await.unwrap();
}

pub(crate) async fn send_ws_error(socket: &mut WebSocket, err: anyhow::Error) {
    error!("{err}");
    let reply: TypedMessage = err.into();
    send_ws_message(socket, reply).await;
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
