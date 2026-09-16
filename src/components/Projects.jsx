import { projects } from "../content.js";

function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

export default function Projects() {
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <p className="eyebrow">Selected work</p>
        <h2 className="section-title">Projects, in detail</h2>
        <p className="section-lede">
          A selection of projects that show how I work — from final-year
          systems to self-hosted experiments.
        </p>
        <div className="project-grid">
          {projects.map((p) => (
            <article
              key={p.title}
              className={`project-card${p.highlight ? " project-card--highlight" : ""}`}
            >
              <div className="project-head">
                <h3>{p.title}</h3>
                <span className="project-year">{p.year}</span>
              </div>
              <p className="project-role">{p.role}</p>
              <p className="project-desc">{p.description}</p>
              <ul className="project-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="project-foot">
                <div className="project-tags">
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {p.repo && (
                  <a
                    className="project-link"
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
