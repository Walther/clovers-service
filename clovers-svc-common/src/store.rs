use std::str::FromStr;

use anyhow::{anyhow, Result};
use redis::{aio::ConnectionManager, AsyncCommands};
use serde_json::json;
use sqlx::{types::Uuid, Pool, Postgres, Row};

use super::*;

/// Adds a rendering task to the rendering queue.
///
/// This does two things:
/// 1. Creates a new key-value pair for the rendering data
/// 2. Adds the id to the FIFO rendering queue
pub async fn queue_rendertask(
    render_request: RenderTask,
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
    .bind(json!(render_request))
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("id")?,
        Err(e) => return Err(anyhow!("Error saving rendertask to postgres: {e}")),
    };

    let _count: u64 = match redis_connection
        .rpush(RENDER_QUEUE_NAME, id.to_string())
        .await
    {
        Ok(count) => count,
        Err(e) => return Err(anyhow!("Error saving rendertask to redis: {e}")),
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
pub async fn get_render_task(id: String, postgres_pool: &Pool<Postgres>) -> Result<RenderTask> {
    let id = Uuid::from_str(&id)?;
    let render_task: String = match sqlx::query(
        r#"
SELECT data FROM render_tasks
WHERE id = ( $1 )
        "#,
    )
    .bind(id)
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("data")?,
        Err(e) => return Err(anyhow!("Error fetching rendertask {id} from postgres: {e}")),
    };

    let render_task: RenderTask = serde_json::from_str(&render_task)?;

    Ok(render_task)
}

/// Deletes the full rendering task by id.
pub async fn delete_render_task(id: String, postgres_pool: &Pool<Postgres>) -> Result<Uuid> {
    let id = Uuid::from_str(&id)?;
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
        Err(e) => return Err(anyhow!("Error saving rendertask to postgres: {e}")),
    };

    Ok(id)
}

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
        Err(e) => return Err(anyhow!("Error saving rendertask to postgres: {e}")),
    };

    Ok(id)
}

/// Gets the full rendering result by id.
pub async fn get_render_result(id: String, postgres_pool: &Pool<Postgres>) -> Result<RenderResult> {
    let id = Uuid::from_str(&id)?;
    let data: Vec<u8> = match sqlx::query(
        r#"
SELECT data FROM render_results
WHERE id = ( $1 )
        "#,
    )
    .bind(id)
    .fetch_one(postgres_pool)
    .await
    {
        Ok(row) => row.try_get("data")?,
        Err(e) => {
            return Err(anyhow!(
                "Error fetching renderresult {id} from postgres: {e}"
            ))
        }
    };

    let render_result = RenderResult { data };

    Ok(render_result)
}

/// Pops the first rendering task in the rendering queue, returning the id.
pub async fn pop_render_queue(redis_connection: &mut ConnectionManager) -> Result<Uuid> {
    let rendertask_id: String = redis_connection.lpop(RENDER_QUEUE_NAME, None).await?;
    let rendertask_id = Uuid::from_str(&rendertask_id)?;
    Ok(rendertask_id)
}
