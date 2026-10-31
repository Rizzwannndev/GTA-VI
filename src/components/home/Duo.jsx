import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { parallax, revealText } from "../../animations/motion";
import { leads } from "../../data/characters";
import Picture from "../ui/Picture";
import Button from "../ui/Button";

// Lucia and Jason, each as a full-bleed official screenshot. The panels open
// outward from the seam between them like double doors, the photo drifts
// with the scroll, and hovering a panel pushes in on the shot while the
// other dims.
export default function Duo() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".duo__name", { type: "chars", stagger: 0.04 });
      revealText(".duo__quote", { delay: 0.2 });
      revealText(".duo__bio", { delay: 0.3 });
      parallax(".duo__photo", { speed: 6 });
      if (prefersReducedMotion()) return;
      gsap.utils.toArray(".duo__panel").forEach((panel, i) => {
        const fromSide = i === 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
        gsap
          .timeline({ scrollTrigger: { trigger: panel, start: "top 75%", once: true } })
          .fromTo(panel.querySelector(".duo__field"), { clipPath: fromSide }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "wipe" })
          .fromTo(panel.querySelector(".duo__field picture"), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="duo section" aria-labelledby="duo-title">
      <div className="wrap">
        <h2 id="duo-title" className="duo__title">
          Two leads, one way out
        </h2>
      </div>
      <div className="duo__panels">
        {leads.map((c) => (
          <article key={c.id} className={`duo__panel duo__panel--${c.id}`} style={{ "--focus": c.focus }}>
            <div className="duo__field">
              <Picture image={c.image} alt={c.imageAlt} imgClassName="duo__photo" sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="duo__text">
              <h3 className="duo__name">{c.first}</h3>
              <blockquote className="duo__quote">
                <p>{c.quote}</p>
              </blockquote>
              <p className="duo__bio">{c.bio}</p>
              <p className="duo__credit">Screenshot: {c.image.credit}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap duo__more">
        <Button to="/characters" variant="ghost" icon="arrowRight" magnetic={false}>
          Meet the full cast
        </Button>
      </div>
    </section>
  );
}
