import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";

// A horizon line with a half sun that draws itself as it scrolls into view.
export default function HorizonDivider({ className = "" }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current.querySelectorAll("path"), {
        drawSVG: "50% 50%",
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: "top 95%", end: "top 45%", scrub: true },
      });
    },
    { scope: ref },
  );
  return (
    <svg ref={ref} className={`horizon ${className}`} viewBox="0 0 1200 80" fill="none" aria-hidden="true">
      <path d="M0 64 H1200" stroke="var(--color-pink)" strokeWidth="1.5" />
      <path d="M548 64 A52 52 0 0 1 652 64" stroke="var(--color-orange)" strokeWidth="1.5" />
      <path d="M560 52 H640 M568 42 H632 M580 32 H620" stroke="var(--color-gold)" strokeWidth="1.2" />
    </svg>
  );
}
