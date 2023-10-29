use anyhow::{anyhow, Result};
use aws_sdk_s3::primitives::ByteStream;
use sqlx;
use sqlx::types::Uuid;
use sqlx::Pool;
use sqlx::Postgres;
use sqlx::Row;

use crate::RenderResult;
use crate::BUCKET_NAME;

/// Saves the full rendering result
pub async fn save_render_result(
    render_result: RenderResult,
    postgres_pool: &Pool<Postgres>,
    s3: &aws_sdk_s3::Client,
) -> Result<Uuid> {
    let id: Uuid = match sqlx::query(
        r#"
INSERT INTO render_results
VALUES ( default )
RETURNING id
      "#,
    )
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

    let path = format!("images/{id}");
    put_object(s3, path, render_result.image).await?;
    let path = format!("thumbs/{id}");
    put_object(s3, path, render_result.thumb).await?;

    Ok(id)
}

pub async fn put_object(
    s3: &aws_sdk_s3::Client,
    path: String,
    data: Vec<u8>,
) -> Result<(), anyhow::Error> {
    tracing::debug!("put_object called");
    let body = ByteStream::from(data);
    match s3
        .put_object()
        .bucket(BUCKET_NAME)
        .key(path)
        .body(body)
        .send()
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => {
            let source = e.into_source()?;
            tracing::error!("{source}");
            Err(anyhow!(source.to_string()))
        }
    }
}

pub async fn get_object(s3: &aws_sdk_s3::Client, path: String) -> Result<Vec<u8>, anyhow::Error> {
    let object = s3.get_object().bucket(BUCKET_NAME).key(path).send().await?;
    let data = object.body.collect().await?.into_bytes().into();
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

/// Gets the full rendering result by id.
pub async fn get_render_result(id: Uuid, s3: &aws_sdk_s3::Client) -> Result<Option<Vec<u8>>> {
    let path = format!("images/{id}");
    match get_object(s3, path).await {
        Ok(it) => Ok(Some(it)),
        Err(err) => Err(err),
    }
}

/// Gets the thumbnail by id.
pub async fn get_thumb(id: Uuid, s3: &aws_sdk_s3::Client) -> Result<Option<Vec<u8>>> {
    let path = format!("thumbs/{id}");
    match get_object(s3, path).await {
        Ok(it) => Ok(Some(it)),
        Err(err) => Err(err),
    }
}
