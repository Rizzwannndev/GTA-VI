// The page transition layer: three panels (pink, orange, black) wipe up over
// the page, the destination's name rises on the black one, and after the
// route swap they lift away in reverse. The DOM lives in <PageTransition />;
// these two functions drive it and resolve when each half has finished.
import { gsap, prefersReducedMotion } from "./gsap";

let root = null;

export function registerTransition(node) {
  root = node;
  return () => {
    if (root === node) root = null;
  };
}

const all = (selector) => [...root.querySelectorAll(selector)];

export function coverScreen(name) {
  return new Promise((resolve) => {
    if (!root) return resolve();
    const panels = all(".pt__panel");
    const word = root.querySelector(".pt__name-text");
    gsap.killTweensOf([root, ...panels, word]);
    word.textContent = name;
    root.style.setProperty("--len", Math.max(name.length, 4));

    if (prefersReducedMotion()) {
      gsap.set(panels, { yPercent: 0 });
      gsap.set(word, { yPercent: 0 });
      gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, onComplete: resolve });
      return;
    }
    gsap
      .timeline({ onComplete: resolve })
      .set(root, { autoAlpha: 1 })
      .fromTo(panels, { yPercent: 101 }, { yPercent: 0, duration: 0.75, stagger: 0.08, ease: "wipe" })
      .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.75 }, 0.42)
      .to({}, { duration: 0.12 });
  });
}

export function revealScreen() {
  return new Promise((resolve) => {
    if (!root) return resolve();
    const done = () => {
      gsap.set(root, { autoAlpha: 0 });
      resolve();
    };
    if (prefersReducedMotion()) {
      gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: resolve });
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(root.querySelector(".pt__name-text"), { yPercent: -110, duration: 0.45, ease: "power3.in" })
      .to(all(".pt__panel").reverse(), { yPercent: -101, duration: 0.8, stagger: 0.07, ease: "wipe" }, 0.22);
  });
}
