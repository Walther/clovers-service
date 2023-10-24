use std::str::FromStr;
use std::sync::Arc;

use axum::extract::Path;
use axum::extract::State;
use axum::http::header::CONTENT_TYPE;
use axum::http::StatusCode;
use axum::response::AppendHeaders;
use axum::response::IntoResponse;
use axum::Json;
use redis::aio::ConnectionManager;
use sqlx::types::Uuid;
use sqlx::Pool;
use sqlx::Postgres;
use tokio::sync::Mutex;
use tracing::error;

use crate::common::RenderTask;
use crate::preview::get_preview_result;
use crate::preview::queue_previewtask;
use crate::render_result::get_render_result;
use crate::render_result::list_render_results;
use crate::render_task::list_render_tasks;
use crate::render_task::queue_rendertask;

/// Queues a preview task to the Redis preview queue, to be processed by the batch worker.
pub(crate) async fn preview_post(
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
    Json(render_request): Json<RenderTask>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let mut redis_connection = redis_connection.lock().await;
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
pub(crate) async fn preview_get(
    Path(id): Path<String>,
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let preview_id = match Uuid::from_str(&id) {
        Ok(id) => id,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::BAD_REQUEST, Json(e.to_string())));
        }
    };
    let mut redis_connection = redis_connection.lock().await;
    let preview = match get_preview_result(preview_id, &mut redis_connection).await {
        Ok(Some(data)) => data,
        Ok(None) => return Err((StatusCode::NOT_FOUND, Json("not found".to_string()))),
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    Ok((
        StatusCode::OK,
        AppendHeaders([(CONTENT_TYPE, "image/png")]),
        preview,
    ))
}

/// Queues a rendering task to the Redis rendering queue, to be processed by the batch worker.
pub(crate) async fn queue_post(
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
    State(postgres_pool): State<Pool<Postgres>>,
    Json(render_request): Json<RenderTask>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let mut redis_connection = redis_connection.lock().await;
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
pub(crate) async fn queue_list_all(
    State(redis_connection): State<Arc<Mutex<ConnectionManager>>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let mut redis_connection = redis_connection.lock().await;
    let rendertasks = match list_render_tasks(&mut redis_connection).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    Ok((StatusCode::OK, Json(rendertasks)))
}

/// Get the render result by id
pub(crate) async fn render_result_get(
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
        Ok(Some(data)) => data,
        Ok(None) => return Err((StatusCode::NOT_FOUND, Json("not found".to_string()))),
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
pub(crate) async fn render_result_list_all(
    State(postgres_pool): State<Pool<Postgres>>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let render_results: Vec<Uuid> = match list_render_results(&postgres_pool).await {
        Ok(data) => data,
        Err(e) => {
            error!("{e}");
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())));
        }
    };
    let render_results: Vec<Uuid> = render_results;

    Ok((StatusCode::OK, Json(render_results)))
}
