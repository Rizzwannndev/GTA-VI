import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { Link } from "react-router";
import { parallax, revealImage, revealText } from "../../animations/motion";
import { locations } from "../../data/locations";
import { photos } from "../../assets/photos/photos";
import Picture from "../ui/Picture";
import ViMark from "../svg/ViMark";
import Icon from "../ui/Icon";
import { RELEASE_LABEL } from "../../data/site";
import HorizonDivider from "../svg/HorizonDivider";
import { bayUrl } from "../../assets/images/art";

const lines = [
  { text: "Welcome to", kind: "outline", drift: -5 },
  { text: "Leonida", kind: "image", drift: 4 },
  { text: RELEASE_LABEL, kind: "outline", drift: -4 },
];

const BADGE = `${RELEASE_LABEL} · Vice City · Leonida · `;

// Kinetic type: three huge lines slide against each other with the scroll.
// The outlined lines fill in as they cross the viewport; the middle line is
// cut out of the bay artwork, the same trick as the VI intro. Below it, the
// introduction sits beside a two-photo collage that moves at two speeds, a
// spinning date badge, and the six regions as a ruled index that draws in.
export default function Welcome() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".welcome__copy", { start: "top 88%" });
      revealImage(".welcome__shot", { start: "top 85%" });
      parallax(".welcome__shot--a img", { speed: 8 });
      if (prefersReducedMotion()) return;
      // The small photo drifts faster than the big one, so they separate.
      gsap.fromTo(
        ".welcome__shot--b",
        { yPercent: 30 },
        { yPercent: -30, ease: "none", scrollTrigger: { trigger: ".welcome__collage", start: "top bottom", end: "bottom top", scrub: true } },
      );
      // The badge spins on its own and winds faster with the scroll.
      gsap.to(".welcome__badge-ring", {
        rotation: 360,
        ease: "none",
        scrollTrigger: { trigger: ".welcome__collage", start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
      gsap
        .timeline({ scrollTrigger: { trigger: ".welcome__regions", start: "top 85%", once: true } })
        .fromTo(".welcome__region-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.08, ease: "expo.inOut" })
        .fromTo(".welcome__region-link", { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: "vice" }, 0.2);
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
          <div key={l.text} className={`kinetic__line kinetic__line--${l.kind}`} data-drift={l.drift} style={{ "--len": l.text.length }}>
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
        <div className="welcome__grid">
          <div className="welcome__text">
            <p className="welcome__copy">
              Leonida is Rockstar's take on Florida: Vice City's neon and nightlife, the Keys, the wetlands, the port towns
              and the pines up north. Grand Theft Auto VI arrives on {RELEASE_LABEL}. This fan site collects what Rockstar
              has shown so far.
            </p>
            <ol className="welcome__regions" aria-label="The six regions of Leonida">
              {locations.map((loc) => (
                <li key={loc.id} className="welcome__region">
                  <span className="welcome__region-rule" aria-hidden="true" />
                  <Link to={`/leonida#${loc.id}`} className="welcome__region-link" data-cursor="link">
                    <span className="welcome__region-name">{loc.name}</span>
                    <span className="welcome__region-kicker">{loc.kicker}</span>
                    <Icon name="arrowUpRight" size="1.1rem" className="welcome__region-icon" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="welcome__collage">
            <figure className="welcome__shot welcome__shot--a">
              <Picture image={photos["vice-ocean-drive"]} alt="The Vice City sign lit at dusk as a plane flies low overhead" sizes="(max-width: 900px) 80vw, 34vw" />
            </figure>
            <figure className="welcome__shot welcome__shot--b">
              <Picture image={photos["keys-boats"]} alt="A boat party in the turquoise shallows of the Leonida Keys" sizes="(max-width: 900px) 50vw, 20vw" />
            </figure>
            <div className="welcome__badge" aria-hidden="true">
              <svg className="welcome__badge-ring" viewBox="0 0 200 200">
                <defs>
                  <path id="welcome-badge-path" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
                </defs>
                <text>
                  <textPath href="#welcome-badge-path" textLength="488" lengthAdjust="spacingAndGlyphs">
                    {BADGE}
                  </textPath>
                </text>
              </svg>
              <ViMark className="welcome__badge-mark" gradientId="vi-welcome-grad" />
            </div>
            <p className="welcome__credit">Screenshots: Rockstar Games</p>
          </div>
        </div>
      </div>
    </section>
  );
}
