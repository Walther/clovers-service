FROM rust:1.68 as rust-hotreload
WORKDIR /app

RUN cargo install cargo-watch
