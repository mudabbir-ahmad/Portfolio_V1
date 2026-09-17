import { useEffect, useState } from "react";
import { languageStats } from "../content.js";
import { skillIcons } from "./skill-icons.js";

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

export default function LanguagePanel() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="lang-panel">
      <div className="lang-panel-head">
        <h3 className="lang-panel-title">Language proficiency</h3>
        <span className="lang-panel-sub">
          Self-assessed proficiency, weighted by projects built
        </span>
      </div>

      {languageStats.map((row) => (
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
