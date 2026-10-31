import { useEffect, useRef } from "react";
import { gsap, MQ } from "../../animations/gsap";
import { useMediaQuery } from "../../hooks/useMediaQuery";

// Elements set data-cursor to ask for a mode; anything else interactive gets
// the plain "link" bloom. Labelled modes swell into a white disc with a word.
const LABELS = { view: "View", play: "Play", watch: "Play", drag: "Drag", close: "Close" };
const INTERACTIVE = "[data-cursor], a, button, [role='button'], label, summary, input, textarea, select, iframe";

function modeFor(target) {
  const el = target?.closest?.(INTERACTIVE);
  if (!el || el.disabled) return "default";
  if (el.dataset.cursor) return el.dataset.cursor;
  if (el.tagName === "IFRAME") return "none";
  if (el.matches("input, textarea, select")) return "text";
  return "link";
}

// A small dot that sits exactly on the pointer and a ring that trails it.
// Mounted only for a mouse-like pointer without reduced motion. The native
// cursor is hidden by the html.has-cursor class this adds, so if scripts
// never run, the normal cursor is still there.
export default function Cursor() {
  const enabled = useMediaQuery(`${MQ.fine} and ${MQ.motion}`);
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const root = rootRef.current;
    html.classList.add("has-cursor");

    const dotX = gsap.quickSetter(dotRef.current, "x", "px");
    const dotY = gsap.quickSetter(dotRef.current, "y", "px");
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3" });

    let x = -100;
    let y = -100;
    let mode = "";
    let frame = 0;

    const apply = (target) => {
      const next = modeFor(target);
      if (next === mode) return;
      mode = next;
      root.dataset.mode = next;
      const label = LABELS[next] ?? "";
      root.classList.toggle("has-label", !!label);
      if (label) labelRef.current.textContent = label;
    };

    const move = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
      root.classList.add("is-visible");
      apply(e.target);
    };
    // Content moves under a still pointer while scrolling; re-read what's there.
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => apply(document.elementFromPoint(x, y)));
    };
    const hide = () => root.classList.remove("is-visible");
    const down = () => root.classList.add("is-down");
    const up = () => root.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("scroll", onScroll, { passive: true });
    html.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scroll", onScroll);
      html.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor" data-mode="default" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
