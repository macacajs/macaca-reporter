npm_bin= `npm bin`

all: test
install:
	@npm install
test:
	@node --harmony \
		${npm_bin}/istanbul cover ${npm_bin}/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
.PHONY: test
