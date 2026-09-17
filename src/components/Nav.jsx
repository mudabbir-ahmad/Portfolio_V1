import { useState } from "react";
import { profile } from "../content.js";

const links = [
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Skills", href: "#skills" },
  { label: "Homelab", href: "#homelab" },
  { label: "Contact", href: "#contact" },
];

function initialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

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
        <button
          type="button"
          className="theme-toggle"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
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
