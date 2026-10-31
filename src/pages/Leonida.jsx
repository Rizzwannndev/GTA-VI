import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { revealText } from "../animations/motion";
import { scrollToTarget } from "../animations/smooth";
import { usePageRevealed } from "../animations/stage";
import { locations } from "../data/locations";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import LeonidaMap from "../components/leonida/LeonidaMap";
import Icon from "../components/ui/Icon";
import Picture from "../components/ui/Picture";
import { photos } from "../assets/photos/photos";

export default function Leonida() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const { hash } = useLocation();
  const revealed = usePageRevealed();
  const fromHash = locations.find((l) => `#${l.id}` === hash)?.id;
  const [activeId, setActiveId] = useState(fromHash ?? locations[0].id);
  const [hoverId, setHoverId] = useState(null);
  const active = locations.find((l) => l.id === activeId);

  // Arriving from a postcard (/leonida#grassrivers): jump to the map.
  useEffect(() => {
    if (fromHash && revealed) {
      const t = setTimeout(() => scrollToTarget("#map", { offset: -40 }), 300);
      return () => clearTimeout(t);
    }
  }, [fromHash, revealed]);

  useGSAP(
    () => {
      revealText(".atlas__title", { type: "chars", stagger: 0.02 });
      revealText(".atlas__intro", { delay: 0.1 });
    },
    { scope: rootRef },
  );

  // Panel content swap: a short wipe each time the selection changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .fromTo(".detail__art", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "wipe" })
        .fromTo(".detail__art img", { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "vice" }, 0)
        .fromTo(".detail__body > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7 }, 0.15);
    },
    { dependencies: [activeId], scope: panelRef },
  );

  const select = (id) => {
    setActiveId(id);
    if (window.matchMedia("(max-width: 899.98px)").matches) scrollToTarget("#region-detail", { offset: -80 });
  };

  return (
    <div ref={rootRef}>
      <PageMeta route="leonida" />
      <PageHero
        title="Leonida"
        lede="Six regions, from the neon of Vice City to the pines of Mount Kalaga. Pick one on the map."
        image={photos["vice-beach"]}
      />
      <section id="map" className="atlas section" aria-labelledby="atlas-title">
        <div className="wrap">
          <h2 id="atlas-title" className="atlas__title">
            The state, region by region
          </h2>
          <p className="atlas__intro">A fan-drawn map, not to scale. Region names are Rockstar's; the notes are ours.</p>
          <div className="atlas__grid">
            <div className="atlas__map">
              <LeonidaMap activeId={activeId} hoverId={hoverId} onHover={setHoverId} onSelect={select} />
              <ul className="atlas__chips" aria-label="Regions">
                {locations.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      className={`chip ${l.id === activeId ? "is-active" : ""}`}
                      style={{ "--tone": l.tone }}
                      aria-pressed={l.id === activeId}
                      onClick={() => select(l.id)}
                    >
                      {l.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <aside id="region-detail" ref={panelRef} className="detail" style={{ "--tone": active.tone }} aria-live="polite">
              <div className="detail__art">
                <Picture image={active.photo} alt="" sizes="(max-width: 900px) 100vw, 40vw" loading="eager" />
              </div>
              <p className="detail__credit">
                Stand-in photo:{" "}
                <a href={active.photo.href} target="_blank" rel="noreferrer">
                  {active.photo.credit} on Unsplash<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <div className="detail__body" key={active.id}>
                <p className="detail__kicker">{active.kicker}</p>
                <h3 className="detail__name">{active.name}</h3>
                <p className="detail__note">{active.note}</p>
                <ul className="detail__known">
                  {active.known.map((k) => (
                    <li key={k}>
                      <Icon name="pin" size="1.1em" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
