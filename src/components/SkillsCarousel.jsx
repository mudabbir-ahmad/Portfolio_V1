import { skills } from "../content.js";

function Marquee({ label, items }) {
  // Four copies so the track always covers the viewport on wide screens;
  // the -50% translate lands on a copy boundary, keeping the loop seamless.
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee-block">
      <h3 className="marquee-label">{label}</h3>
      <div
        className="marquee"
        style={{ "--marquee-duration": `${items.length * 3.4}s` }}
        aria-label={`${label}: ${items.join(", ")}`}
      >
        <div className="marquee-track">
          {row.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="marquee-item"
              aria-hidden={i >= items.length * 2}
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
