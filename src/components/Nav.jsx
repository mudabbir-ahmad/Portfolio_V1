import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { profile } from "../content.js";
import { Icon } from "./icons.jsx";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Activity", href: "#activity" },
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

// Which section is under the middle of the viewport, for the active nav link.
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    // Only sections with a nav link are watched, so the pill holds the last
    // linked section while scrolling through ones without (GitHub, interests).
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const onScroll = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return active;
}

export default function Nav() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Esc closes it, and it closes itself if the window grows.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 941px)");
    const onWide = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  const themeToggle = (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
      <div className="container nav-inner">
        <a className="nav-wordmark" href="#top" onClick={() => setOpen(false)}>
          {profile.name}
          <span className="nav-dot">.</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              className={`nav-link${active === l.href ? " nav-link--active" : ""}`}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
            >
              {active === l.href && (
                <motion.span
                  className="nav-link-pill"
                  layoutId="nav-pill"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="nav-link-label">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {themeToggle}
          {profile.cvUrl && (
            <a className="btn btn-primary btn-sm nav-cv" href={profile.cvUrl} download>
              <Icon name="download" className="btn-icon" />
              CV
            </a>
          )}
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
        </div>
      </div>

      <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="nav-menu"
            className="nav-sheet"
            aria-label="Primary"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container">
              {links.map((l, i) => (
                <a
                  key={l.href}
                  className={`nav-sheet-link${active === l.href ? " nav-sheet-link--active" : ""}`}
                  href={l.href}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-sheet-num">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              ))}
              {profile.cvUrl && (
                <a
                  className="btn btn-primary nav-sheet-cv"
                  href={profile.cvUrl}
                  download
                  onClick={() => setOpen(false)}
                >
                  <Icon name="download" className="btn-icon" />
                  Download CV
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
