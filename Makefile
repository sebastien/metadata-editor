SOURCES=$(wildcard src/*.* src/*/*.* src/*/*/*.* src/*/*/*/*.* src/*/*/*/*.*)

build: $(SOURCES) package.json
	@npm run-script build

run:
	@npm run-script start

# EOF
