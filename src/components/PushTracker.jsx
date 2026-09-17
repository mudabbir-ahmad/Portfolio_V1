import { useEffect, useState } from "react";
import { profile } from "../content.js";

const WEEKS = 13;
const MAX_PAGES = 5;

function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

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

function fmtDay(d) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function levelFor(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

async function fetchPushCounts(cutoff) {
  const counts = new Map();
  let totalPushes = 0;
  let lastPush = null;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `https://api.github.com/users/${profile.githubUser}/events/public?per_page=100&page=${page}`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) break;

    let oldest = null;
    for (const ev of events) {
      const created = new Date(ev.created_at);
      oldest = oldest === null ? created : (created < oldest ? created : oldest);
      if (ev.type !== "PushEvent") continue;
      const day = startOfLocalDay(created);
      if (day < cutoff) continue;
      const k = dayKey(day);
      counts.set(k, (counts.get(k) || 0) + 1);
      totalPushes += 1;
      if (lastPush === null || created > lastPush) lastPush = created;
    }

    // Events arrive newest-first: once this page reaches past the window,
    // older pages can't contribute anything.
    if (oldest !== null && oldest < cutoff) break;
  }

  return { counts, totalPushes, lastPush };
}

export default function PushTracker() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const today = startOfLocalDay(new Date());
        const thisSunday = addDays(today, -today.getDay());
        const gridStart = addDays(thisSunday, -(WEEKS - 1) * 7);
        const cutoff = addDays(gridStart, -5);
        const result = await fetchPushCounts(cutoff);
        if (cancelled) return;
        setData({ ...result, today, gridStart });
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
    const { counts, totalPushes, lastPush, today, gridStart } = data;
    const activeDays = counts.size;

    const columns = [];
    for (let c = 0; c < WEEKS; c++) {
      const week = [];
      for (let r = 0; r < 7; r++) {
        const day = addDays(gridStart, c * 7 + r);
        const count = counts.get(dayKey(day)) || 0;
        week.push({ day, count, future: day > today });
      }
      columns.push(week);
    }
    grid = columns;

    statsLine = (
      <p className="pt-stats">
        {totalPushes} push{totalPushes === 1 ? "" : "es"} · {activeDays} active day
        {activeDays === 1 ? "" : "s"}
        {lastPush ? ` · last push ${fmtDay(lastPush)}` : ""}
      </p>
    );
  }

  return (
    <section className="push-tracker section" id="activity">
      <div className="container">
        <p className="eyebrow">Activity</p>
        <h2 className="section-title">Push tracker</h2>
        <p className="section-lede">
          Every git push across my public repositories, pulled live from GitHub's
          events API — the last 13 weeks.
        </p>
        <div className="pt-card">
          {status === "loading" && (
            <p className="pt-note">Fetching push activity…</p>
          )}
          {status === "error" && (
            <p className="pt-note">Push activity is unavailable right now.</p>
          )}
          {status === "ready" && grid && (
            <>
              <div className="pt-grid" role="img" aria-label="Push activity heatmap, last 13 weeks">
                {grid.map((week, c) => (
                  <div className="pt-col" key={c}>
                    {week.map((cell, r) => (
                      <span
                        key={r}
                        className={`pt-cell l${cell.future ? 0 : levelFor(cell.count)}${cell.future ? " is-future" : ""}`}
                        title={
                          cell.future
                            ? undefined
                            : `${fmtDay(cell.day)} — ${cell.count} push${cell.count === 1 ? "" : "es"}`
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="pt-foot">
                {statsLine}
                <div className="pt-legend" aria-hidden="true">
                  <span>less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <span className={`pt-cell l${l}`} key={l} />
                  ))}
                  <span>more</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
