import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

const group = (gap) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// Wrap a grid or list in <Stagger> and each child in <StaggerItem>: the children
// fade up one after another the first time the group scrolls into view.
export function Stagger({ as = "div", gap = 0.08, children, ...rest }) {
  const reduced = useReducedMotion();
  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }
  const Moving = motion[as];
  return (
    <Moving
      variants={group(gap)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      {...rest}
    >
      {children}
    </Moving>
  );
}

export function StaggerItem({ as = "div", children, ...rest }) {
  const reduced = useReducedMotion();
  if (reduced) {
    const Plain = as;
    return <Plain {...rest}>{children}</Plain>;
  }
  const Moving = motion[as];
  return (
    <Moving variants={item} {...rest}>
      {children}
    </Moving>
  );
}
