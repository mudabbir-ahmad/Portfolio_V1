import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export default function Cursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const dotRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    let tx = -100, ty = -100; // pointer position
    let cx = -100, cy = -100; // rendered head (lerped)
    let vx = 0, vy = 0; // smoothed velocity px/frame
    let avx = 0, avy = 0; // raw delta since last frame
    let stretch = 0; // 0..1 warp amount
    let angle = 0; // travel direction rad
    let scale = 1; // smoothed press/hover scale
    let over = false, pressed = false;
    let raf = 0;

    const move = (e) => {
      avx += e.clientX - tx;
      avy += e.clientY - ty;
      tx = e.clientX;
      ty = e.clientY;
    };
    const overEl = (e) => {
      over = !!e.target.closest("a, button, [role='button']");
    };
    const down = () => {
      pressed = true;
    };
    const up = () => {
      pressed = false;
    };

    const tick = () => {
      // lazy lookup: the span only mounts after the setActive re-render
      const el = dotRef.current;
      if (el) {
        cx += (tx - cx) * 0.55;
        cy += (ty - cy) * 0.55;
        vx += (avx - vx) * 0.35;
        vy += (avy - vy) * 0.35;
        avx = 0;
        avy = 0;

        const speed = Math.hypot(vx, vy);
        stretch += (Math.min(1, speed / 12) - stretch) * 0.25;
        if (speed > 0.4) {
          const target = Math.atan2(vy, vx);
          let d = target - angle;
          while (d > Math.PI) d -= Math.PI * 2;
          while (d < -Math.PI) d += Math.PI * 2;
          angle += d * 0.35;
        }

        const targetScale = pressed ? 0.7 : over ? 1.4 : 1;
        scale += (targetScale - scale) * 0.2;

        // shift the head slightly backwards so the stretched tail trails behind
        const ox = -Math.cos(angle) * stretch * 3;
        const oy = -Math.sin(angle) * stretch * 3;
        el.style.transform =
          `translate3d(${cx + ox}px, ${cy + oy}px, 0) rotate(${angle}rad) ` +
          `scale(${(scale * (1 + stretch * 0.8)).toFixed(3)}, ${(scale * (1 - stretch * 0.25)).toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", overEl);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", overEl);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [reduced]);

  if (!active) return null;

  return (
    <div className="cursor-dot" aria-hidden="true">
      <span ref={dotRef} />
    </div>
  );
}
