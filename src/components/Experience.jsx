import { experience } from "../content.js";

export default function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="container">
        <p className="eyebrow">Background</p>
        <h2 className="section-title">Experience &amp; education</h2>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.title} className="timeline-item">
              <div className="timeline-period">{e.period}</div>
              <div className="timeline-body">
                <h3>{e.title}</h3>
                <p className="timeline-org">{e.org}</p>
                <p className="timeline-detail">{e.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
