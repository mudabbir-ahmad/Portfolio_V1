// Automated project screenshots for the portfolio.
//
//   npm run capture                  capture every enabled project
//   npm run capture -- --only=portfolio,mass
//
// For each project in capture.config.json the runner can:
//   1. get the source (a local folder, or a git clone/pull into .capture-work/),
//   2. run its setup commands (e.g. npm ci),
//   3. start its dev/preview server and wait until it answers,
//   4. drive it with Playwright (click, type, scroll, screenshot), or
//   5. for native apps (Android, Swing, hardware) promote screenshots you dropped
//      into scripts/capture/manual/<id>/,
// then write the PNGs to public/images/projects/<id>-<name>.png and list them in
// that project's "images" array in src/data/projects.json.
//
// Nothing is published or committed. Review the new images before you commit.

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim())) : null;

const config = JSON.parse(
  await fs.readFile(path.join(ROOT, "scripts/capture/capture.config.json"), "utf8")
);
const OUT_DIR = path.join(ROOT, config.outputDir ?? "public/images/projects");
const WORK_DIR = path.join(ROOT, config.workDir ?? ".capture-work");
const DATA_FILE = path.join(ROOT, config.projectsFile ?? "src/data/projects.json");
const MANUAL_DIR = path.join(ROOT, "scripts/capture/manual");
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => console.log(`[capture] ${msg}`);

// Run a command and resolve when it exits 0. Output streams to this terminal.
function run(cmd, argv = [], { cwd = ROOT, shell = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, argv, { cwd, shell, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`"${[cmd, ...argv].join(" ")}" exited with ${code}`))
    );
  });
}

// Start a long-running server. Detached on POSIX so the whole group can be stopped.
function startServer(command, cwd) {
  return spawn(command, { cwd, shell: true, stdio: "inherit", detached: process.platform !== "win32" });
}

// Stop a server and everything it spawned (npm -> node -> vite is a tree).
async function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32") {
    await run("taskkill", ["/pid", String(child.pid), "/T", "/F"]).catch(() => {});
  } else {
    try { process.kill(-child.pid, "SIGTERM"); } catch {}
  }
  await sleep(500);
}

async function waitForUrl(url, timeoutSec) {
  const deadline = Date.now() + timeoutSec * 1000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // not listening yet
    }
    await sleep(1000);
  }
  throw new Error(`timed out after ${timeoutSec}s waiting for ${url}`);
}

// Returns the directory to work in. Git sources are cloned once, then refreshed.
async function prepareSource(project) {
  const src = project.source ?? {};
  if (src.local) return path.resolve(ROOT, src.local);
  if (!src.git) throw new Error("source needs either \"local\" or \"git\"");

  const dir = path.join(WORK_DIR, project.id);
  const branch = src.branch ?? "main";
  await fs.mkdir(WORK_DIR, { recursive: true });
  const exists = await fs.stat(path.join(dir, ".git")).then(() => true, () => false);
  if (!exists) {
    log(`cloning ${project.id} from ${src.git}`);
    await run("git", ["clone", "--depth", "1", "--branch", branch, src.git, dir]);
  } else {
    log(`updating ${project.id} (${branch})`);
    await run("git", ["-C", dir, "fetch", "--depth", "1", "origin", branch]);
    await run("git", ["-C", dir, "reset", "--hard", "FETCH_HEAD"]);
  }
  return dir;
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
}

// Playwright actions. Each step is one key (the action) plus optional sibling keys.
async function runSteps(page, project, baseUrl, produced) {
  const steps = project.steps ?? [{ goto: "/" }, { wait: 800 }, { screenshot: "home" }];
  const settle = config.settleMs ?? 400;

  for (const step of steps) {
    if ("goto" in step) {
      const target = new URL(step.goto, baseUrl).toString();
      await page.goto(target, { waitUntil: "load", timeout: 60000 });
      await sleep(settle);
    } else if ("click" in step) {
      await page.locator(step.click).first().click({ timeout: 15000 });
    } else if ("fill" in step) {
      await page.locator(step.fill).first().fill(String(step.value ?? ""));
    } else if ("press" in step) {
      await page.keyboard.press(step.press);
    } else if ("hover" in step) {
      await page.locator(step.hover).first().hover({ timeout: 15000 });
    } else if ("scrollTo" in step) {
      await page.locator(step.scrollTo).first().scrollIntoViewIfNeeded({ timeout: 15000 });
    } else if ("scrollBy" in step) {
      await page.evaluate((y) => window.scrollBy(0, y), step.scrollBy);
    } else if ("waitFor" in step) {
      await page.locator(step.waitFor).first().waitFor({ state: "visible", timeout: 30000 });
    } else if ("wait" in step) {
      await sleep(step.wait);
    } else if ("screenshot" in step) {
      const name = slug(step.screenshot);
      const file = `${project.id}-${name}.png`;
      await sleep(settle);
      if (step.selector) {
        await page.locator(step.selector).first().screenshot({
          path: path.join(OUT_DIR, file),
          animations: "disabled",
        });
      } else {
        await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: !!step.fullPage, animations: "disabled" });
      }
      produced.push(file);
      log(`  saved ${file}`);
    } else {
      throw new Error(`unknown step: ${JSON.stringify(step)}`);
    }
  }
}

