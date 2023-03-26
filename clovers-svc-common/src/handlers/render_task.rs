use crate::RENDER_QUEUE_NAME;

use super::super::RenderTask;
use anyhow::{anyhow, Result};
use redis;
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use serde_json::json;
use sqlx::{
    self,
    types::{Json, Uuid},
    Pool, Postgres, Row,
};
use std::str::FromStr;

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

/// Gets the full rendering task by id.
pub async fn get_render_task(
    id: Uuid,
    postgres_pool: &Pool<Postgres>,
) -> Result<Option<RenderTask>> {
    let render_task: Json<RenderTask> = match sqlx::query(
        r#"
SELECT data FROM render_tasks
WHERE id = ( $1 )
      "#,
    )
    .bind(id)
    .fetch_optional(postgres_pool)
    .await
    {
        Ok(Some(row)) => row.try_get("data")?,
        Ok(None) => return Ok(None),
        Err(e) => {
            let error_message = format!("Error fetching rendertask {id} from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    let render_task = render_task.as_ref().to_owned();
    Ok(Some(render_task))
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

/// Pops the first rendering task in the rendering queue, returning the id.
pub async fn pop_render_queue(redis_connection: &mut ConnectionManager) -> Result<Uuid> {
    let rendertask_id: String = redis_connection.lpop(RENDER_QUEUE_NAME, None).await?;
    let rendertask_id = Uuid::from_str(&rendertask_id)?;
    Ok(rendertask_id)
}
