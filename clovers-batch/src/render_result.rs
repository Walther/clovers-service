use anyhow::{anyhow, Result};
use sqlx::types::Uuid;
use sqlx::Pool;
use sqlx::Postgres;
use sqlx::Row;

use crate::RenderResult;

/// Saves the full rendering result
pub async fn save_render_result(
    render_result: RenderResult,
    postgres_pool: &Pool<Postgres>,
) -> Result<Uuid> {
    let id: Uuid = match sqlx::query(
        r#"
INSERT INTO render_results ( data )
VALUES ( $1 )
RETURNING id
      "#,
    )
    .bind(render_result.data)
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("id")?,
        Err(e) => {
            let error_message = format!("Error saving rendertask to postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    Ok(id)
}

/// Deletes the rendering task by id.
pub async fn delete_render_task(id: Uuid, postgres_pool: &Pool<Postgres>) -> Result<Uuid> {
    let id: Uuid = match sqlx::query(
        r#"
DELETE FROM render_tasks
WHERE id = ( $1 )
RETURNING id
    "#,
    )
    .bind(id)
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("id")?,
        Err(e) => {
            let error_message = format!("Error deleting rendertask from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    Ok(id)
}
