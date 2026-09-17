import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

export default function Cursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [overInteractive, setOverInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 240, damping: 26, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 240, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) =>
      setOverInteractive(!!e.target.closest("a, button, [role='button']"));
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [reduced, x, y]);

  if (!active) return null;

  const dotClass = `cursor-dot${pressed ? " cursor-dot--pressed" : ""}`;
  const ringClass = `cursor-ring${overInteractive ? " cursor-ring--active" : ""}`;

  return (
    <>
      <motion.div className={dotClass} style={{ x, y }} aria-hidden="true">
        <span />
      </motion.div>
      <motion.div className={ringClass} style={{ x: ringX, y: ringY }} aria-hidden="true">
        <span />
      </motion.div>
    </>
  );
}
