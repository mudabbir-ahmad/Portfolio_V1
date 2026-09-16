import { useEffect, useState } from "react";
import { profile } from "../content.js";
import { skillIcons } from "./skill-icons.js";

const CACHE_KEY = "gh-lang-stats-v1";
// 1h TTL: each refresh costs ~9 unauthenticated API calls (repo list + one /languages per repo),
// well inside the 60/hour limit.
const TTL_MS = 60 * 60 * 1000;

// GitHub /languages names → glyph keys in skill-icons.js
const ICONS = {
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
  HTML: "HTML",
  CSS: "CSS",
  SCSS: "CSS",
  Python: "Python",
  Kotlin: "Kotlin",
  Java: "Java",
  "C++": "C++",
  C: "C",
  Go: "Go",
  Shell: "Bash",
  Dockerfile: "Docker",
  Vue: "Vue",
};

function LangGlyph({ name }) {
  const icon = ICONS[name] && skillIcons[ICONS[name]];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.vb}
      fill="currentColor"
      className="lang-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.rows) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(rows, repoCount) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows, repoCount }));
  } catch {
    // storage unavailable — panel still works uncached
  }
}

async function fetchRows(githubUser) {
  const reposRes = await fetch(
    `https://api.github.com/users/${githubUser}/repos?per_page=100`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!reposRes.ok) throw new Error("repo list failed");
  const repos = await reposRes.json();

  const langResults = await Promise.allSettled(
    repos.map((r) =>
      fetch(`https://api.github.com/repos/${githubUser}/${r.name}/languages`).then(
        (res) => (res.ok ? res.json() : null)
      )
    )
  );

  const totals = {};
  for (const result of langResults) {
    if (result.status === "fulfilled" && result.value) {
      for (const [lang, bytes] of Object.entries(result.value)) {
        totals[lang] = (totals[lang] || 0) + bytes;
      }
    }
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  if (!total) throw new Error("no language data");

  const rows = Object.entries(totals)
    .map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }))
    .filter((r) => r.pct >= 1)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  return { rows, repoCount: repos.length };
}

export default function LanguagePanel() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    if (cached) {
      // Fresh or stale cache both render immediately; a refetch refreshes in the background.
      return { status: "ready", rows: cached.rows, repoCount: cached.repoCount };
    }
    return { status: "loading" };
  });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchRows(profile.githubUser)
      .then(({ rows, repoCount }) => {
        if (cancelled) return;
        writeCache(rows, repoCount);
        setState({ status: "ready", rows, repoCount });
      })
      .catch(() => {
        if (cancelled) return;
        const cached = readCache();
        if (cached) setState({ status: "ready", rows: cached.rows, repoCount: cached.repoCount });
        else setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.status !== "ready") return;
    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, [state.status]);

  return (
    <div className="lang-panel">
      <div className="lang-panel-head">
        <h3 className="lang-panel-title">Language proficiency</h3>
        <span className="lang-panel-sub">
          {state.repoCount
            ? `Share of code across ${state.repoCount} public GitHub repos`
            : "Live from your public GitHub repos"}
        </span>
      </div>

      {state.status === "loading" && (
        <p className="lang-note">Crunching your GitHub repos…</p>
      )}

      {state.status === "error" && (
        <p className="lang-note">
          Language stats are unavailable right now — they load live from GitHub.
        </p>
      )}

      {state.status === "ready" &&
        state.rows.map((row) => (
          <div className="lang-row" key={row.name}>
            <span className="lang-name">
              <LangGlyph name={row.name} />
              <span>{row.name}</span>
            </span>
            <div className="lang-bar-track">
              <div
                className="lang-bar-fill"
                style={{ width: `${armed ? row.pct : 0}%` }}
              />
            </div>
            <span className="lang-pct">{Math.round(row.pct)}%</span>
          </div>
        ))}
    </div>
  );
}
