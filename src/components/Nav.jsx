import { useState } from "react";
import { profile } from "../content.js";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Skills", href: "#skills" },
  { label: "Homelab", href: "#homelab" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a
          className="nav-wordmark"
          href="#top"
          onClick={() => setOpen(false)}
        >
          {profile.name}
          <span className="nav-dot">.</span>
        </a>
        <button
          type="button"
          className={`nav-toggle${open ? " nav-toggle--open" : ""}`}
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        <nav
          id="nav-menu"
          className={`nav-links${open ? " nav-links--open" : ""}`}
          aria-label="Primary"
        >
          {links.map((l) => (
            <a
              key={l.href}
              className="nav-link"
              href={l.href}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          className="btn btn-primary btn-sm nav-cv"
          href={profile.cvUrl}
          download
          onClick={() => setOpen(false)}
        >
          Download CV
        </a>
      </div>
    </header>
  );
}
