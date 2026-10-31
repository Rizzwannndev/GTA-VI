import { useRef } from "react";
import { gsap, useGSAP, MQ, prefersReducedMotion, isFinePointer } from "../../animations/gsap";
import { scrollToTarget } from "../../animations/smooth";
import { scrambleText } from "../../animations/motion";
import { art } from "../../assets/images/art";
import Picture from "../ui/Picture";
import Icon from "../ui/Icon";
import PlatformMarks from "../ui/PlatformMarks";
import Button from "../ui/Button";
import { useVideo } from "../../context/VideoContext";
import { featuredTrailer } from "../../data/trailers";
import { OFFICIAL_URL, RELEASE_LABEL } from "../../data/site";

// Rockstar's own one-line premise, split so it can light up word by word.
const PREMISE = [
  { text: "Jason and Lucia have always known the deck is stacked against them. But when an easy score goes wrong, they find themselves on the" },
  { text: "darkest side", tone: "dark" },
  { text: "of the" },
  { text: "sunniest place in America.", tone: "sun" },
];

// The landing scene. On reveal it plays the original "settle" (every layer
// starts zoomed and rotated and eases into place). On scroll it pins, and the
// layers pull apart by depth while dusk falls over the bay.
export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const { openVideo } = useVideo();

  // Scroll choreography, set up once on mount so pin spacing exists before
  // the sections below measure themselves.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions;
        if (!motion) return;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: desktop ? "+=230%" : "+=190%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          // Depth: the bay drifts slowest and softens like a lens racking
          // focus, the logo lifts away, the leads walk towards the camera.
          .to(".hero__layer--bg", { scale: 1.22, yPercent: 6, filter: desktop ? "blur(6px)" : "none" }, 0)
          .to(".hero__layer--logo", { yPercent: -70, scale: 0.72, autoAlpha: 0 }, 0)
          .to(".hero__layer--chars", { scale: desktop ? 1.35 : 1.18, yPercent: desktop ? 10 : 6, transformOrigin: "50% 100%" }, 0)
          .to(".hero__bar", { autoAlpha: 0, y: 60, duration: 0.25 }, 0)
          .to(".hero__dusk", { opacity: 1, duration: 0.6 }, 0.25)
          .fromTo(".hero__premise", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.45)
          // The premise lights up word by word, rising out of a soft blur,
          // then the sunset underline draws itself beneath the last line.
          .fromTo(
            ".hero__premise-word",
            { opacity: 0.12, yPercent: 30, filter: "blur(6px)" },
            { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 0.12, stagger: 0.022 },
            0.5,
          )
          .fromTo(".hero__premise-swash path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.25, ease: "power2.inOut" }, ">-0.05")
          .fromTo(".hero__premise-credit", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.15 }, "<")
          .to({}, { duration: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // The original settle, kept value for value.
  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) {
        gsap.from(".hero__stage", { autoAlpha: 0, duration: 0.6 });
        return;
      }
      gsap.fromTo(".hero__stage", { scale: 1.7, rotate: -10 }, { scale: 1, rotate: 0, duration: 2, delay: -1, ease: "expo.inOut" });
      gsap.fromTo(".hero__bg", { scale: 1.7, rotate: -3 }, { scale: 1.1, rotate: 0, duration: 2, delay: -0.8, ease: "expo.inOut" });
      gsap.fromTo(
        ".hero__chars",
        { scale: 1.7, rotate: -10, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 2, delay: -1, ease: "expo.inOut" },
      );
      gsap.fromTo(".hero__logo", { scale: 1.6, rotate: -10 }, { scale: 1, rotate: 0, duration: 2, delay: -0.95, ease: "expo.inOut" });
      gsap.fromTo(".hero__bar-item", { opacity: 0.1 }, { opacity: 1, duration: 2, delay: -0.5, ease: "expo.inOut" });
      gsap.from(".hero__info > *", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.2, delay: 0.5, ease: "vice" });
      scrambleText(".hero__date-text", { scroll: false, delay: 0.6, duration: 1.4 });
    },
    { dependencies: [ready], scope: rootRef },
  );

  // Mouse parallax in two axes. Each layer moves by its depth: the bay a
  // little against the pointer, the logo with it, the leads furthest,
  // so the three planes read as separate depths.
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion() || !isFinePointer()) return;
      const root = rootRef.current;
      const to = (sel, prop, d = 1) => gsap.quickTo(sel, prop, { duration: d, ease: "power3" });
      const layers = [
        [".hero__bg", -18, -10, 1.2],
        [".hero__logo", 22, 12, 1],
        [".hero__chars", 46, 18, 0.9],
      ].map(([sel, x, y, d]) => ({ x, y, mx: to(sel, "x", d), my: to(sel, "y", d) }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        for (const l of layers) {
          l.mx(nx * l.x);
          l.my(ny * l.y);
        }
      };
      const onLeave = () => {
        for (const l of layers) {
          l.mx(0);
          l.my(0);
        }
      };
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
      return () => {
        root.removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseleave", onLeave);
      };
    },
    { dependencies: [ready], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="hero" aria-label="Grand Theft Auto VI">
      <div className="hero__stage">
        <div className="hero__layer hero__layer--bg">
          <Picture
            image={art.bay}
            alt="Vice City's skyline across the bay at golden hour, a police boat speeding past"
            className="hero__bg-pic"
            imgClassName="hero__bg"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="hero__layer hero__layer--logo">
          <div className="hero__logo-pos">
            <Picture image={art.logo} alt="Grand Theft Auto VI" imgClassName="hero__logo" loading="eager" sizes="(max-width: 900px) 70vw, 560px" />
          </div>
        </div>
        <div className="hero__layer hero__layer--chars">
          <Picture
            image={art.duo}
            alt="Lucia and Jason, guns drawn"
            imgClassName="hero__chars"
            loading="eager"
            sizes="(max-width: 900px) 200vw, 100vw"
          />
        </div>
        <div className="hero__dusk" aria-hidden="true" />

        <div className="hero__premise">
          <p className="hero__premise-text">
            <span className="sr-only">{PREMISE.map((c) => c.text).join(" ")}</span>
            <span aria-hidden="true">
              {PREMISE.map((chunk, ci) => (
                <span key={ci} className={chunk.tone ? `hero__premise-${chunk.tone}` : undefined}>
                  {chunk.text.split(" ").map((w, wi) => (
                    <span key={wi} className="hero__premise-word">
                      {w}{" "}
                    </span>
                  ))}
                  {chunk.tone === "sun" && (
                    <svg className="hero__premise-swash" viewBox="0 0 600 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="premise-sun" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0" stopColor="#4a3fb8" />
                          <stop offset="0.35" stopColor="#9b4fd0" />
                          <stop offset="0.7" stopColor="#ff4f9a" />
                          <stop offset="1" stopColor="#ff9a52" />
                        </linearGradient>
                      </defs>
                      <path d="M6 28 C 120 10, 260 6, 360 14 S 540 30, 594 12" fill="none" stroke="url(#premise-sun)" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
              ))}
            </span>
          </p>
          <p className="hero__premise-credit">From Rockstar Games' description of the story</p>
        </div>

        <div className="hero__bar">
          <div className="hero__info">
            <p className="hero__date">
              <span className="sr-only">Release date: </span>
              <span className="hero__date-text">{RELEASE_LABEL}</span>
            </p>
            <PlatformMarks className="hero__platforms" />
            <div className="hero__actions">
              <Button icon="play" onClick={(e) => openVideo(featuredTrailer, e.currentTarget)}>
                <span className="hero__label-long">Watch the {featuredTrailer.title}</span>
                <span className="hero__label-short">Watch trailer</span>
              </Button>
              <Button href={OFFICIAL_URL} variant="ghost" icon="arrowUpRight" magnetic={false}>
                Pre-order
              </Button>
            </div>
          </div>
          <div className="hero__aside">
            <button type="button" className="hero__bar-item hero__scroll" onClick={() => scrollToTarget("#welcome")} data-cursor="link">
              <Icon name="arrowDown" size="1.25rem" />
              <span>Scroll</span>
            </button>
            <Picture image={art.pegi} alt="PEGI 18" imgClassName="hero__bar-item hero__pegi" sizes="56px" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
