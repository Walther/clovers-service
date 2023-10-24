prodyaml := "docker-compose.yml"
devyaml := "docker-compose.dev.yml"
workeryaml := "docker-compose.worker.yml"

# List the available recipes
default:
  @just --list --unsorted

dev:
  docker compose -f {{devyaml}} up --build

prod:
  docker compose -f {{prodyaml}} up --build

worker:
  docker compose -f {{workeryaml}} up --build

dev-down:
  docker compose -f {{devyaml}} down

prod-down:
  docker compose -f {{prodyaml}} down

worker-down:
  docker compose -f {{workeryaml}} up --build

# Clean up the services. Run build afterwards before up.
clean:
  docker compose -f {{prodyaml}} down --rmi local -v
  docker compose -f {{devyaml}} down --rmi local -v
  docker compose -f {{workeryaml}} down --rmi local -v
