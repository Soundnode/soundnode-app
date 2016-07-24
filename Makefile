GIT_VERSION := $(shell git describe --tags --long --dirty --always)

.DEFAULT_GOAL := help

.PHONY: build
build: ## Build the project
	npm install grunt-cli webpack nw-gyp request
	npm install --legacy-bundling
	node_modules/grunt-cli/bin/grunt build

.PHONY: deb
deb: build ## Build debian packages (32bit + 64bit)
	VERSION=$(GIT_VERSION) DIST=linux32 ./fpm/build-deb
	VERSION=$(GIT_VERSION) DIST=linux64 ./fpm/build-deb

clean:
	git clean -fdX
	rm -f fpm/soundnode-48x48.png
	rm -rf cache/0.12.3/osx64/nwjs-v0.12.3-osx-x64/

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

