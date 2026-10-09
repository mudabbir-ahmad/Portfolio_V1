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
The container is non-root, read-only, capability-less and resource-capped, and bound
to 127.0.0.1 (put a TLS proxy in front, or set `TLS_CERT`/`TLS_KEY` / `FORCE_HTTPS`).
Values are passed at run time, so the same image works for any identity. Keep the
committed compose file generic and put real values in a gitignored
`docker-compose.override.yml`, or edit the environment block directly.
To ship a CV, set `VITE_CV_URL` and uncomment the `volumes:` line (the CV is never baked in).

## Without Docker
```
npm run deploy     # install, build, start on :3001
```
Update with `git pull && npm run setup && npm run build`, then restart the process.
