import { skills } from "../content.js";

// Even copy count so the -50% translate lands on a copy boundary
// (seamless loop); 12 copies keep half the track (~5000px) far wider
// than any real viewport, so the right edge never gaps.
const COPIES = 12;

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
              {item}
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
      </div>
      <Marquee label="Languages & frameworks" items={skills.languages} />
      <Marquee label="Tools & platforms" items={skills.tools} />
    </section>
  );
}
