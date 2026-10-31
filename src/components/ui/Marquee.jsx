import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { getScrollVelocity } from "../../animations/smooth";

// Infinite marquee. Drifts at a base speed, speeds up with scroll velocity and
// flips direction with the scroll direction. With `slowOnHover` it eases down
// to a crawl under the pointer. Under reduced motion it stays put.
export default function Marquee({ children, speed = 60, reverse = false, className = "", repeat = 4, label, slowOnHover = false, cursor }) {
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
      let ease = 1;
      let easeTarget = 1;
      const root = rootRef.current;
      const slow = () => (easeTarget = 0.18);
      const resume = () => (easeTarget = 1);
      if (slowOnHover) {
        root.addEventListener("pointerenter", slow);
        root.addEventListener("pointerleave", resume);
      }

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
        ease += (easeTarget - ease) * Math.min(1, delta / 250);
        x += dir * speed * boost * ease * (delta / 1000);
        x = gsap.utils.wrap(-width, 0, x);
        setX(x);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        root.removeEventListener("pointerenter", slow);
        root.removeEventListener("pointerleave", resume);
        io.disconnect();
        ro.disconnect();
      };
    },
    { scope: rootRef, dependencies: [speed, reverse, slowOnHover] },
  );

  return (
    <div
      ref={rootRef}
      className={`marquee ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      data-cursor={cursor}
    >
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
