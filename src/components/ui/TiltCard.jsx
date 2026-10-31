import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "../../animations/gsap";

// A card that tilts toward the pointer in 3D, with a glare that follows it.
// Desktop pointers only; on touch and reduced motion it stays flat.
export default function TiltCard({ as = "article", className = "", children, max = 10, ...rest }) {
  const ref = useRef(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(el, { transformPerspective: 900 });

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * max * 2);
      rx((0.5 - py) * max * 2);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
    };
  }, [max]);

  return (
    <Tag ref={ref} className={`tilt ${className}`} {...rest}>
      {children}
      <span className="tilt__glare" aria-hidden="true" />
    </Tag>
  );
}
