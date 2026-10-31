import { useRef } from "react";
import { Link } from "react-router";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { scrambleText } from "../../animations/motion";
import { daysUntilRelease } from "../../data/site";
import { trailers } from "../../data/trailers";
import { locations } from "../../data/locations";
import { leads } from "../../data/characters";
import { photos } from "../../assets/photos/photos";
import Picture from "../ui/Picture";
import Icon from "../ui/Icon";

// A strip of counters. Every number is derived from the data files (or the
// calendar), so it stays true as trailers and regions are added. Each one
// leads to its page: hovering lifts a screenshot up behind it, rolls the
// number again and slides in where it goes.
export default function Stats() {
  const rootRef = useRef(null);
  const days = daysUntilRelease();
  const stats = [
    { value: days, label: days === 1 ? "day until launch" : "days until launch", to: "/editions", go: "Pre-order", photo: photos["sports-coupe"] },
    { value: trailers.length, label: "official videos from Rockstar", to: "/trailers", go: "Watch them", photo: photos["duo-dusk"] },
    { value: locations.length, label: "regions of Leonida named so far", to: "/leonida", go: "See the map", photo: photos["vice-city"] },
    { value: leads.length, label: "playable leads, Jason and Lucia", to: "/characters", go: "Meet them", photo: photos["duo-skyline"] },
  ];

  const { contextSafe } = useGSAP(
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

  // Hover: the number counts up again from zero.
  const roll = contextSafe((e) => {
    if (prefersReducedMotion() || e.pointerType === "touch") return;
    const el = e.currentTarget.querySelector(".stats__num");
    const end = Number(el.dataset.value);
    const counter = { v: 0 };
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { yPercent: 18 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: "expo.out",
        onStart: () => {
          gsap.to(counter, {
            v: end,
            duration: 0.7,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.v);
            },
          });
        },
      },
    );
  });

  return (
    <section ref={rootRef} className="stats" aria-label="Grand Theft Auto VI by the numbers">
      <ul className="wrap stats__list">
        {stats.map((s) => (
          <li key={s.label} className="stats__item">
            <Link to={s.to} className="stats__link" onPointerEnter={roll} data-cursor="link">
              <span className="stats__bg" aria-hidden="true">
                <Picture image={s.photo} alt="" sizes="(max-width: 900px) 50vw, 25vw" />
              </span>
              <span className="stats__num tabular" data-value={s.value}>
                {s.value}
              </span>
              <span className="stats__label">{s.label}</span>
              <span className="stats__go">
                {s.go}
                <Icon name="arrowRight" size="1rem" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
