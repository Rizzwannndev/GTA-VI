import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { OFFICIAL_URL, RELEASE_LABEL } from "../../data/site";
import Button from "../ui/Button";
import PalmLine from "../svg/PalmLine";
import NeonSign from "../svg/NeonSign";

// Closing call to action: a synthwave sun rising behind line-drawn palms, the
// date, and a glowing pre-order button that goes to Rockstar's official page.
export default function Cta() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".cta__title", { type: "chars", stagger: 0.025 });
      revealText(".cta__copy", { delay: 0.2 });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".cta__sun",
        { yPercent: 45 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "center center", scrub: true } },
      );
      gsap.from(".cta__palm path", {
        drawSVG: 0,
        duration: 2.2,
        stagger: 0.05,
        ease: "power2.inOut",
        scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="cta" aria-labelledby="cta-title">
      <div className="cta__sky" aria-hidden="true">
        <div className="cta__sunclip">
          <div className="cta__sun" />
        </div>
        <div className="cta__grid" />
      </div>
      <PalmLine className="cta__palm cta__palm--l" />
      <PalmLine className="cta__palm cta__palm--r" flip />
      <div className="wrap cta__body">
        <NeonSign text="Leonida" sub="open November 19" className="cta__neon" />
        <h2 id="cta-title" className="cta__title">
          See you in Vice City
        </h2>
        <p className="cta__copy">
          Grand Theft Auto VI launches {RELEASE_LABEL} on PlayStation 5 and Xbox Series X|S. Pre-orders are open through
          Rockstar Games and the console stores.
        </p>
        <div className="cta__actions">
          <Button href={OFFICIAL_URL} variant="glow" icon="arrowUpRight" magnetic>
            Pre-order at Rockstar Games
          </Button>
          <Button to="/editions" variant="ghost" magnetic={false}>
            Compare editions
          </Button>
        </div>
      </div>
    </section>
  );
}
