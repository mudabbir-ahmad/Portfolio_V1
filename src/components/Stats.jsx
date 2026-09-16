import { stats } from "../content.js";

export default function Stats() {
  return (
    <section className="stats" aria-label="Portfolio statistics">
      <div className="container stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
