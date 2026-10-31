import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { usePageRevealed } from "../../animations/stage";
import Picture from "../ui/Picture";

// The opening of every inner page: a huge title that rises letter by letter
// once the page transition uncovers it, over a slow-zooming backdrop.
export default function PageHero({ title, lede, image, src, alt = "", tone = "var(--color-pink)", children, align = "end" }) {
  const rootRef = useRef(null);
  const revealed = usePageRevealed();

  useGSAP(
    () => {
      if (!revealed) return;
      revealText(".page-hero__title", { type: "chars", scroll: false, stagger: 0.03, duration: 1.2 });
      revealText(".page-hero__lede", { scroll: false, delay: 0.35 });
      if (prefersReducedMotion()) return;
      if (!rootRef.current.querySelector(".page-hero__media")) return;
      gsap.fromTo(".page-hero__media", { scale: 1.25 }, { scale: 1.05, duration: 2.4, ease: "vice" });
      gsap.to(".page-hero__media", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      const extra = rootRef.current.querySelectorAll(".page-hero__extra > *");
      if (extra.length) gsap.from(extra, { y: 30, autoAlpha: 0, stagger: 0.08, delay: 0.5, duration: 1 });
    },
    { dependencies: [revealed], scope: rootRef },
  );

  return (
    <header ref={rootRef} className={`page-hero page-hero--${align}`} style={{ "--tone": tone }}>
      {(image || src) && (
        <div className="page-hero__backdrop" aria-hidden={alt ? undefined : "true"}>
          <Picture image={image} src={src} alt={alt} className="page-hero__media" imgClassName="page-hero__media-img" loading="eager" fetchPriority="high" />
        </div>
      )}
      <div className="page-hero__shade" aria-hidden="true" />
      <div className="wrap page-hero__inner">
        <h1 className="page-hero__title">{title}</h1>
        {lede && <p className="page-hero__lede">{lede}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </header>
  );
}
