use anyhow::Result;
use axum::{routing::get, Router};
use dotenv::dotenv;
use std::net::SocketAddr;
use tower_http::{
    trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer},
    LatencyUnit,
};
use tracing::Level;
use tracing_subscriber::fmt::time;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

/// Main configuration structure for the application
#[derive(Debug)]
struct Config {
    /// Address and port to start the server at, eg. `0.0.0.0:8080`.
    listen_address: SocketAddr,
    /// Log level configuration. Example: `clovers_back=trace,tower_http=trace`.
    rustlog: String,
}

/// Loads the configuration from the .env file, erroring if required fields are missing or malformed.
fn load_configs() -> Result<Config> {
    dotenv().ok();
    let listen_address = dotenv::var("LISTEN_ADDRESS")?.parse()?;
    let rustlog = dotenv::var("RUST_LOG")?;

    Ok(Config {
        listen_address,
        rustlog,
    })
}

#[tokio::main]
async fn main() -> Result<()> {
    // load configs
    let config = load_configs()?;

    // set up the tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(&config.rustlog))
        .with(tracing_subscriber::fmt::layer().with_timer(time::UtcTime::rfc_3339()))
        .init();
    tracing::debug!("starting with configuration: {:?}", &config);

    // assemble the application
    let app = Router::new()
        // `GET /` goes to `hello`
        .route("/", get(hello))
        // tracing layer
        .layer(
            TraceLayer::new_for_http()
                .on_request(DefaultOnRequest::new().level(Level::INFO))
                .on_response(
                    DefaultOnResponse::new()
                        .level(Level::INFO)
                        .latency_unit(LatencyUnit::Micros),
                ),
        );

    // run the app
    tracing::info!("listening on {}", config.listen_address);
    axum::Server::bind(&config.listen_address)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}

/// simple example route handler
async fn hello() -> &'static str {
    "Hello, World!\n"
}
