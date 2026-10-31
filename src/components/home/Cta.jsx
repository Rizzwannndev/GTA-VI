import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { OFFICIAL_URL, RELEASE_LABEL } from "../../data/site";
import { photos } from "../../assets/photos/photos";
import Picture from "../ui/Picture";
import Button from "../ui/Button";

// Closing call to action: palms against the last of the sunset. The title
// switches on like a sign, a short stutter, then holds.
export default function Cta() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".cta__copy", { delay: 0.2 });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".cta__media",
        { yPercent: -12, scale: 1.15 },
        { yPercent: 12, scale: 1, ease: "none", scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap
        .timeline({ scrollTrigger: { trigger: ".cta__title", start: "top 80%", once: true } })
        .fromTo(".cta__title", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 })
        .to(".cta__title", { autoAlpha: 0.15, duration: 0.05 }, "+=0.08")
        .to(".cta__title", { autoAlpha: 1, duration: 0.05 }, "+=0.12")
        .to(".cta__title", { autoAlpha: 0.4, duration: 0.04 }, "+=0.05")
        .to(".cta__title", { autoAlpha: 1, duration: 0.3 }, "+=0.06")
        .from(".cta__actions > *", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.9 }, "-=0.1");
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="cta" aria-labelledby="cta-title">
      <div className="cta__backdrop" aria-hidden="true">
        <Picture image={photos.palms} alt="" className="cta__media" imgClassName="cta__media-img" sizes="100vw" />
      </div>
      <div className="wrap cta__body">
        <h2 id="cta-title" className="cta__title">
          See you in Vice City
        </h2>
        <p className="cta__copy">
          Grand Theft Auto VI launches {RELEASE_LABEL} on PlayStation 5 and Xbox Series X|S. Pre-orders are open through
          Rockstar Games and the console stores.
        </p>
        <div className="cta__actions">
          <Button href={OFFICIAL_URL} icon="arrowUpRight">
            Pre-order at Rockstar Games
          </Button>
          <Button to="/editions" variant="ghost" magnetic={false}>
            Compare editions
          </Button>
        </div>
      </div>
      <p className="cta__credit">
        Photo:{" "}
        <a href={photos.palms.href} target="_blank" rel="noreferrer">
          {photos.palms.credit} on Unsplash<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
