import { profile, githubRepos } from "../content.js";
import { skillIcons } from "./skill-icons.js";
import { Stagger, StaggerItem } from "./Stagger.jsx";
import { Icon } from "./icons.jsx";

const langColors = {
  JavaScript: "#f1e05a",
  CSS: "#86e1fc",
};

// GitHub /languages names → glyph keys in skill-icons.js
const ICONS = {
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
  Python: "Python",
  Java: "Java",
  Kotlin: "Kotlin",
  Go: "Go",
  CSS: "CSS",
  HTML: "HTML",
};

function LangMark({ language }) {
  const icon = ICONS[language] && skillIcons[ICONS[language]];
  if (icon) {
    return (
      <svg
        viewBox={icon.vb}
        fill="currentColor"
        className="repo-lang-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon.inner }}
      />
    );
  }
  return (
    <i className="dot" style={{ background: langColors[language] || "#999" }} />
  );
}

export default function GitHubGrid() {
  return (
    <section className="github section" id="github">
      <div className="container">
        <p className="eyebrow">Code</p>
        <h2 className="section-title">On GitHub</h2>
        <p className="section-lede">
          A few repositories worth opening first. The full list lives on{" "}
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.githubUser}
          </a>
          .
        </p>
        <Stagger className="repo-grid" gap={0.07}>
          {githubRepos.map((r) => (
            <StaggerItem
              as="a"
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
                  <LangMark language={r.language} />
                  {r.language}
                </span>
                <Icon name="external" className="link-icon" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
