FROM rust:1.60-bullseye as builder
WORKDIR /usr/src/clovers-back
COPY . .
RUN cargo install --path ./clovers-back

FROM debian:bullseye-slim
COPY --from=builder /usr/local/cargo/bin/clovers-back /usr/local/bin/clovers-back
CMD ["clovers-back"]
