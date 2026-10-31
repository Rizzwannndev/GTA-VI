import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { RELEASE_LABEL } from "../../data/site";
import HorizonDivider from "../svg/HorizonDivider";
import { bayUrl } from "../../assets/images/art";

const lines = [
  { text: "Welcome to", kind: "outline", drift: -18 },
  { text: "Leonida", kind: "image", drift: 14 },
  { text: RELEASE_LABEL, kind: "outline", drift: -12 },
];

// Kinetic type: three huge lines slide against each other with the scroll.
// The outlined lines fill in as they cross the viewport; the middle line is
// cut out of the bay artwork, the same trick as the VI intro.
export default function Welcome() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".welcome__copy", { start: "top 88%" });
      if (prefersReducedMotion()) return;
      gsap.utils.toArray(".kinetic__line").forEach((line) => {
        const drift = Number(line.dataset.drift);
        gsap.fromTo(
          line,
          { xPercent: -drift },
          {
            xPercent: drift,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
        const fill = line.querySelector(".kinetic__fill");
        if (fill) {
          gsap.fromTo(
            fill,
            { clipPath: "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: line, start: "top 85%", end: "top 30%", scrub: true },
            },
          );
        }
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="welcome"
      className="welcome section"
      aria-labelledby="welcome-title"
      style={{ "--bay": `url(${bayUrl})` }}
    >
      <h2 id="welcome-title" className="sr-only">
        Welcome to Leonida, {RELEASE_LABEL}
      </h2>
      <div className="kinetic" aria-hidden="true">
        {lines.map((l) => (
          <div key={l.text} className={`kinetic__line kinetic__line--${l.kind}`} data-drift={l.drift}>
            {l.kind === "outline" ? (
              <>
                <span className="kinetic__outline">{l.text}</span>
                <span className="kinetic__fill">{l.text}</span>
              </>
            ) : (
              <span className="kinetic__image">{l.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className="wrap welcome__body">
        <HorizonDivider />
        <p className="welcome__copy">
          Leonida is Rockstar's take on Florida: Vice City's neon and nightlife, the Keys, the wetlands, the port towns and
          the pines up north. Grand Theft Auto VI arrives on {RELEASE_LABEL}. This fan site collects what Rockstar has
          shown so far.
        </p>
      </div>
    </section>
  );
}
