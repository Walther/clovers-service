# clovers-service

Frontend + Backend + Batch for [clovers](https://github.com/walther/clovers), the raytracing renderer.

## clovers-front

Web frontend service, user-facing interface for the application. Written in Typescript using React with [create-react-app](https://github.com/facebook/create-react-app/).

## clovers-back

Web backend service, handles API requests. Written in Rust using [axum](https://github.com/tokio-rs/axum).

## clovers-batch

Batch processing service, handles offline rendering of longer tasks with a high amount of resources available. Written in Rust using [axum](https://github.com/tokio-rs/axum).

## clovers-preview

Preview processing service, handles near-realtime rendering for web UI purposes. Written in Rust using [axum](https://github.com/tokio-rs/axum).

## postgres

Main database for the service. Persistent data.

## redis

Queue service for the preview rendering tasks and results. Ephemeral data.

## Usage

Note: first time build times will be slow.

- Development mode: `just dev`
- Production mode: `just prod`

In development mode, hot reload will be available for all services.

## Sequence diagrams

### Full render flow

```mermaid
sequenceDiagram
    participant front
    participant back
    participant postgres
    participant redis
    participant batch
    loop
      batch->>redis: pop render_task queue
      redis-->>batch: nil
    end
    note left of batch: todo: remove redis <br> in full render flow?
    front->>back: POST /render
    back->>postgres: save render_task
    back->>redis: queue render_task id
    back->>front: render_task id
    batch->>redis: pop render_task queue
    redis->>batch: render_task id
    batch->>postgres: get render_task by id
    postgres->>batch: ;
    note over batch: rendering
    batch->>postgres: delete render_task
    batch->>postgres: save render_result
    note left of batch: todo: object storage?
    front-->batch: ;
    front->>back: GET /renders
    back->>postgres: get render_result ids
    postgres->>back: ;
    back->>front: ;
    front->>back: GET /renders/:id
    back->>postgres: get render_result
    postgres->>back: ;
    back->>front: .png;
```

### Preview render flow

```mermaid
sequenceDiagram
    participant front
    participant back
    participant redis
    participant preview
    loop
      preview->>redis: pop preview_task queue
      redis-->>preview: nil
    end
    front->>back: POST /preview
    back->>redis: queue preview
    back->>front: preview id
    preview->>redis: pop preview_task queue
    redis->>preview: preview task
    note over preview: rendering
    note right of front: todo: websocket?
    loop
      front->>back: GET /preview/:id
      back->>redis: ;
      redis-->>back: nil
      back-->>front: ;
    end
    preview->>redis: save preview_result
    front->>back: GET /preview/:id
    back->>redis: get preview
    redis->>back: ;
    back->>front: .png
    note right of redis: todo: redis TTL <br> for auto cleanup
```
