use anyhow::{anyhow, Result};
use sqlx;
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

/// Gets the full rendering result by id.
pub async fn get_render_result(
    id: Uuid,
    postgres_pool: &Pool<Postgres>,
) -> Result<Option<Vec<u8>>> {
    let data: Option<Vec<u8>> = match sqlx::query(
        r#"
SELECT data FROM render_results
WHERE id = ( $1 )
      "#,
    )
    .bind(id)
    .fetch_optional(postgres_pool)
    .await
    {
        Ok(Some(row)) => row.try_get("data")?,
        Ok(None) => None,
        Err(e) => {
            let error_message = format!("Error fetching render_result {id} from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    Ok(data)
}

/// Lists all rendering results in the db
pub async fn list_render_results(postgres_pool: &Pool<Postgres>) -> Result<Vec<Uuid>> {
    let render_result_ids: Result<Vec<Uuid>, sqlx::Error> = match sqlx::query(
        r#"
SELECT id FROM render_results
      "#,
    )
    .fetch_all(postgres_pool)
    .await
    {
        Ok(rows) => rows.iter().map(|row| row.try_get("id")).collect(),
        Err(e) => {
            let error_message = format!("Error listing render_results from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };
    // TODO: ergonomics...
    let render_result_ids = match render_result_ids {
        Ok(data) => data,
        Err(e) => {
            let error_message = format!("Error listing render_results from postgres: {e}");
            tracing::error!("{error_message}");
            return Err(anyhow!("{error_message}"));
        }
    };

    Ok(render_result_ids)
}
