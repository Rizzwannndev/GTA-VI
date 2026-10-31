// The shared motion vocabulary. Call these inside useGSAP() so the GSAP
// context records every tween, ScrollTrigger and SplitText and reverts them
// when the component unmounts. Each helper degrades to a plain fade (or to
// nothing) when the visitor prefers reduced motion.
import { gsap, SplitText, prefersReducedMotion, isFinePointer } from "./gsap";

const toArray = (target) => gsap.utils.toArray(target);

function fadeIn(targets, { trigger, start = "top 85%", delay = 0, scroll = true } = {}) {
  return gsap.from(targets, {
    autoAlpha: 0,
    duration: 0.6,
    delay,
    ease: "power1.out",
    scrollTrigger: scroll ? { trigger: trigger ?? targets, start, once: true } : undefined,
  });
}

/**
 * Split text into masked lines (or words/chars) without animating. Returns the
 * SplitText instance; autoSplit re-splits on resize and font load.
 */
export function splitLines(target, { type = "lines", onSplit, ...rest } = {}) {
  return SplitText.create(target, {
    type,
    mask: type === "chars" ? "lines" : type,
    linesClass: "split-line",
    autoSplit: true,
    onSplit,
    ...rest,
  });
}

/**
 * Lines (or chars) slide up from their masks. With `scroll: false` it plays
 * immediately, for heroes that animate on page reveal.
 */
export function revealText(
  target,
  { type = "lines", stagger, delay = 0, duration = 1.15, trigger, start = "top 86%", scroll = true } = {},
) {
  const els = toArray(target);
  if (!els.length) return null;
  if (prefersReducedMotion()) return fadeIn(els, { trigger: trigger ?? els[0], start, delay, scroll });

  const pieces = type === "chars" ? "chars" : type === "words" ? "words" : "lines";
  return els.map((el) =>
    splitLines(el, {
      type: pieces === "lines" ? "lines" : `lines,${pieces}`,
      onSplit(self) {
        return gsap.from(self[pieces], {
          yPercent: 115,
          rotate: pieces === "chars" ? 6 : 0,
          duration,
          delay,
          ease: "vice",
          stagger: stagger ?? (pieces === "chars" ? 0.025 : 0.09),
          scrollTrigger: scroll ? { trigger: trigger ?? el, start, once: true } : undefined,
        });
      },
    }),
  );
}

/**
 * Scramble a short string into place, like a departures board settling.
 * Meant for a few key words (dates, labels), never running text. The element
 * must hold plain text only. Reduced motion leaves the text alone.
 */
export function scrambleText(target, { delay = 0, duration = 1.2, trigger, start = "top 88%", scroll = true } = {}) {
  if (prefersReducedMotion()) return null;
  return toArray(target).map((el) =>
    gsap.to(el, {
      duration,
      delay,
      ease: "none",
      scrambleText: { text: el.textContent, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", revealDelay: 0.35, speed: 0.5 },
      scrollTrigger: scroll ? { trigger: trigger ?? el, start, once: true } : undefined,
    }),
  );
}

/**
 * Clip-path wipe from the bottom edge while the inner media settles from a
 * slight zoom. Pass the frame; the first img/svg/video inside is the media.
 */
export function revealImage(
  target,
  { from = "bottom", delay = 0, duration = 1.5, trigger, start = "top 85%", scroll = true } = {},
) {
  const frames = toArray(target);
  if (!frames.length) return null;
  if (prefersReducedMotion()) return fadeIn(frames, { trigger: trigger ?? frames[0], start, delay, scroll });

  const hidden = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];

  return frames.map((frame) => {
    const media = frame.querySelector("img, svg, video, picture");
    const tl = gsap.timeline({
      delay,
      scrollTrigger: scroll ? { trigger: trigger ?? frame, start, once: true } : undefined,
    });
    tl.fromTo(
      frame,
      { clipPath: hidden },
      { clipPath: "inset(0% 0% 0% 0%)", duration, ease: "wipe" },
    );
    if (media) tl.fromTo(media, { scale: 1.3 }, { scale: 1, duration: duration + 0.4, ease: "vice" }, 0);
    return tl;
  });
}

/**
 * Scroll-linked drift. `speed` is the yPercent travelled in each direction.
 * Disabled entirely for reduced motion.
 */
export function parallax(target, { speed = 12, trigger, start = "top bottom", end = "bottom top", x = false } = {}) {
  if (prefersReducedMotion()) return null;
  const prop = x ? "xPercent" : "yPercent";
  return toArray(target).map((el) =>
    gsap.fromTo(
      el,
      { [prop]: -speed },
      {
        [prop]: speed,
        ease: "none",
        scrollTrigger: { trigger: trigger ?? el.parentElement ?? el, start, end, scrub: true },
      },
    ),
  );
}

/**
 * Pointer-follow pull for buttons and nav items. Returns a cleanup function;
 * a no-op on touch screens and for reduced motion.
 */
export function magnetic(target, { strength = 0.35, text } = {}) {
  if (prefersReducedMotion() || !isFinePointer()) return () => {};
  const cleanups = toArray(target).map((el) => {
    const inner = text ? el.querySelector(text) : null;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const ixTo = inner && gsap.quickTo(inner, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const iyTo = inner && gsap.quickTo(inner, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.4);
      iyTo?.(dy * strength * 0.4);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      ixTo?.(0);
      iyTo?.(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set([el, inner].filter(Boolean), { x: 0, y: 0 });
    };
  });
  return () => cleanups.forEach((fn) => fn());
}

/**
 * Pinned, scrubbed section. `build(tl)` adds tweens to the timeline. With
 * reduced motion the timeline jumps to its end state with no pin or scrub,
 * so the content is still all there.
 */
export function scrubSection(section, build, { pin = true, end = "+=150%", start = "top top", scrub = 1, anticipatePin = 1 } = {}) {
  const reduce = prefersReducedMotion();
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: reduce
      ? undefined
      : { trigger: section, start, end, pin, scrub, anticipatePin, invalidateOnRefresh: true },
  });
  build(tl);
  if (reduce) tl.progress(1).pause();
  return tl;
}
