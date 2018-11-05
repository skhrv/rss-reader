develop:
	npm run webpack-serve

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

lint:
	npm run eslint .

deploy:
	make build
	surge ./dist --domain curious-amount.surge.sh