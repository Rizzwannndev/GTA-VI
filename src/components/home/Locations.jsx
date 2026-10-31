import { useRef } from "react";
import { Link } from "react-router";
import { gsap, useGSAP, MQ } from "../../animations/gsap";
import { revealText } from "../../animations/motion";
import { locations } from "../../data/locations";
import Picture from "../ui/Picture";

// The six regions as full-height photo panels. Desktop: the section pins
// and the reel scrolls sideways with the page. Phones and reduced motion: a
// native swipeable row with scroll snapping.
export default function Locations() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      revealText(".locations__title", { type: "chars", stagger: 0.02 });
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const track = trackRef.current;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".locations__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(".postcard__art img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img.closest(".postcard"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        gsap.utils.toArray(".postcard__name").forEach((name) => {
          gsap.from(name, {
            yPercent: 40,
            autoAlpha: 0,
            ease: "vice",
            duration: 1,
            scrollTrigger: { trigger: name.closest(".postcard"), containerAnimation: tween, start: "left 75%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="locations" aria-labelledby="locations-title">
      <div className="locations__pin">
        <div className="wrap locations__head">
          <h2 id="locations-title" className="locations__title">
            Six regions, one state
          </h2>
          <p className="locations__hint">Region names are Rockstar's. Photos are real Florida places that match each one.</p>
        </div>
        <div className="locations__viewport" data-cursor="drag">
          <ol ref={trackRef} className="locations__track">
            {locations.map((loc) => (
              <li key={loc.id} className="postcard">
                <Link to={`/leonida#${loc.id}`} className="postcard__link" data-cursor="view">
                  <div className="postcard__art">
                    <Picture image={loc.photo} alt="" sizes="(max-width: 900px) 85vw, 42vw" />
                  </div>
                  <div className="postcard__body">
                    <h3 className="postcard__name">{loc.name}</h3>
                    <p className="postcard__kicker">{loc.kicker}</p>
                  </div>
                </Link>
                <p className="postcard__credit">Photo: {loc.photo.credit}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
