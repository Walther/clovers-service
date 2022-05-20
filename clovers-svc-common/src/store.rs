use redis::{aio::ConnectionManager, AsyncCommands};
use serde_json::json;
use uuid::Uuid;

use super::*;

/// Adds a rendering task to the rendering queue.
///
/// This does two things:
/// 1. Creates a new key-value pair for the rendering data
/// 2. Adds the id to the FIFO rendering queue
pub async fn queue_rendertask(
    render_request: RenderRequest,
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<String> {
    let id = Uuid::new_v4().to_string();
    let key = format!("{RENDER_TASK_PREFIX}{id}");
    let value = json!(render_request).to_string();

    // TODO: this should be a transaction block. However, https://github.com/redis-rs/redis-rs/issues/353
    redis_connection.set(key, value).await?;
    redis_connection
        .rpush(RENDER_QUEUE_NAME, id.clone())
        .await?;

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
    id: String, // TODO: Uuid v4 type here?
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<String> {
    let key = format!("{RENDER_TASK_PREFIX}{id}");
    let rendertask: String = redis_connection.get(key).await?;
    Ok(rendertask)
}

/// Deletes the full rendering task by id.
pub async fn delete_render_task(
    id: String, // TODO: Uuid v4 type here?
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<u64> {
    let key = format!("{RENDER_TASK_PREFIX}{id}");
    let rendertask: u64 = redis_connection.del(key).await?;
    Ok(rendertask)
}

/// Gets the full rendering result by id.
pub async fn get_render_result(
    id: String, // TODO: Uuid v4 type here?
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<String> {
    let key = format!("{RENDER_RESULT_PREFIX}{id}");
    let rendertask: String = redis_connection.get(key).await?;
    Ok(rendertask)
}

/// Pops the first rendering task in the rendering queue, returning the id.
pub async fn pop_render_queue(
    redis_connection: &mut ConnectionManager,
) -> redis::RedisResult<String> {
    let rendertask: String = redis_connection.lpop(RENDER_QUEUE_NAME, None).await?;
    Ok(rendertask)
}
