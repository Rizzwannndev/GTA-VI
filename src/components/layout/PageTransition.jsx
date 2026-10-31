import { useEffect, useRef } from "react";
import { registerTransition } from "../../animations/transition";

// Markup for the route-change wipe. Hidden until a navigation drives it.
export default function PageTransition() {
  const ref = useRef(null);
  useEffect(() => registerTransition(ref.current), []);
  return (
    <div ref={ref} className="pt" aria-hidden="true">
      <div className="pt__panel pt__panel--a" />
      <div className="pt__panel pt__panel--b" />
      <div className="pt__panel pt__panel--c">
        <p className="pt__name">
          <span className="pt__name-text" />
        </p>
      </div>
    </div>
  );
}
