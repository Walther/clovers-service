# List the available recipes
default:
  @just --list --unsorted

# Build all the container images
build:
  docker-compose build --parallel -m 16G

# Start the services. Run this after building.
up:
  docker-compose up

# Clean up the services. Run build afterwards before up.
down:
  docker-compose down --rmi local -v
