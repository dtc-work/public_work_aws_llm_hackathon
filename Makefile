SHELL := /bin/bash

DIR := $(dir $(lastword $(MAKEFILE_LIST)))
APP_NAME := interviewai
FUNC_NAME := client
PYTEST_ARGS := --color=yes

buildup:
	docker compose up --build

buildupd:
	docker compose up -d --build

build_dev:
	-docker exec $(APP_NAME)-$(FUNC_NAME)-app /bin/sh -c 'pip install black ruff'

fmt:
	-docker exec $(APP_NAME)-$(FUNC_NAME)-app /bin/sh -c 'black .'

lint:
	-docker exec $(APP_NAME)-$(FUNC_NAME)-app /bin/sh -c 'ruff check .'

lintf:
	-docker exec $(APP_NAME)-$(FUNC_NAME)-app /bin/sh -c 'ruff check --fix .'

up:
	docker compose up

upd:
	docker compose up -d

start:
	docker compose start

stop:
	docker compose stop

restart:
	docker compose restart

rm:
	-docker stop $$(docker ps -aqf "name=${APP_NAME}")
	-docker rm $$(docker ps -aqf "name=${APP_NAME}")

rmi: rm
	-docker rmi $$(docker images | grep '${APP_NAME}' | awk '{print$$3}')
	-docker network rm $$(docker network ls | grep $(APP_NAME) | awk '{print$$2}')

logsf:
	docker compose logs -f

logs:
	docker compose logs

frontend_install:
	cd src/$(FUNC_NAME)/frontend && npm install

frontend_dev:
	cd src/$(FUNC_NAME)/frontend && npm run dev

frontend_lint:
	cd src/$(FUNC_NAME)/frontend && npm run lint

frontend_fmt:
	cd src/$(FUNC_NAME)/frontend && npm run fmt

frontend_build:
	cd src/$(FUNC_NAME)/frontend && npm run build

frontend_build_local:
	cd src/$(FUNC_NAME)/frontend && npm run build_local

pytest:
	docker exec $(APP_NAME)-$(FUNC_NAME)-app python -m pytest $(PYTEST_ARGS) /app/tests -v
