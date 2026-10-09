# Project screenshots

`npm run capture` builds the screenshots shown in the project pop-ups.
Each project in `capture.config.json` comes from one of two routes:

| Route | For | How |
|---|---|---|
| **Automated** (`serve` + `steps`) | Web apps, this portfolio | Clones or reads the source, runs its server, and Playwright clicks through it and takes the screenshots. |
| **Manual drop** (`manual: true`) | Android, Java Swing, hardware, phone apps, stock photos | You drop images in `scripts/capture/manual/<id>/`, and the runner downscales them to WebP (720px wide for phone shots, 1440px otherwise). |

Output goes to `public/images/projects/<id>-<name>`, and the list is written
into that project's `images` in `src/data/projects.json`, along with an
`orientation` (`portrait` or `landscape`) that sizes the pop-up's media pane. The site shows a carousel
when there are two or more images.

## One-time setup (Windows)

```powershell
cd F:\Portfolio
npm install                       # adds the playwright dev dependency
npx playwright install chromium   # downloads the browser Playwright drives
# or skip the download and use the Edge that ships with Windows:
#   $env:CAPTURE_CHANNEL = "msedge"
```

## Running it

```powershell
npm run capture                          # every enabled project
npm run capture -- --only=portfolio      # one project
npm run capture -- --only=mass,routines
```

It keeps going if one project fails, prints a summary, and exits non-zero if anything failed.
Nothing is committed. Look at the new images, then commit them yourself.

## Adding or changing a web project

Edit its entry in `capture.config.json`:

```json
{
  "id": "qr-hunt",
  "enabled": true,
  "source": { "git": "https://github.com/you/repo.git", "branch": "main" },
  "setup": ["npm ci"],
  "serve": { "command": "npm run dev -- --port 5180 --strictPort", "url": "http://localhost:5180" },
  "steps": [
    { "goto": "/" },
    { "wait": 800 },
    { "screenshot": "home" },
    { "click": "text=Start game" },
    { "fill": "input[name=team]", "value": "Demo team" },
    { "press": "Enter" },
    { "waitFor": ".leaderboard" },
    { "screenshot": "leaderboard" }
  ]
}
```

- `source.git` is cloned into `.capture-work/<id>/` and refreshed on each run. Private
  Gitea or GitLab repos use whatever git credentials your machine already has (the same
  ones VS Code uses).
- `source.local` uses a folder you already have, e.g. `"local": "F:\\Projects\\qr-hunt"`.
- `serve` starts the server and waits for `url`. Leave it out to capture a deployed site
  by setting `url` instead.
- `steps` actions: `goto`, `click`, `fill` (+`value`), `press`, `hover`, `scrollTo`,
  `scrollBy`, `waitFor`, `wait` (ms), `screenshot` (+`selector`, `fullPage`).
  A `screenshot` name becomes part of the filename, so `"screenshot": "detail"` on
  `mass` gives `mass-detail.png`.
- Use demo data in steps. Don't type real passwords or tokens into the config.

## Manual screenshots

- **Android:** run the app in the Android Studio emulator and use the camera button
  in the emulator toolbar. Save into `scripts/capture/manual/routines/`.
- **Java Swing (CV Builder):** `Win + Shift + S` on the window. Save into `scripts/capture/manual/<id>/`.
- **Radar:** screenshot the live dashboard in a browser.
- **Phone apps:** a phone screenshot or the emulator, saved in filename order.

Then run `npm run capture -- --only=<id>` to promote them.

## Scheduling

To refresh every Sunday at 10:00 with Task Scheduler:

```powershell
schtasks /Create /SC WEEKLY /D SUN /ST 10:00 /TN "PortfolioCapture" /TR "cmd /c cd /d F:\Portfolio && npm run capture >> capture.log 2>&1"
```

Scheduled runs can only capture what they can reach. Projects that need a running
emulator, device or hardware stay on the manual route.

## Before you publish

Screenshots are public once committed. Check each one for:

- email addresses, phone numbers, real names of other people
- hostnames, IP addresses, NAS or router names, Tailscale or Gitea URLs
- API keys, tokens and Discord server or channel names
- patient, customer or other third-party data

Crop or blur if needed. Use demo content where possible.
