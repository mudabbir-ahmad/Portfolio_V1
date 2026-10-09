# Stage 1: build the static site. Nothing personal is baked in: name, email and
# links are read at start-up from `docker run -e VITE_...` (see server/index.js).
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Never ship a CV inside the image; mount it at run time (see scripts/start.mjs).
RUN find public/CV -type f ! -name README.txt -delete
RUN npm run build

# Stage 2: tiny runtime. Only the server's prod deps + built site, non-root user.
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package*.json server/
RUN npm ci --omit=dev --prefix server && npm cache clean --force
COPY server server
COPY --from=build /app/dist dist
USER node
EXPOSE 3001
# Everything is supplied with `docker run -e` / --env-file, never baked in:
#   VITE_NAME, VITE_EMAIL, VITE_GITHUB_USER, VITE_LINKEDIN, VITE_CV_URL, VITE_UNIVERSITY
#   GITHUB_TOKEN, ALLOWED_ORIGIN, FORCE_HTTPS, PORT
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO /dev/null --header "X-Forwarded-Proto: https" http://127.0.0.1:3001/ || exit 1
CMD ["node", "server/index.js"]