async function captureWithBrowser(project, baseUrl) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("Playwright is not installed. Run: npm install && npx playwright install chromium");
  }
  // CAPTURE_CHANNEL=msedge (or chrome) drives a browser that is already installed,
  // instead of the Chromium build from `npx playwright install`.
  const browser = await chromium.launch({ headless: true, channel: process.env.CAPTURE_CHANNEL || undefined });
  const produced = [];
  try {
    const context = await browser.newContext({
      viewport: project.viewport ?? config.viewport ?? { width: 1440, height: 900 },
      deviceScaleFactor: project.deviceScaleFactor ?? config.deviceScaleFactor ?? 1,
      colorScheme: project.colorScheme ?? config.colorScheme ?? "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await runSteps(page, project, baseUrl, produced);
    await context.close();
  } finally {
    await browser.close();
  }
  return produced;
}

// Convert hand-taken screenshots (Android emulator, Swing app, hardware, stock photo)
// from scripts/capture/manual/<id>/ into the output folder, numbered in filename order.
// Each one is downscaled and saved as WebP so a 1080x2400 phone shot ships at ~60 KB.
async function promoteManual(project) {
  const dir = path.join(MANUAL_DIR, project.id);
  const entries = await fs.readdir(dir).catch(() => []);
  const files = entries.filter((f) => IMAGE_RE.test(f)).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  if (files.length === 0) return null;
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    throw new Error("sharp is not installed. Run: npm install");
  }
  const max = config.manualMaxWidth ?? { portrait: 720, landscape: 1440 };
  const produced = [];
  for (let i = 0; i < files.length; i++) {
    const input = sharp(path.join(dir, files[i]));
    const { width, height } = await input.metadata();
    const file = `${project.id}-${i + 1}.webp`;
    await input
      .resize({ width: height > width ? max.portrait : max.landscape, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT_DIR, file));
    produced.push(file);
    log(`  converted ${files[i]} -> ${file}`);
  }
  return produced;
}

// "portrait" for phone screenshots, "landscape" otherwise. The site uses this to
// size the media pane in the project pop-up.
async function orientationOf(file) {
  const sharp = (await import("sharp")).default;
  const { width, height } = await sharp(path.join(OUT_DIR, file)).metadata();
  return height > width ? "portrait" : "landscape";
}

async function captureProject(project) {
  if (project.manual) return promoteManual(project);

  const cwd = await prepareSource(project);
  for (const cmd of project.setup ?? []) {
    log(`  ${project.id}: ${cmd}`);
    await run(cmd, [], { cwd, shell: true });
  }

  let baseUrl = project.url;
  let server = null;
  try {
    if (project.serve) {
      log(`  ${project.id}: starting "${project.serve.command}"`);
      server = startServer(project.serve.command, path.join(cwd, project.serve.cwd ?? ""));
      baseUrl = project.serve.url;
      await waitForUrl(baseUrl, project.serve.readyTimeoutSec ?? 120);
    }
    if (!baseUrl) throw new Error("set \"serve\" or \"url\" for this project");
    return await captureWithBrowser(project, baseUrl);
  } finally {
    await stopServer(server);
  }
}

// Remove screenshots from an earlier run that this run did not replace.
async function pruneOld(id, keep) {
  const entries = await fs.readdir(OUT_DIR).catch(() => []);
  for (const f of entries) {
    if (f.startsWith(`${id}-`) && IMAGE_RE.test(f) && !keep.includes(f)) {
      await fs.unlink(path.join(OUT_DIR, f));
      log(`  removed old ${f}`);
    }
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const data = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  const results = { ok: [], skipped: [], failed: [] };

  for (const project of config.projects) {
    const id = project.id;
    if (ONLY ? !ONLY.has(id) : project.enabled === false) {
      continue;
    }
    log(`== ${id}`);
    try {
      const files = await captureProject(project);
      if (!files || files.length === 0) {
        log(`  nothing to capture for ${id} (manual folder empty or missing), skipped`);
        results.skipped.push(id);
        continue;
      }
      await pruneOld(id, files);
      const entry = data.find((p) => p.id === id);
      if (entry) {
        entry.images = files;
        entry.orientation = await orientationOf(files[0]);
      }
      else log(`  warning: no project with id "${id}" in ${path.relative(ROOT, DATA_FILE)}`);
      results.ok.push(`${id} (${files.length})`);
    } catch (err) {
      console.error(`[capture] FAILED ${id}: ${err.message}`);
      results.failed.push(id);
    }
  }

  if (results.ok.length) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
    log(`updated ${path.relative(ROOT, DATA_FILE)}`);
  }
  log(`done. captured: ${results.ok.join(", ") || "none"}; skipped: ${results.skipped.join(", ") || "none"}; failed: ${results.failed.join(", ") || "none"}`);
  process.exitCode = results.failed.length ? 1 : 0;
}

await main();
