use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

pub mod store;

/// Redis prefix for the render task keys
pub const RENDER_TASK_PREFIX: &str = "render_task:";
/// Redis prefix for the render result keys
pub const RENDER_RESULT_PREFIX: &str = "render_result:";
/// Redis list name for the rendering queue
pub const RENDER_QUEUE_NAME: &str = "render_queue";

/// Main configuration structure for the application
#[derive(Debug)]
pub struct Config {
    /// Address and port to start the server at, eg. `0.0.0.0:8080`.
    pub listen_address: SocketAddr,
    /// Log level configuration. Example: `clovers_back=trace,tower_http=trace`.
    pub rustlog: String,
    /// Full address string of the redis server to connect to, e.g. `redis://redis:6379/`
    pub redis_connectioninfo: redis::ConnectionInfo,
}

/// Loads the configuration from the .env file, erroring if required fields are missing or malformed.
pub fn load_configs() -> anyhow::Result<Config> {
    dotenv().ok();
    let listen_address = dotenv::var("LISTEN_ADDRESS")?.parse()?;
    let rustlog = dotenv::var("RUST_LOG")?;
    let redis_connectioninfo = dotenv::var("REDIS_CONNETIONINFO")?.parse()?;

    Ok(Config {
        listen_address,
        rustlog,
        redis_connectioninfo,
    })
}

/// The main object for a rendering request. Contains all the information necessary for performing a full render of a scene.
#[derive(Serialize, Deserialize, Debug)]
pub struct RenderRequest {
    /// minimum viable test: name of existing scene file
    pub path: String,
}
