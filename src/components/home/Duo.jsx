import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { parallax, revealText } from "../../animations/motion";
import { leads } from "../../data/characters";
import { photos } from "../../assets/photos/photos";
import Picture from "../ui/Picture";
import Button from "../ui/Button";

const BACKDROPS = { lucia: "vice-strip", jason: "leonida-keys" };

// Lucia and Jason as two panels that open outward from the seam between them,
// like double doors; each portrait is uncovered with a clip-path wipe.
export default function Duo() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".duo__name", { type: "chars", stagger: 0.03 });
      revealText(".duo__quote", { delay: 0.2 });
      revealText(".duo__bio", { delay: 0.3 });
      parallax(".duo__portrait", { speed: 7 });
      if (prefersReducedMotion()) return;
      gsap.utils.toArray(".duo__panel").forEach((panel, i) => {
        const fromSide = i === 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
        gsap
          .timeline({ scrollTrigger: { trigger: panel, start: "top 75%", once: true } })
          .fromTo(panel.querySelector(".duo__field"), { clipPath: fromSide }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "wipe" })
          .fromTo(
            panel.querySelector(".duo__figure"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "wipe" },
            0.25,
          );
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
          <article key={c.id} className={`duo__panel duo__panel--${c.id}`} style={{ "--tint": c.tint }}>
            <div className="duo__field" aria-hidden="true">
              <Picture image={photos[BACKDROPS[c.id]]} alt="" imgClassName="duo__field-img" sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="duo__figure">
              <Picture image={c.image} alt={c.name} imgClassName="duo__portrait" sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
            <div className="duo__text">
              <h3 className="duo__name">{c.first}</h3>
              <blockquote className="duo__quote">
                <p>{c.quote}</p>
              </blockquote>
              <p className="duo__bio">{c.bio}</p>
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
