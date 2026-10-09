import { useRef, useState } from "react";

// Fills its parent (the media pane of the project pop-up). Images are shown
// whole (object-fit: contain) so phone screenshots are never cropped. One image
// renders on its own; several get arrows, dots, keyboard and swipe.
export default function ImageCarousel({ images, title = "" }) {
  const [i, setI] = useState(0);
  const startX = useRef(null);
  const many = images.length > 1;
  const go = (n) => setI((n + images.length) % images.length);

  return (
    <div
      className="pm-carousel"
      role="group"
      aria-roledescription={many ? "carousel" : undefined}
      aria-label={`${title} screenshots`}
      tabIndex={many ? 0 : undefined}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (!many || startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
      }}
    >
      <div className="pm-carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src, n) => (
          <div className="pm-slide" key={src} aria-hidden={n !== i}>
            <img className="pm-image" src={src} alt="" draggable={false} />
          </div>
        ))}
      </div>
      {many && (
        <>
          <button className="pm-arrow pm-arrow--prev" onClick={() => go(i - 1)} aria-label="Previous image">
            ‹
          </button>
          <button className="pm-arrow pm-arrow--next" onClick={() => go(i + 1)} aria-label="Next image">
            ›
          </button>
          <div className="pm-dots">
            {images.map((src, n) => (
              <button
                key={src}
                className={`pm-dot${n === i ? " pm-dot--on" : ""}`}
                onClick={() => setI(n)}
                aria-label={`Image ${n + 1} of ${images.length}`}
                aria-current={n === i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
