use anyhow::{anyhow, Result};
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use uuid::Uuid;

use crate::{RenderResult, PREVIEW_EXPIRY_SECONDS, PREVIEW_RESULTS_NAME};

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

/// Checks whether an image preview with a given id exists i.e. has been completed
pub async fn exists_preview_result(
    preview_id: Uuid,
    redis_connection: &mut ConnectionManager,
) -> bool {
    let key = format!("{PREVIEW_RESULTS_NAME}.{preview_id}");
    (redis_connection.exists(key).await).unwrap_or(false)
}
