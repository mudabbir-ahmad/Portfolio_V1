import { useState } from "react";

// Single image renders as a plain picture; several render as a carousel with
// arrows, dots, and scroll-snap swiping.
export default function ImageCarousel({ images }) {
  const [i, setI] = useState(0);
  if (images.length === 1) return <img className="pm-image" src={images[0]} alt="" />;
  const go = (n) => setI((n + images.length) % images.length);
  return (
    <div
      className="pm-carousel"
      role="group"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
    >
      <div className="pm-carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src, n) => (
          <img key={src} className="pm-image" src={src} alt="" aria-hidden={n !== i} />
        ))}
      </div>
      <button className="pm-arrow pm-arrow--prev" onClick={() => go(i - 1)} aria-label="Previous image">‹</button>
      <button className="pm-arrow pm-arrow--next" onClick={() => go(i + 1)} aria-label="Next image">›</button>
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
    </div>
  );
}
