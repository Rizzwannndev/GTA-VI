import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { getScrollVelocity } from "../../animations/smooth";

// Infinite marquee. Drifts at a base speed, speeds up with scroll velocity and
// flips direction with the scroll direction. Under reduced motion it stays put.
export default function Marquee({ children, speed = 60, reverse = false, className = "", repeat = 4, label }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = trackRef.current;
      const first = track.firstElementChild;
      let width = first.offsetWidth;
      let x = 0;
      let dir = reverse ? 1 : -1;
      let visible = true;

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(rootRef.current);
      const ro = new ResizeObserver(() => {
        width = first.offsetWidth;
      });
      ro.observe(first);

      const setX = gsap.quickSetter(track, "x", "px");
      const tick = (_, delta) => {
        if (!visible || !width) return;
        const v = getScrollVelocity();
        if (Math.abs(v) > 0.4) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        const boost = 1 + Math.min(Math.abs(v) * 0.35, 9);
        x += dir * speed * boost * (delta / 1000);
        x = gsap.utils.wrap(-width, 0, x);
        setX(x);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
      };
    },
    { scope: rootRef, dependencies: [speed, reverse] },
  );

  return (
    <div ref={rootRef} className={`marquee ${className}`} role={label ? "img" : undefined} aria-label={label}>
      <div ref={trackRef} className="marquee__track" aria-hidden={label ? "true" : undefined}>
        {Array.from({ length: repeat }, (_, i) => (
          <div className="marquee__group" key={i} aria-hidden={i > 0 ? "true" : undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
