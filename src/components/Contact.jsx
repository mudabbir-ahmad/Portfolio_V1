import { profile } from "../content.js";

export default function Contact() {
  const year = new Date().getFullYear();
  return (
    <footer className="contact" id="contact">
      <div className="container">
        <p className="eyebrow eyebrow--light">Get in touch</p>
        <h2 className="contact-title">Let's talk.</h2>
        <p className="contact-lede">
          I'm open to graduate and junior software engineering roles, or just a good conversation about self-hosting.
        </p>
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="btn btn-outline-light" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="btn btn-outline-light" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
      <div className="container footer-bar">
        <span>
          {profile.name} · {profile.location}
        </span>
        <span>{year}</span>
      </div>
    </footer>
  );
}
