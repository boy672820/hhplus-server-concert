.PHONY: build-local
build-local: ## Build the local docker image.
	docker compose --env-file .env -f docker/local/docker-compose.yml build

.PHONY: start-local
start-local: ## Start the local docker container.
	docker compose --env-file .env -f docker/local/docker-compose.yml up -d

.PHONY: stop-local
stop-local: ## Stop the local docker container.
	docker compose --env-file .env -f docker/local/docker-compose.yml down
