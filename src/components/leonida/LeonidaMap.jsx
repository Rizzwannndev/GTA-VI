import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { locations } from "../../data/locations";
import { COAST, MAP_VIEWBOX, regionShapes } from "./mapShapes";

// Interactive SVG map. Each region is a focusable button: hover or focus
// previews it, click / tap / Enter selects it. The coastline and borders
// draw themselves in when the map scrolls into view.
export default function LeonidaMap({ activeId, hoverId, onHover, onSelect }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.from(".map__coast", { drawSVG: 0, duration: 2.2, ease: "power2.inOut" })
        .from(".map__region-shape", { drawSVG: 0, duration: 1.4, stagger: 0.12, ease: "power2.inOut" }, 0.4)
        .from(".map__region-shape", { fillOpacity: 0, duration: 1, stagger: 0.1 }, 1.2)
        .from(".map__label", { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.6 }, 1.6);
    },
    { scope: ref },
  );

  const focusId = hoverId ?? activeId;

  return (
    <svg ref={ref} className="map" viewBox={MAP_VIEWBOX} role="group" aria-label="Map of Leonida. Choose a region to read about it.">
      <path className="map__coast" d={COAST} aria-hidden="true" />
      {locations.map((loc) => {
        const shape = regionShapes[loc.id];
        const state = loc.id === activeId ? "is-active" : focusId && focusId !== loc.id ? "is-dim" : "";
        return (
          <g
            key={loc.id}
            className={`map__region ${shape.hit ? "map__region--offshore" : ""} ${state}`}
            style={{ "--tone": loc.tone }}
            role="button"
            tabIndex={0}
            aria-pressed={loc.id === activeId}
            aria-label={loc.name}
            data-cursor="view"
            onPointerEnter={() => onHover(loc.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(loc.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(loc.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(loc.id);
              }
            }}
          >
            {shape.hit && <path className="map__hit" d={shape.hit} />}
            <path className="map__region-shape" d={shape.d} />
            {shape.city && <circle className="map__city" cx={shape.city[0]} cy={shape.city[1]} r="6" />}
            <text className="map__label" x={shape.label[0]} y={shape.label[1]} textAnchor="middle">
              {shape.stack
                ? loc.short.split(" ").map((word, i) => (
                    <tspan key={word} x={shape.label[0]} dy={i ? "1.1em" : 0}>
                      {word}
                    </tspan>
                  ))
                : loc.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
