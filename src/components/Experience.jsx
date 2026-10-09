import { experience } from "../content.js";
import { Stagger, StaggerItem } from "./Stagger.jsx";

export default function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="container">
        <p className="eyebrow">Background</p>
        <h2 className="section-title">Experience</h2>
        <Stagger as="ol" className="timeline" gap={0.14}>
          {experience.map((e) => (
            <StaggerItem as="li" key={e.title} className="timeline-item">
              <div className="timeline-period">{e.period}</div>
              <div className="timeline-body">
                <h3>{e.title}</h3>
                <p className="timeline-org">{e.org}</p>
                {e.summary && <p className="timeline-detail">{e.summary}</p>}
                {e.points && (
                  <ul className="timeline-points">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
