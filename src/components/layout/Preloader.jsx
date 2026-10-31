import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { lockScroll, unlockScroll } from "../../animations/smooth";
import { ViGlyph, VI_VIEWBOX } from "../svg/ViMark";
import PalmLine from "../svg/PalmLine";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pageLoaded = () =>
  new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true })));

// First-load screen: the VI mark and two palms draw themselves in line, the
// mark fills with the sunset, then the screen hands over. On the home page it
// fades into the black of the intro; elsewhere it wipes up off the page.
// It waits for fonts and the page's eager images, capped at four seconds.
export default function Preloader({ handoff, onReveal, onDone }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      let cancelled = false;
      lockScroll();
      // Nothing behind the loading screen can take focus until it leaves.
      const behind = document.querySelectorAll(".site-header, #main, .footer");
      behind.forEach((el) => (el.inert = true));

      if (!reduce) {
        gsap
          .timeline()
          .from(".preloader__glyph path", { drawSVG: 0, duration: 1.5, stagger: 0.2, ease: "power2.inOut" })
          .from(".preloader__palm path", { drawSVG: 0, duration: 1.3, stagger: 0.03, ease: "power2.inOut" }, 0.15);
      }

      const ready = Promise.race([Promise.all([document.fonts?.ready, pageLoaded()]), wait(4000)]);
      // The minimum is measured from navigation start: on a slow connection
      // the wait for scripts already counts towards it.
      const minimum = Math.max(0, (reduce ? 200 : 1900) - performance.now() * 0.5);
      Promise.all([ready, wait(minimum)]).then(() => {
        if (cancelled) return;
        // Unmounting (after onDone) releases the scroll lock in the cleanup.
        const finish = () => onDone();
        if (reduce) {
          onReveal();
          gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
          return;
        }
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(".preloader__fill", { autoAlpha: 1, duration: 0.45, ease: "power1.out" })
          .to(".preloader__stage", { autoAlpha: 0, scale: 0.94, duration: 0.5, ease: "power2.in" }, "+=0.3")
          .call(onReveal);
        if (handoff) tl.to(rootRef.current, { autoAlpha: 0, duration: 0.4 });
        else tl.to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "wipe" }, "-=0.05");
      });

      return () => {
        cancelled = true;
        behind.forEach((el) => (el.inert = false));
        unlockScroll();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="preloader" role="status">
      <span className="sr-only">Loading</span>
      <div className="preloader__stage" aria-hidden="true">
        <PalmLine className="preloader__palm" />
        <svg className="preloader__mark" viewBox={VI_VIEWBOX}>
          <defs>
            <linearGradient id="vi-preloader-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a3fb8" />
              <stop offset="0.38" stopColor="#9b4fd0" />
              <stop offset="0.68" stopColor="#ff4f9a" />
              <stop offset="1" stopColor="#ff9a52" />
            </linearGradient>
          </defs>
          <ViGlyph className="preloader__fill" fill="url(#vi-preloader-grad)" />
          <ViGlyph className="preloader__glyph" fill="none" stroke="#fff" strokeWidth="5" />
        </svg>
        <PalmLine className="preloader__palm" flip />
      </div>
    </div>
  );
}
