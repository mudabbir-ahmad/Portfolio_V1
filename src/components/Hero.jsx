import { profile } from "../content.js";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <p className="eyebrow">
          {profile.role} · {profile.location}
        </p>
        <h1 className="hero-name">
          {profile.name}
          <span className="accent">.</span>
        </h1>
        <p className="hero-tagline">{profile.heroTagline}</p>
        <div className="hero-availability">
          <span className="availability-dot" aria-hidden="true" />
          {profile.availability}
        </div>
        <p className="hero-education">
          {profile.education.degree} · {profile.education.classification} ·{" "}
          {profile.education.institution}
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">
            View projects
          </a>
          <a className="btn btn-outline" href={profile.cvUrl} download>
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
