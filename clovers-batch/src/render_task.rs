use anyhow::{anyhow, Result};
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use sqlx::{
    self,
    types::{Json, Uuid},
    Pool, Postgres, Row,
};
use std::str::FromStr;

use crate::common::{RenderTask, RENDER_QUEUE_NAME};

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

/// Pops the first rendering task in the rendering queue, returning the id.
pub async fn pop_render_queue(redis_connection: &mut ConnectionManager) -> Result<Uuid> {
    let rendertask_id: String = redis_connection.lpop(RENDER_QUEUE_NAME, None).await?;
    let rendertask_id = Uuid::from_str(&rendertask_id)?;
    Ok(rendertask_id)
}
