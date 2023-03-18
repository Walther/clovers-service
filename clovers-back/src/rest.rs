use std::str::FromStr;

use axum::extract::Path;
use axum::extract::State;
use axum::http::header::CONTENT_TYPE;
use axum::http::StatusCode;
use axum::response::AppendHeaders;
use axum::response::IntoResponse;
use axum::Json;
use clovers_svc_common::preview_result::*;
use clovers_svc_common::preview_task::*;
use clovers_svc_common::render_result::*;
use clovers_svc_common::render_task::*;
use clovers_svc_common::*;
use redis::aio::ConnectionManager;
use sqlx::types::Uuid;
use sqlx::Pool;
use sqlx::Postgres;
use tracing::error;

/// Queues a preview task to the Redis preview queue, to be processed by the batch worker.
pub(crate) async fn preview_post(
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
pub(crate) async fn preview_get(
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
pub(crate) async fn queue_post(
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
pub(crate) async fn queue_list_all(
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
pub(crate) async fn queue_get(
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
    // TODO: can this be cleaned up somehow?
    let render_results: Vec<String> = render_results.iter().map(|id| id.to_string()).collect();

    Ok((StatusCode::OK, Json(render_results)))
}