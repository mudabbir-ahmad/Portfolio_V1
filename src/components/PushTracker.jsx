import { useEffect, useState } from "react";

const WEEKS = 53; // trailing year, same span as GitHub's default graph
const MAX_LEVEL = 4;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

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

function fmtDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// GitHub-style levels: quartile buckets over [0, cap], where cap is the
// 95th percentile of non-zero daily counts (outlier removal). This matches
// GitHub's rendered shades on the current window (359/359 API-present days).
function levelMap(counts) {
  const active = [...counts.values()].filter((n) => n > 0).sort((a, b) => a - b);
  if (active.length === 0) return new Map();
  const i = (active.length - 1) * 0.95;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  const cap = active[lo] + (active[hi] - active[lo]) * (i - lo);
  const q = cap / 4;
  const levels = new Map();
  for (const [day, n] of counts) {
    if (n === 0) continue;
    levels.set(day, n < q ? 1 : n < 2 * q ? 2 : n < 3 * q ? 3 : MAX_LEVEL);
  }
  return levels;
}

async function fetchContributions(fromIso) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      query: `{
        viewer {
          contributionsCollection(from: "${fromIso}T00:00:00Z") {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }`,
    }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message || `GraphQL ${res.status}`);
  }

  const cc = json.data.viewer.contributionsCollection;
  const counts = new Map();
  for (const week of cc.contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) counts.set(day.date, day.contributionCount);
    }
  }

  let last = null;
  for (const day of counts.keys()) if (!last || day > last) last = day;

  // Calendar sum matches GitHub's profile number (includes private contributions).
  let calendarSum = 0;
  for (const n of counts.values()) calendarSum += n;

  return {
    counts,
    total: calendarSum,
    commits: cc.totalCommitContributions,
    prs: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    reviews: cc.totalPullRequestReviewContributions,
    last,
  };
}

export default function PushTracker() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!TOKEN) {
      setStatus("note");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const today = new Date();
        const thisSunday = addDays(today, -today.getDay());
        const gridStart = addDays(thisSunday, -(WEEKS - 1) * 7);
        const result = await fetchContributions(dayKey(gridStart));
        if (cancelled) return;
        setData(result);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  let grid = null;
  let statsLine = null;

  if (status === "ready" && data) {
    const today = new Date();
    const thisSunday = addDays(today, -today.getDay());
    const gridStart = addDays(thisSunday, -(WEEKS - 1) * 7);
    const levels = levelMap(data.counts);
    const activeDays = [...data.counts.values()].filter((n) => n > 0).length;

    const columns = [];
    for (let w = 0; w < WEEKS; w++) {
      const cells = [];
      for (let dow = 0; dow < 7; dow++) {
        const day = addDays(gridStart, w * 7 + dow);
        if (day > today) break; // future days don't render
        const key = dayKey(day);
        const count = data.counts.get(key) || 0;
        cells.push(
          <span
            key={key}
            className={`pt-cell l${levels.get(key) || 0}`}
            title={count ? `${count} contribution${count === 1 ? "" : "s"} on ${fmtDay(key)}` : fmtDay(key)}
          />
        );
      }
      columns.push(
        <div className="pt-col" key={w}>
          {cells}
        </div>
      );
    }

    grid = (
      <div className="pt-scroll">
        <div className="pt-grid" role="img" aria-label={`Contribution graph: ${data.total} contributions in the last year`}>
          {columns}
        </div>
      </div>
    );

    const parts = [`${data.commits} commit${data.commits === 1 ? "" : "s"}`];
    if (data.prs) parts.push(`${data.prs} pull request${data.prs === 1 ? "" : "s"}`);
    if (data.issues) parts.push(`${data.issues} issue${data.issues === 1 ? "" : "s"}`);
    if (data.reviews) parts.push(`${data.reviews} review${data.reviews === 1 ? "" : "s"}`);

    statsLine = (
      <>
        <span className="pt-stats">
          {data.total} contributions in the last year · {activeDays} active days
          {data.last ? ` · last ${fmtDay(data.last)}` : ""}: {parts.join(" · ")}
        </span>
        <span className="pt-legend">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`pt-cell l${l}`} />
          ))}
          more
        </span>
      </>
    );
  }

  return (
    <section className="push-tracker section" id="activity">
      <div className="container">
        <p className="eyebrow">Activity</p>
        <h2 className="section-title">Contributions</h2>
        <p className="section-lede">
          Commits, pull requests and issues across all my repositories, public and private, pulled live from GitHub.
        </p>

        <div className="pt-card">
          {status === "loading" && <p className="pt-note">Fetching contribution activity…</p>}
          {status === "note" && (
            <p className="pt-note">Contribution data isn't available without a GitHub token.</p>
          )}
          {status === "error" && (
            <p className="pt-note">Contribution activity is unavailable right now.</p>
          )}
          {grid}
          {statsLine && <div className="pt-foot">{statsLine}</div>}
        </div>
      </div>
    </section>
  );
}
