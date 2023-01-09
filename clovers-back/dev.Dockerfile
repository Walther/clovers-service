FROM rust:1.61.0 as rust-hotreload
WORKDIR /app

RUN cargo install cargo-watch
