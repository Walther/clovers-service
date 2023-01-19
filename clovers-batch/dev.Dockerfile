FROM rust:1.66.1 as rust-hotreload
WORKDIR /app

RUN cargo install cargo-watch
