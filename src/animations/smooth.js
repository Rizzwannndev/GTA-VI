// Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger reads
// the same scroll position Lenis renders. One instance for the whole app.
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

let lenis = null;
let tick = null;
let lockCount = 0;

export function initSmoothScroll() {
  if (lenis) return lenis;
  const reduce = prefersReducedMotion();
  lenis = new Lenis({
    // Reduced motion keeps native-feeling scroll: no easing, no inertia.
    lerp: reduce ? 1 : 0.11,
    smoothWheel: !reduce,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = () => lenis;

// Ref-counted lock: the menu, video modal and page transition can overlap,
// and scroll must only come back once all of them have released it.
export function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    lenis?.stop();
    document.documentElement.classList.add("is-locked");
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove("is-locked");
    lenis?.start();
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function scrollToTarget(target, options = {}) {
  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4, ...options });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "auto", block: "start" });
}

// Velocity in px/frame from Lenis, used by marquees and skew effects.
export const getScrollVelocity = () => lenis?.velocity ?? 0;
