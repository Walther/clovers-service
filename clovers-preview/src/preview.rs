use crate::common::{
    PreviewTask, RenderResult, PREVIEW_EXPIRY_SECONDS, PREVIEW_QUEUE_NAME, PREVIEW_RESULTS_NAME,
};
use anyhow::Result;
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use serde_json::from_str;
use uuid::Uuid;

/// Saves a preview image into the previews set
pub async fn save_preview_result(
    preview_id: Uuid,
    render_result: RenderResult,
    redis_connection: &mut ConnectionManager,
) -> Result<Uuid> {
    let key = format!("{PREVIEW_RESULTS_NAME}.{preview_id}");
    redis_connection
        .set_ex(key, render_result.data, PREVIEW_EXPIRY_SECONDS)
        .await?;
    Ok(preview_id)
}

/// Pops the first preview task in the preview queue, returning the json.
pub async fn pop_preview_queue(redis_connection: &mut ConnectionManager) -> Result<PreviewTask> {
    let previewtask: String = redis_connection.lpop(PREVIEW_QUEUE_NAME, None).await?;
    let previewtask: PreviewTask = from_str(&previewtask)?;
    Ok(previewtask)
}
