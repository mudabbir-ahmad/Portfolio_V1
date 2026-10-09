import { useRef } from "react";
import { useInView } from "motion/react";
import { profile } from "../content.js";
import { Icon } from "./icons.jsx";

function Education() {
  const edu = profile.education;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <aside className="edu" ref={ref} aria-label="Education">
      <div className="edu-top">
        <span className="edu-icon">
          <Icon name="cap" />
        </span>
        <span className="badge">
          {edu.classification}
          <span className="badge-grade">{edu.grade}</span>
        </span>
      </div>
      <h3 className="edu-degree">{edu.degree}</h3>
      <p className="edu-school">{edu.institution}</p>
      <p className="edu-meta">
        <span>{edu.period}</span>
        <span>{edu.accreditation}</span>
        <span>{edu.awarded}</span>
      </p>

      <h4 className="edu-label">Strongest modules</h4>
      <ul className="edu-modules">
        {edu.modules.map((m, i) => (
          <li key={m.name}>
            <span className="edu-module-name">{m.name}</span>
            <span className="edu-module-mark">{m.mark}%</span>
            <span className="edu-bar">
              <span
                className="edu-bar-fill"
                style={{ width: `${inView ? m.mark : 0}%`, transitionDelay: `${i * 80}ms` }}
              />
            </span>
          </li>
        ))}
      </ul>

      <h4 className="edu-label">Also studied</h4>
      <ul className="edu-also">
        {edu.alsoStudied.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <p className="edu-note">{edu.note}</p>
    </aside>
  );
}

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div className="about-body">
          <p className="eyebrow">About</p>
          <h2 className="section-title">A bit about me</h2>
          {profile.about.map((p) => (
            <p className="about-p" key={p.slice(0, 24)}>
              {p}
            </p>
          ))}
        </div>
        <Education />
      </div>
    </section>
  );
}
