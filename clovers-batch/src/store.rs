use std::str::FromStr;

use super::RenderTask;
use anyhow::{anyhow, Result};
use redis::{aio::ConnectionManager, AsyncCommands};
use sqlx::{
    types::{Json, Uuid},
    Pool, Postgres, Row,
};

use super::*;

/// Gets the full rendering task by id.
pub async fn get_render_task(id: Uuid, postgres_pool: &Pool<Postgres>) -> Result<RenderTask> {
    let render_task: Json<RenderTask> = match sqlx::query(
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
        Err(e) => {
            let error_message = format!("Error fetching rendertask {id} from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    // TODO: is this actually the correct way to do this? .as_ref().to_owned()
    Ok(render_task.as_ref().to_owned())
}

/// Deletes the full rendering task by id.
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
            let error_message = format!("Error saving rendertask to postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
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
        Err(e) => {
            let error_message = format!("Error saving rendertask to postgres: {e}");
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
