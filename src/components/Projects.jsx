import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "../content.js";

function Tag({ children, variant }) {
  return <span className={`tag${variant ? ` tag--${variant}` : ""}`}>{children}</span>;
}

export default function Projects() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  // Modal housekeeping: Esc to close, scroll lock, focus round-trip.
  useEffect(() => {
    if (!selected) return;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [selected]);

  const open = (p) => setSelected(p);
  const close = () => setSelected(null);

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <p className="eyebrow">Selected work</p>
        <h2 className="section-title">Projects, in detail</h2>
        <p className="section-lede">
          A selection of projects that show how I work, from final-year
          systems to self-hosted experiments. Click any card for the full
          breakdown.
        </p>
        <div className="project-grid">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              className={`project-card${p.highlight ? " project-card--highlight" : ""}`}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={() => open(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(p);
                }
              }}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="project-head">
                <h3>{p.title}</h3>
                <span className="project-year">{p.year}</span>
              </div>
              <p className="project-role">{p.role}</p>
              <p className="project-desc">{p.description}</p>
              <ul className="project-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="project-foot">
                <div className="project-tags">
                  {(p.tags || []).map((t) => (
                    <Tag key={t} variant="private">
                      {t}
                    </Tag>
                  ))}
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {p.repo && (
                  <a
                    className="project-link"
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
              <span className="project-hint" aria-hidden="true">
                Full breakdown →
              </span>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <div
            className="pm-backdrop"
            onClick={close}
          >
            <motion.div
              className="pm-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pm-title"
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="pm-close" ref={closeRef} onClick={close}>
                Close ×
              </button>
              <img className="pm-image" src={selected.image} alt="" />
              <div className="pm-body">
                <div className="pm-head">
                  <h3 id="pm-title">{selected.title}</h3>
                  {selected.year && (
                    <span className="project-year">{selected.year}</span>
                  )}
                </div>
                <p className="project-role">{selected.role}</p>
                <p className="pm-detail">{selected.detail}</p>
                <ul className="project-features">
                  {selected.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="pm-foot">
                  <div className="project-tags">
                    {(selected.tags || []).map((t) => (
                      <Tag key={t} variant="private">
                        {t}
                      </Tag>
                    ))}
                    {selected.stack.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  {selected.repo && (
                    <a
                      className="project-link"
                      href={selected.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
