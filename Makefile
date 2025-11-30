
.PHONY: all
all:
# npm install -D vite
	npx vite

deps:
	npm i
	npm link @replit/codemirror-vim