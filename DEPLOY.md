# Deploying

## Adding project images
1. Copy the files into `public/images/projects/`.
2. Add the filenames under the project's id in `src/project-images.json`.
   Several filenames = carousel.

## First-time server setup
1. `git clone` the repo, then create `secrets/.env` from `.env.example`
   (set `VITE_*` values, `GITHUB_TOKEN` (read-only PAT), `ALLOWED_ORIGIN`, and
   either `TLS_CERT`/`TLS_KEY` or `FORCE_HTTPS=true` behind a TLS proxy).
2. Put your CV at `public/CV/` (gitignored, so copy it over manually).
3. `npm run deploy` — installs, builds, and starts the server (default port 3001).

## Updating
```
git pull && npm run setup && npm run build
```
then restart the process (systemd/pm2). The token lives only in `secrets/.env`
and is only ever used by `server/index.js`; the browser never sees it.
