use anyhow::{anyhow, Result};
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use serde_json::json;
use uuid::Uuid;

use crate::common::{PreviewTask, RenderTask, PREVIEW_QUEUE_NAME, PREVIEW_RESULTS_NAME};

/// Checks whether an image preview with a given id exists i.e. has been completed
pub async fn exists_preview_result(
    preview_id: Uuid,
    redis_connection: &mut ConnectionManager,
) -> bool {
    let key = format!("{PREVIEW_RESULTS_NAME}.{preview_id}");
    (redis_connection.exists(key).await).unwrap_or(false)
}

/// Adds a rendering task to the preview rendering queue.
pub async fn queue_previewtask(
    render_task: RenderTask,
    redis_connection: &mut ConnectionManager,
) -> Result<Uuid> {
    let preview_id: Uuid = Uuid::new_v4();
    let preview_task = PreviewTask {
        preview_id,
        render_task,
    };
    let json = json!(preview_task);

    let _count: u64 = match redis_connection
        .rpush(PREVIEW_QUEUE_NAME, json.to_string())
        .await
    {
        Ok(count) => count,
        Err(e) => {
            let error_message = format!("Error saving previewtask to redis: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };
    tracing::info!("added a preview task {preview_id}");
    Ok(preview_id)
}

/// Gets a preview image from the previews set
pub async fn get_preview_result(
    preview_id: Uuid,
    redis_connection: &mut ConnectionManager,
) -> Result<Option<Vec<u8>>> {
    let key = format!("{PREVIEW_RESULTS_NAME}.{preview_id}");
    let data: Option<Vec<u8>> = match redis_connection.get(key).await {
        Ok(option_data) => option_data,
        Err(e) => {
            let error_message = format!("Error fetching preview_result {preview_id} error {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };
    Ok(data)
}
