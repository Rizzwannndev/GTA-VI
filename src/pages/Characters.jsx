import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { parallax, revealImage, revealText } from "../animations/motion";
import { art } from "../assets/images/art";
import { cast, leads } from "../data/characters";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Picture from "../components/ui/Picture";
import TiltCard from "../components/ui/TiltCard";
import Button from "../components/ui/Button";

export default function Characters() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".lead__name", { type: "chars", stagger: 0.03 });
      revealText(".lead__quote", { delay: 0.15 });
      revealText(".lead__bio", { delay: 0.25 });
      revealImage(".lead__frame", { from: "bottom" });
      parallax(".lead__glow", { speed: 20 });
      revealText(".cast__title", { type: "chars", stagger: 0.02 });
      if (prefersReducedMotion()) return;
      gsap.from(".cast__card", {
        y: 80,
        autoAlpha: 0,
        rotate: (i) => (i % 2 ? 3 : -3),
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: ".cast__grid", start: "top 80%", once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <PageMeta route="characters" />
      <PageHero
        title="The people of Leonida"
        lede="Two leads with nothing to lose, and the hustlers, hosts and hangers-on they meet along the way."
        image={art.duo}
        alt="Lucia and Jason with guns drawn"
      />

      {leads.map((c, i) => (
        <section key={c.id} className={`lead section ${i % 2 ? "lead--flip" : ""}`} style={{ "--tint": c.tint }} aria-labelledby={`lead-${c.id}`}>
          <div className="lead__glow" aria-hidden="true" />
          <div className="wrap lead__grid">
            <div className="lead__frame">
              <Picture image={c.image} alt={c.name} sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
            <div className="lead__text">
              <h2 id={`lead-${c.id}`} className="lead__name">
                {c.name}
              </h2>
              <blockquote className="lead__quote">
                <p>{c.quote}</p>
                <footer>Rockstar Games</footer>
              </blockquote>
              <p className="lead__bio">{c.bio}</p>
            </div>
          </div>
        </section>
      ))}

      <section className="cast section" aria-labelledby="cast-title">
        <div className="wrap">
          <h2 id="cast-title" className="cast__title">
            Who else is in town
          </h2>
          <p className="cast__note">Names, roles and quotes from Rockstar's character pages. Screenshots: Rockstar Games.</p>
          <ul className="cast__grid">
            {cast.map((p) => (
              <li key={p.id}>
                <TiltCard className="cast__card" data-cursor="view">
                  <div className="cast__img">
                    <Picture image={p.image} alt={p.name} sizes="(max-width: 600px) 90vw, 30vw" />
                  </div>
                  <div className="cast__body">
                    <h3 className="cast__name">{p.name}</h3>
                    <p className="cast__role">{p.role}</p>
                    {p.quote && <p className="cast__quote">&ldquo;{p.quote}&rdquo;</p>}
                    <p className="cast__bio">{p.bio}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
          <div className="cast__more">
            <Button to="/leonida" variant="ghost" icon="arrowRight" magnetic={false}>
              See where they live
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
