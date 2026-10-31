import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { revealText } from "../animations/motion";
import { PRICES_NOTE, editions } from "../data/editions";
import { OFFICIAL_URL, PLATFORMS, RELEASE_LABEL } from "../data/site";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { photos } from "../assets/photos/photos";

// The glow follows the pointer: we only write two custom properties, the
// gradient itself is CSS.
const trackGlow = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function Editions() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".tiers__title", { type: "chars", stagger: 0.02 });
      revealText(".tiers__intro", { delay: 0.1 });
      if (prefersReducedMotion()) return;
      gsap.from(".tier", {
        y: 100,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.2,
        scrollTrigger: { trigger: ".tiers__grid", start: "top 85%", once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <PageMeta route="editions" />
      <PageHero
        title="Editions"
        lede={`Out ${RELEASE_LABEL} on ${PLATFORMS.join(" and ")}. Here's how the editions compare.`}
        image={photos["sports-coupe"]}
      />
      <section className="tiers section" aria-labelledby="tiers-title">
        <div className="wrap">
          <h2 id="tiers-title" className="tiers__title">
            Choose your edition
          </h2>
          <p className="tiers__intro">{PRICES_NOTE}</p>
          <ul className="tiers__grid">
            {editions.map((e) => (
              <li key={e.id} className={`tier ${e.featured ? "tier--featured" : ""}`} style={{ "--tone": e.tone }} onPointerMove={trackGlow}>
                <span className="tier__glow" aria-hidden="true" />
                {e.featured && <p className="tier__flag">Most extras</p>}
                <h3 className="tier__name">{e.name}</h3>
                <p className="tier__price tabular">{e.price}</p>
                <p className="tier__for">{e.bestFor}</p>
                <ul className="tier__list">
                  {e.includes.map((inc) => (
                    <li key={inc}>
                      <Icon name={inc.includes("not included") ? "warning" : "check"} size="1.15em" />
                      {inc}
                    </li>
                  ))}
                </ul>
                <Button href={OFFICIAL_URL} variant={e.featured ? "glow" : "ghost"} icon="arrowUpRight" magnetic={Boolean(e.featured)}>
                  Pre-order at Rockstar
                </Button>
              </li>
            ))}
          </ul>
          <p className="tiers__fine">
            This fan site doesn't sell anything. Every button here goes to Rockstar's official Grand Theft Auto VI page.
          </p>
        </div>
      </section>
    </div>
  );
}
