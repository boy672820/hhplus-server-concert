.PHONY: build-local
build-local: ## Build the local docker image.
	docker compose --env-file .env -f docker/local/docker-compose.yml -f docker/local/docker-compose.kafka.yml build

.PHONY: start-local
start-local: ## Start the local docker container.
	docker compose --env-file .env -f docker/local/docker-compose.yml -f docker/local/docker-compose.kafka.yml up -d

.PHONY: stop-local
stop-local: ## Stop the local docker container.
	docker compose --env-file .env -f docker/local/docker-compose.yml -f docker/local/docker-compose.kafka.yml down

.PHONY: build-test
build-test: ## Build the test docker image.
	docker compose --env-file .env.test -f docker/test/docker-compose.yml -f docker/test/docker-compose.kafka.yml build

.PHONY: start-test
start-test: ## Start the test docker container.
	docker compose --env-file .env.test -f docker/test/docker-compose.yml -f docker/test/docker-compose.kafka.yml up -d

.PHONY: stop-test
stop-test: ## Stop the test docker container.
	docker compose --env-file .env.test -f docker/test/docker-compose.yml -f docker/test/docker-compose.kafka.yml down
