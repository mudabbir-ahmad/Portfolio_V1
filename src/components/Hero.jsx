import { motion, useReducedMotion } from "motion/react";
import { profile } from "../content.js";
import { Icon } from "./icons.jsx";

const EASE = [0.22, 1, 0.36, 1];
const group = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export default function Hero() {
  const reduced = useReducedMotion();
  // With reduced motion everything is simply rendered in place.
  const anim = reduced ? {} : { variants: rise };

  return (
    <section className="hero" id="top">
      <div className="hero-backdrop" aria-hidden="true" />
      <motion.div
        className="container hero-grid"
        variants={reduced ? undefined : group}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "show"}
      >
        <div className="hero-copy">
          <motion.p className="eyebrow eyebrow--plain" {...anim}>
            {profile.role} · {profile.location}
          </motion.p>
          <motion.h1 className="hero-name" {...anim}>
            {profile.name}
            <span className="accent">.</span>
          </motion.h1>
          <motion.p className="hero-tagline" {...anim}>
            {profile.heroTagline}
          </motion.p>
          <motion.div className="hero-actions" {...anim}>
            <a className="btn btn-primary" href="#projects">
              View projects
              <Icon name="arrow" className="btn-icon" />
            </a>
            {profile.cvUrl && (
              <a className="btn btn-outline" href={profile.cvUrl} download>
                <Icon name="download" className="btn-icon" />
                Download CV
              </a>
            )}
          </motion.div>
        </div>

        <motion.aside className="glance" aria-label={`About ${profile.name}`} {...anim}>
          <div className="glance-head">
            <span className="glance-title">{profile.name}</span>
            <span className="glance-lights" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
          <dl className="glance-rows">
            {profile.glance.map((row) => (
              <div className="glance-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="glance-status">
            <span className="availability-dot" aria-hidden="true" />
            {profile.availability}
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}
