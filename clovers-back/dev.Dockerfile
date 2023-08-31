FROM rust:1.72 as rust-hotreload
WORKDIR /app

RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN export PATH=$PATH:~/.cargo/bin
RUN cargo binstall -y cargo-watch
