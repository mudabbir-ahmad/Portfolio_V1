import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "../content.js";
import ImageCarousel from "./ImageCarousel.jsx";
import { Stagger, StaggerItem } from "./Stagger.jsx";
import Tag from "./Tag.jsx";
import { Icon } from "./icons.jsx";

// `images` in src/data/projects.json (files live in public/images/projects/);
// falls back to the project's default artwork.
function imagesFor(p) {
  const list = (p.images || []).map((f) => `/images/projects/${f}`);
  return list.length ? list : [p.image];
}

// Card thumbnail: phone screenshots fan out as three small screens, anything
// wider is a single cropped cover.
function CardMedia({ project }) {
  const images = imagesFor(project);
  if (project.orientation === "portrait") {
    return (
      <div className="project-media project-media--phones" aria-hidden="true">
        {images.slice(0, 3).map((src) => (
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>
    );
  }
  return (
    <div className="project-media" aria-hidden="true">
      <img src={images[0]} alt="" loading="lazy" />
    </div>
  );
}

function Tags({ project }) {
  return (
    <div className="project-tags">
      {(project.tags || []).map((t) => (
        <Tag key={t} variant="private">
          {t}
        </Tag>
      ))}
      {project.stack.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}

function RepoLink({ project, stop }) {
  if (!project.repo) return null;
  return (
    <a
      className="project-link"
      href={project.repo}
      target="_blank"
      rel="noreferrer"
      onClick={stop ? (e) => e.stopPropagation() : undefined}
    >
      GitHub
      <Icon name="external" className="link-icon" />
    </a>
  );
}

function FypBadge() {
  return (
    <span className="fyp-badge">
      <Icon name="award" className="tag-icon" />
      Final Year Project
    </span>
  );
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
          Every project on my CV, with the detail behind each one. Open any card for the full
          breakdown, the stack and the screenshots.
        </p>
        <Stagger className="project-grid" gap={0.09}>
          {projects.map((p) => (
            <StaggerItem
              as="article"
              key={p.id}
              className={`project-card${p.fyp ? " project-card--fyp" : ""}`}
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
            >
              <CardMedia project={p} />
              <div className="project-body">
                {p.fyp && <FypBadge />}
                <div className="project-head">
                  <h3>{p.title}</h3>
                  <span className="project-year">{p.period || p.year}</span>
                </div>
                <p className="project-role">{p.role}</p>
                <p className="project-desc">{p.description}</p>
                <Tags project={p} />
                <div className="project-foot">
                  <span className="project-hint">
                    Full breakdown
                    <Icon name="arrow" className="link-icon" />
                  </span>
                  <RepoLink project={p} stop />
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="pm-backdrop"
            onClick={close}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`pm-panel pm-panel--${selected.orientation || "landscape"}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pm-title"
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="pm-close" ref={closeRef} onClick={close} aria-label="Close">
                Close ×
              </button>
              <div className="pm-media">
                <ImageCarousel key={selected.id} images={imagesFor(selected)} title={selected.title} />
              </div>
              <div className="pm-body">
                {selected.fyp && <FypBadge />}
                <h3 id="pm-title" className="pm-title">
                  {selected.title}
                </h3>
                <p className="pm-meta">
                  <span>{selected.role}</span>
                  {(selected.period || selected.year) && (
                    <span className="project-year">{selected.period || selected.year}</span>
                  )}
                </p>
                <p className="pm-detail">{selected.detail}</p>
                <ul className="project-features">
                  {selected.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Tags project={selected} />
                {selected.repo && (
                  <div className="pm-foot">
                    <RepoLink project={selected} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
