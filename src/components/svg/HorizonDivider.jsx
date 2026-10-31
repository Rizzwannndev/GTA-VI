import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";

// A hairline rule that draws outward from its centre as it scrolls into view.
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
    <svg ref={ref} className={`horizon ${className}`} viewBox="0 0 1200 24" fill="none" aria-hidden="true">
      <path d="M0 12 H1200" stroke="currentColor" strokeWidth="1" />
      <path d="M0 4 V20 M1200 4 V20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
