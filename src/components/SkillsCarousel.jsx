import { skills } from "../content.js";
import { skillIcons } from "./skill-icons.js";
import LanguagePanel from "./LanguagePanel.jsx";

// Even copy count so the -50% translate lands exactly on a copy boundary.
const COPIES = 12;

function SkillGlyph({ name }) {
  const icon = skillIcons[name];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.vb}
      fill="currentColor"
      className="marquee-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}

function Marquee({ label, items }) {
  const row = Array.from({ length: COPIES }, () => items).flat();
  return (
    <div className="marquee-block">
      <h3 className="marquee-label">{label}</h3>
      <div
        className="marquee"
        style={{ "--marquee-duration": `${items.length * 3.4 * (COPIES / 4)}s` }}
        aria-label={`${label}: ${items.join(", ")}`}
      >
        <div className="marquee-track">
          {row.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="marquee-item"
              aria-hidden={i >= items.length * (COPIES / 2)}
            >
              <SkillGlyph name={item} />
              <span className="marquee-name">{item}</span>
              <span className="marquee-sep" aria-hidden="true">
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsCarousel() {
  return (
    <section className="skills section" id="skills">
      <div className="container">
        <h2 className="section-title">Skills &amp; tools</h2>
        <Marquee label="Languages & frameworks" items={skills.languages} />
        <Marquee label="Tools & platforms" items={skills.tools} />
        <LanguagePanel />
      </div>
    </section>
  );
}
