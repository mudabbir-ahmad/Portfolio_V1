import { profile } from "../content.js";

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <h2 className="section-title">About</h2>
        <div className="about-body">
          {profile.about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <div className="edu-card">
            <div className="edu-main">
              <h3>{profile.education.degree}</h3>
              <p>{profile.education.institution}</p>
            </div>
            <span className="badge">{profile.education.classification}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
