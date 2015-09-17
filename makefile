all: tests dev prod

dev:
	./node_modules/webpack/bin/webpack.js

prod:
	NODE_ENV=production ./node_modules/webpack/bin/webpack.js

tests:
	./node_modules/mocha/bin/mocha

.PHONY: dist