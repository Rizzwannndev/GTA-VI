import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { scrambleText } from "../../animations/motion";
import { daysUntilRelease } from "../../data/site";
import { trailers } from "../../data/trailers";
import { locations } from "../../data/locations";
import { leads } from "../../data/characters";

// A strip of counters. Every number is derived from the data files (or the
// calendar), so it stays true as trailers and regions are added.
export default function Stats() {
  const rootRef = useRef(null);
  const days = daysUntilRelease();
  const stats = [
    { value: days, label: days === 1 ? "day until launch" : "days until launch" },
    { value: trailers.length, label: "official videos from Rockstar" },
    { value: locations.length, label: "regions of Leonida named so far" },
    { value: leads.length, label: "playable leads, Jason and Lucia" },
  ];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray(".stats__num").forEach((el) => {
        const end = Number(el.dataset.value);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: end,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.v);
          },
        });
      });
      gsap.from(".stats__item", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
      });
      scrambleText(".stats__label", { trigger: rootRef.current, start: "top 85%", delay: 0.3 });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="stats" aria-label="Grand Theft Auto VI by the numbers">
      <ul className="wrap stats__list">
        {stats.map((s) => (
          <li key={s.label} className="stats__item">
            <span className="stats__num tabular" data-value={s.value}>
              {s.value}
            </span>
            <span className="stats__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
