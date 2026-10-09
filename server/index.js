// Tiny production server: serves the built site (../dist) and proxies the
// GitHub contribution graph so the token never reaches the browser.
//
// Run behind Nginx Proxy Manager (or any TLS-terminating reverse proxy).
// Secrets live in secrets/.env (gitignored), the same file the client build uses.
// GITHUB_TOKEN here has no VITE_ prefix, so Vite never inlines it into the bundle.
//
// This process does not log request IPs, timestamps, or any other per-visitor
// data itself (no request-logging middleware is used). Whatever reverse proxy
// sits in front of it may keep its own access logs by default; disable that at
// the proxy layer if you want none at all.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../secrets/.env") });

const TOKEN = process.env.GITHUB_TOKEN || "";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const PORT = Number(process.env.PORT) || 3001;
// Encryption in transit. Either terminate TLS here (TLS_CERT + TLS_KEY paths to
// PEM files) or sit behind a TLS proxy and set FORCE_HTTPS=true so plain-HTTP
// requests are redirected. Either way the GitHub token stays server-side and
// the upstream call to api.github.com is always HTTPS.
const TLS_CERT = process.env.TLS_CERT || "";
const TLS_KEY = process.env.TLS_KEY || "";
const FORCE_HTTPS = process.env.FORCE_HTTPS === "true";
const WEEKS = 53;
const CACHE_TTL_MS = 10 * 60 * 1000; // one shared cache entry; this is a single-user site

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

async function runGraphQL(fromIso) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      query: `query($from: DateTime!) {
        viewer {
          contributionsCollection(from: $from) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              weeks { contributionDays { date contributionCount } }
            }
          }
        }
      }`,
      variables: { from: `${fromIso}T00:00:00Z` },
    }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message || `GraphQL ${res.status}`);
  }
  return json.data.viewer.contributionsCollection;
}

async function fetchContributions() {
  const today = new Date();
  const thisSunday = addDays(today, -today.getDay());
  const gridStart = addDays(thisSunday, -(WEEKS - 1) * 7);
  const fromIso = dayKey(gridStart);
  const toIso = dayKey(today);

  const counts = new Map();
  let maxDay = null;
  function absorb(cc) {
    for (const week of cc.contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        if (!maxDay || day.date > maxDay) maxDay = day.date;
        if (day.contributionCount > 0) counts.set(day.date, day.contributionCount);
      }
    }
  }

  let cc = await runGraphQL(fromIso);
  absorb(cc);
  let commits = cc.totalCommitContributions;
  let prs = cc.totalPullRequestContributions;
  let issues = cc.totalIssueContributions;
  let reviews = cc.totalPullRequestReviewContributions;

  if (maxDay < toIso) {
    const [y, m, d] = maxDay.split("-").map(Number);
    const tailFrom = dayKey(addDays(new Date(y, m - 1, d), 1));
    const tail = await runGraphQL(tailFrom);
    absorb(tail);
    commits += tail.totalCommitContributions;
    prs += tail.totalPullRequestContributions;
    issues += tail.totalIssueContributions;
    reviews += tail.totalPullRequestReviewContributions;
  }

  let last = null;
  for (const day of counts.keys()) if (!last || day > last) last = day;

  let total = 0;
  for (const n of counts.values()) total += n;

  return {
    counts: Object.fromEntries(counts),
    total,
    commits,
    prs,
    issues,
    reviews,
    last,
  };
}

const app = express();
app.set("trust proxy", 1); // behind Nginx Proxy Manager, needed for correct rate-limit IPs
if (FORCE_HTTPS) {
  app.use((req, res, next) =>
    req.secure ? next() : res.redirect(308, `https://${req.headers.host}${req.originalUrl}`)
  );
}
app.use(
  helmet({
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind/inline styles from React
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);
app.use(cors({ origin: ALLOWED_ORIGIN }));

let cache = null; // { data, expires }

app.get(
  "/api/contributions",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }),
  async (req, res) => {
    if (!TOKEN) return res.status(501).json({ error: "not_configured" });
    try {
      if (cache && cache.expires > Date.now()) return res.json(cache.data);
      const data = await fetchContributions();
      cache = { data, expires: Date.now() + CACHE_TTL_MS };
      res.json(data);
    } catch {
      res.status(502).json({ error: "upstream_failed" });
    }
  }
);

const distPath = path.resolve(__dirname, "../dist");

// Runtime site config. `docker run -e VITE_NAME=...` (or secrets/.env when run
// directly) fills these in at start-up, so one built image serves any identity.
// Only these identity/contact keys are exposed; the GitHub token never is.
const PUBLIC_KEYS = ["VITE_NAME", "VITE_EMAIL", "VITE_GITHUB_USER", "VITE_LINKEDIN", "VITE_CV_URL", "VITE_UNIVERSITY"];
const publicEnv = Object.fromEntries(
  PUBLIC_KEYS.filter((k) => process.env[k]).map((k) => [k, process.env[k]])
);
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

app.get("/env.js", (req, res) => {
  res.set("Cache-Control", "no-store").type("application/javascript");
  res.send(`window.__ENV__=${JSON.stringify(publicEnv)};`);
});

// index.html with the site name filled into the <title>/meta tags.
let indexHtml = "";
try {
  indexHtml = fs
    .readFileSync(path.join(distPath, "index.html"), "utf8")
    .replaceAll("__SITE_NAME__", escapeHtml(publicEnv.VITE_NAME || "Your Name"));
} catch {
  console.warn("dist/index.html not found, run `npm run build` first");
}
const sendIndex = (req, res) => res.type("html").send(indexHtml);

app.get("/", sendIndex);
app.use(express.static(distPath, { index: false }));
app.get(/^(?!\/api).*/, sendIndex);

const server =
  TLS_CERT && TLS_KEY
    ? https.createServer({ cert: fs.readFileSync(TLS_CERT), key: fs.readFileSync(TLS_KEY) }, app)
    : http.createServer(app);

server.listen(PORT, () => {
  console.log(`portfolio server listening on :${PORT} (${TLS_CERT && TLS_KEY ? "HTTPS" : "HTTP"})`);
  if (!TOKEN) console.warn("GITHUB_TOKEN not set, /api/contributions will return 501");
});
