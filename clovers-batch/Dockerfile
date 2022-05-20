FROM rust:1.60-bullseye as builder
WORKDIR /usr/src/clovers-batch
COPY . .
RUN cargo install --path ./clovers-batch

FROM debian:bullseye-slim
COPY --from=builder /usr/local/cargo/bin/clovers-batch /usr/local/bin/clovers-batch
CMD ["clovers-batch"]
