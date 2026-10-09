import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { stats } from "../content.js";

// Counts the leading number up from zero the first time it scrolls into view.
// Anything after the digits ("+", "k+") is kept as a suffix.
function CountUp({ value }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const [n, setN] = useState(reduced || target === null ? target : 0);

  useEffect(() => {
    if (reduced || target === null || !inView) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  return (
    <span className="stat-value" ref={ref}>
      {target === null ? value : `${n}${match[2]}`}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats" aria-label="Portfolio statistics">
      <div className="container stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <CountUp value={s.value} />
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
