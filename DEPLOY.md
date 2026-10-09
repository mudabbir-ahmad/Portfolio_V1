# Deploying

## Where the settings live
| Run mode | Name, email, links, GitHub token come from |
|---|---|
| Without Docker (`npm run dev`, `npm start`) | `secrets/.env` (copy `.env.example`) |
| Docker | the `environment:` block in `docker-compose.yml` only |

Everything else (About text, experience, projects, skills...) is in `src/data/*.json`.

## Adding project images
1. Copy the files into `public/images/projects/`.
2. Add the filenames to that project's `images` list in `src/data/projects.json`.
   Several filenames = carousel.

## Docker
```
docker compose up -d --build     # or: npm run docker
```
The container is non-root, read-only, capability-less and resource-capped. It publishes
port 3001 only; Nginx Proxy Manager sits in front for TLS and the public side.
The compose defaults are the public details from the CV. Put the one secret, `GITHUB_TOKEN`,
in a gitignored root `.env` file (compose reads it automatically), never in the compose file.
The CV is mounted from `public/CV` at run time and is never baked into the image.

## Without Docker
```
npm run deploy     # install, build, start on :3001
```
Update with `git pull && npm run setup && npm run build`, then restart the process.
