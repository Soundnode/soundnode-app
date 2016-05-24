GIT_VERSION := $(shell git describe --tags --long --dirty --always)

.DEFAULT_GOAL := help

.PHONY: build
build: ## Build the project
	sudo npm install --global grunt-cli webpack
	npm install --legacy-bundling
	grunt build

.PHONY: deb
deb: build ## Build debian packages (32bit + 64bit)
	VERSION=$(GIT_VERSION) DIST=linux32 ./fpm/build-deb
	VERSION=$(GIT_VERSION) DIST=linux64 ./fpm/build-deb

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

