
# Current setup

- Use `file:` relative path in [package.json](package.json). This goes into the lockfile. This ensures that installation fails if it's not there, instead of failing at runtime.
- Manually clone it into place in [GitHub Actions](.github/workflows/deploy.yml). We have to npm install in it manually. Now npm install here should work.
- Use relative path in ESM import in [code](editor.mjs)
- Run vite as per normal, then `npm run build` in dependency repo to update

# Old setup using npm link

```sh
(cd ~/js/editor/codemirror-vim; npm i && npm link)
cd ~/js/dynamic-docs/
npm link @replit/codemirror-vim
```
