import { profile, githubRepos } from "../content.js";

const langColors = {
  JavaScript: "#f1e05a",
  CSS: "#86e1fc",
};

export default function GitHubGrid() {
  return (
    <section className="github section" id="github">
      <div className="container">
        <h2 className="section-title">On GitHub</h2>
        <p className="section-lede">
          A curated selection from my 38 repositories — 27 self-made and 11
          fully agentic projects built with AI agents, to develop a feel for
          system design and AI-assisted software development. The full list
          lives on{" "}
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.githubUser}
          </a>
          .
        </p>
        <div className="repo-grid">
          {githubRepos.map((r) => (
            <a
              key={r.name}
              className="repo-card"
              href={r.url}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{r.name}</h3>
              <p>{r.description}</p>
              <div className="repo-meta">
                <span className="repo-lang">
                  <i
                    className="dot"
                    style={{ background: langColors[r.language] || "#999" }}
                  />
                  {r.language}
                </span>
                <span className="repo-stars">
                  {r.stars > 0 ? `${r.stars} star${r.stars === 1 ? "" : "s"}` : null}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
