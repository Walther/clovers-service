use crate::{PreviewTask, PREVIEW_QUEUE_NAME};

use super::super::RenderTask;
use anyhow::{anyhow, Result};
use redis;
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use serde_json::{from_str, json};
use uuid::Uuid;

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

/// Pops the first preview task in the preview queue, returning the json.
pub async fn pop_preview_queue(redis_connection: &mut ConnectionManager) -> Result<PreviewTask> {
    let previewtask: String = redis_connection.lpop(PREVIEW_QUEUE_NAME, None).await?;
    let previewtask: PreviewTask = from_str(&previewtask)?;
    Ok(previewtask)
}
