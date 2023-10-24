use anyhow::{anyhow, Result};
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use serde_json::json;
use sqlx::{self, types::Uuid, Pool, Postgres, Row};

use crate::common::{RenderTask, RENDER_QUEUE_NAME};

/// Adds a rendering task to the rendering queue.
///
/// This does two things:
/// 1. Creates a new key-value pair for the rendering data
/// 2. Adds the id to the FIFO rendering queue
pub async fn queue_rendertask(
    render_task: RenderTask,
    redis_connection: &mut ConnectionManager,
    postgres_pool: &Pool<Postgres>,
) -> Result<Uuid> {
    let id: Uuid = match sqlx::query(
        r#"
INSERT INTO render_tasks ( data )
VALUES ( $1 )
RETURNING id
    "#,
    )
    .bind(json!(render_task))
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("id")?,
        Err(e) => {
            tracing::error!("{e}");
            return Err(anyhow!("Error saving rendertask to postgres: {e}"));
        }
    };

    let _count: u64 = match redis_connection
        .rpush(RENDER_QUEUE_NAME, id.to_string())
        .await
    {
        Ok(count) => count,
        Err(e) => {
            let error_message = format!("Error saving rendertask to redis: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    Ok(id)
}

/// Lists all rendering tasks in the rendering queue.
pub async fn list_render_tasks(
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<Vec<String>> {
    let rendertasks: Vec<String> = redis_connection.lrange(RENDER_QUEUE_NAME, 0, -1).await?;
    Ok(rendertasks)
}
