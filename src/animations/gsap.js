// Single entry point for GSAP. Import gsap and plugins from here so every
// plugin is registered exactly once before any component uses it.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  Flip,
  CustomEase,
  ScrambleTextPlugin,
);

// The site's two signature curves: a long exponential settle and a hard
// in-out used for wipes. Named so every module speaks the same motion language.
CustomEase.create("vice", "M0,0 C0.12,0.86 0.24,1 1,1");
CustomEase.create("wipe", "M0,0 C0.76,0 0.24,1 1,1");

gsap.defaults({ ease: "vice", duration: 1 });
ScrollTrigger.config({ ignoreMobileResize: true });

export const MQ = {
  desktop: "(min-width: 900px)",
  mobile: "(max-width: 899.98px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine)",
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.fine).matches;

export {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  Flip,
  CustomEase,
  ScrambleTextPlugin,
  useGSAP,
};
