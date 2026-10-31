import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { revealText } from "../animations/motion";
import { RATING_LABELS, vehicles } from "../data/vehicles";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Icon from "../components/ui/Icon";
import Picture from "../components/ui/Picture";
import { photos } from "../assets/photos/photos";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Drag (mouse or touch), wheel-free carousel. Position eases toward a target
// on the GSAP ticker; the gap between the two is the velocity, which skews
// the cards so a hard throw visibly leans.
function useDragCarousel(viewportRef, trackRef, onIndex) {
  const api = useRef({ target: 0, current: 0, min: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const s = api.current;
    const reduce = prefersReducedMotion();
    const cards = () => [...track.children];
    const setSkew = gsap.quickSetter(track, "skewX", "deg");
    const setX = gsap.quickSetter(track, "x", "px");

    const measure = () => {
      s.min = Math.min(0, viewport.clientWidth - track.scrollWidth);
      s.target = clamp(s.target, s.min, 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);

    let lastIndex = -1;
    const tick = () => {
      s.current += (s.target - s.current) * (reduce ? 1 : 0.12);
      if (Math.abs(s.target - s.current) < 0.05) s.current = s.target;
      setX(s.current);
      setSkew(reduce ? 0 : clamp((s.target - s.current) * -0.04, -12, 12));
      const step = cards()[1] ? cards()[1].offsetLeft - cards()[0].offsetLeft : 1;
      const i = clamp(Math.round(-s.current / step), 0, cards().length - 1);
      if (i !== lastIndex) {
        lastIndex = i;
        onIndex(i);
      }
    };
    gsap.ticker.add(tick);

    let drag = null;
    const down = (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      drag = { x: e.clientX, y: e.clientY, start: s.target, moved: false, id: e.pointerId };
      viewport.classList.add("is-grabbing");
    };
    const move = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) {
        drag.moved = true;
        viewport.setPointerCapture(e.pointerId);
      }
      if (!drag.moved) return;
      const raw = drag.start + dx * 1.4;
      // Rubber band past the ends.
      s.target = raw > 0 ? raw * 0.25 : raw < s.min ? s.min + (raw - s.min) * 0.25 : raw;
    };
    const up = () => {
      if (!drag) return;
      if (drag.moved) {
        // Swallow the click that follows a drag so cards don't activate.
        viewport.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
      }
      drag = null;
      viewport.classList.remove("is-grabbing");
      s.target = clamp(s.target, s.min, 0);
    };
    viewport.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      viewport.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [viewportRef, trackRef, onIndex]);

  const goTo = (i) => {
    const track = trackRef.current;
    const card = track?.children[i];
    if (!card) return;
    const s = api.current;
    s.target = clamp(-card.offsetLeft, s.min, 0);
  };
  return goTo;
}

export default function Vehicles() {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const goTo = useDragCarousel(viewportRef, trackRef, setIndex);

  useGSAP(
    () => {
      revealText(".garage__title", { type: "chars", stagger: 0.02 });
      revealText(".garage__intro", { delay: 0.1 });
      if (prefersReducedMotion()) return;
      gsap.from(".garage__card", {
        x: 160,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.2,
        scrollTrigger: { trigger: ".garage__viewport", start: "top 85%", once: true },
      });
      gsap.from(".garage__bar", {
        scaleX: 0,
        transformOrigin: "0 50%",
        stagger: 0.03,
        duration: 1,
        scrollTrigger: { trigger: ".garage__viewport", start: "top 70%", once: true },
      });
    },
    { scope: rootRef },
  );

  const step = (dir) => goTo(clamp(index + dir, 0, vehicles.length - 1));

  return (
    <div ref={rootRef}>
      <PageMeta route="vehicles" />
      <PageHero
        title="Garage"
        lede="What people drive, sail and fly in Leonida, as seen in the trailers. Drag the row to browse."
        image={photos["sports-coupe"]}
      />
      <section className="garage section" aria-labelledby="garage-title">
        <div className="wrap garage__head">
          <div>
            <h2 id="garage-title" className="garage__title">
              Pick a ride
            </h2>
            <p className="garage__intro">Vehicle types from the trailers, not confirmed models. Ratings are our guesses out of ten.</p>
          </div>
          <div className="garage__controls">
            <p className="garage__count tabular" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(vehicles.length).padStart(2, "0")}
            </p>
            <button type="button" className="round-btn" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous vehicle">
              <Icon name="arrowLeft" size="1.3rem" />
            </button>
            <button
              type="button"
              className="round-btn"
              onClick={() => step(1)}
              disabled={index === vehicles.length - 1}
              aria-label="Next vehicle"
            >
              <Icon name="arrowRight" size="1.3rem" />
            </button>
          </div>
        </div>
        <div
          ref={viewportRef}
          className="garage__viewport"
          data-cursor="drag"
          role="region"
          aria-roledescription="carousel"
          aria-label="Vehicles"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <ul ref={trackRef} className="garage__track">
            {vehicles.map((v, i) => (
              <li
                key={v.id}
                className={`garage__card ${i === index ? "is-current" : ""}`}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${vehicles.length}: ${v.name}`}
              >
                <div className="garage__art">
                  <Picture image={v.photo} alt="" sizes="(max-width: 600px) 80vw, 34vw" draggable="false" />
                  <span className="garage__type">{v.type}</span>
                </div>
                <h3 className="garage__name">{v.name}</h3>
                <p className="garage__credit">Photo: {v.photo.credit}</p>
                <p className="garage__note">{v.note}</p>
                <dl className="garage__stats">
                  {Object.entries(v.ratings).map(([k, val]) => (
                    <div key={k} className="garage__stat">
                      <dt>{RATING_LABELS[k]}</dt>
                      <dd>
                        <span className="garage__meter" aria-hidden="true">
                          <span className="garage__bar" style={{ width: `${val * 10}%` }} />
                        </span>
                        <span className="tabular">{val}</span>
                        <span className="sr-only"> out of 10</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
