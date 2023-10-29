-- Table for the render tasks
create table if not exists render_tasks (
  id uuid primary key default gen_random_uuid(),
  -- json data with the rendering task details
  data jsonb not null
  -- TODO: metadata in some convenient format
  -- metadata jsonb not null
);
-- Table for the render results
create table if not exists render_results (
  id uuid primary key default gen_random_uuid(),
  -- png binary data
  image bytea not null,
  -- png binary data
  thumb bytea not null
  -- TODO: metadata in some convenient format
  -- metadata jsonb not null
);
-- TODO: users table
