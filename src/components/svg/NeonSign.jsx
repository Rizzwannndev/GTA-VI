import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";

// A neon tube sign: stroked SVG text with a glow filter that flickers on, then
// stutters now and then. Steady (no flicker) under reduced motion.
export default function NeonSign({ text, sub, className = "", color = "#ff3d8b", subColor = "#30e3d0" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tubes = ref.current.querySelectorAll(".neon__tube");
      const on = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
      on.set(tubes, { opacity: 0.12 })
        .to(tubes, { opacity: 1, duration: 0.05, repeat: 5, yoyo: true, ease: "steps(1)", stagger: 0.12 })
        .to(tubes, { opacity: 1, duration: 0.1 });

      const stutter = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2 });
      stutter
        .to(tubes[0], { opacity: 0.25, duration: 0.06, ease: "steps(1)" })
        .to(tubes[0], { opacity: 1, duration: 0.06, ease: "steps(1)" })
        .to(tubes[0], { opacity: 0.4, duration: 0.05, ease: "steps(1)" }, "+=0.12")
        .to(tubes[0], { opacity: 1, duration: 0.05, ease: "steps(1)" });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} className={`neon ${className}`} viewBox="0 0 800 260" role="img" aria-label={sub ? `${text}, ${sub}` : text}>
      <defs>
        <filter id="neon-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#neon-glow)" fill="none" strokeLinejoin="round">
        <text className="neon__tube" x="400" y="140" textAnchor="middle" stroke={color} strokeWidth="3" fontSize="150">
          {text}
        </text>
        {sub && (
          <text className="neon__tube" x="400" y="228" textAnchor="middle" stroke={subColor} strokeWidth="2.2" fontSize="62">
            {sub}
          </text>
        )}
      </g>
    </svg>
  );
}
