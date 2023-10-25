use clovers::{scenes::SceneFile, RenderOpts};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use uuid::Uuid;

/// Data related operations, postgres & redis
mod handlers;
pub use handlers::*;

/// Re-export the clovers library for internal use
pub use clovers;

/// Rendering command for internal use
mod draw_cpu;
pub use draw_cpu::draw;

/// Redis list name for the rendering queue
pub const RENDER_QUEUE_NAME: &str = "render_queue";
/// Redis list name for the preview queue
pub const PREVIEW_QUEUE_NAME: &str = "preview_queue";
/// Redis set name for the preview results
pub const PREVIEW_RESULTS_NAME: &str = "preview_results";
// Redis expiry time for the preview results
pub const PREVIEW_EXPIRY_SECONDS: usize = 60;

/// Main configuration structure for the application
#[derive(Debug)]
pub struct Config {
    /// Address and port to start the server at, eg. `0.0.0.0:8080`.
    pub listen_address: SocketAddr,
    /// Log level configuration. Example: `clovers_back=trace,tower_http=trace`.
    pub rustlog: String,
    /// Full address string of the redis server to connect to, e.g. `redis://redis:6379/`
    pub redis_connectioninfo: redis::ConnectionInfo,
    /// Full address string of the postgres server to connect to, e.g. `postgres://postgres:password@localhost/test`
    pub postgres_connectioninfo: String,
    /// Address of the frontend. Used for CORS allow purposes
    pub frontend_address: String,
}

/// Loads the configuration from the .env file, erroring if required fields are missing or malformed.
pub fn load_configs() -> anyhow::Result<Config> {
    dotenv().ok();
    let listen_address = dotenv::var("LISTEN_ADDRESS")?.parse()?;
    let rustlog = dotenv::var("RUST_LOG")?;
    let redis_connectioninfo = dotenv::var("REDIS_CONNECTIONINFO")?.parse()?;
    let postgres_connectioninfo = dotenv::var("POSTGRES_CONNECTIONINFO")?.parse()?;
    let frontend_address = dotenv::var("FRONTEND_ADDRESS")?.parse()?;

    Ok(Config {
        listen_address,
        rustlog,
        redis_connectioninfo,
        postgres_connectioninfo,
        frontend_address,
    })
}

/// The main object for a rendering request. Contains all the information necessary for performing a full render of a scene.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RenderTask {
    /// All the details of the scene to be rendered
    pub scene_file: SceneFile,
    /// Rendering options for the render
    pub opts: RenderOpts,
}

/// The main object for the rendering result. Contains an image and assorted metadata.
#[derive(Serialize, Deserialize, Debug)]
pub struct RenderResult {
    /// minimum viable test: vec of bytes
    pub data: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub struct PreviewTask {
    pub preview_id: Uuid,
    pub render_task: RenderTask,
}
