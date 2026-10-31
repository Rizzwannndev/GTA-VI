import { useRef } from "react";
import { useLocation } from "react-router";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { usePageRevealed } from "../animations/stage";
import { art } from "../assets/images/art";
import PageMeta from "../components/layout/PageMeta";
import Picture from "../components/ui/Picture";
import Button from "../components/ui/Button";

// 404, styled after the game's death screen: the world drains to grey,
// slows, and the word drops in.
export default function NotFound() {
  const rootRef = useRef(null);
  const { pathname } = useLocation();
  const revealed = usePageRevealed();

  useGSAP(
    () => {
      if (!revealed) return;
      if (prefersReducedMotion()) {
        gsap.from(".wasted__word, .wasted__copy", { autoAlpha: 0, duration: 0.6 });
        return;
      }
      gsap
        .timeline()
        .fromTo(".wasted__bg", { scale: 1 }, { scale: 1.12, duration: 2.6, ease: "power2.out" })
        .fromTo(".wasted__color", { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.6, ease: "power1.inOut" }, 0)
        .fromTo(".wasted__band", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power3.out" }, 0.6)
        .fromTo(".wasted__word", { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.out" }, 0.75)
        .from(".wasted__copy > *", { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.8 }, 1.3);
    },
    { dependencies: [revealed], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="wasted" aria-labelledby="wasted-title">
      <PageMeta route="notFound" />
      <div className="wasted__bg" aria-hidden="true">
        <Picture image={art.bay} alt="" loading="eager" className="wasted__grey" imgClassName="wasted__img" />
        <Picture image={art.bay} alt="" loading="eager" className="wasted__color" imgClassName="wasted__img" />
      </div>
      <div className="wasted__band" aria-hidden="true" />
      <div className="wasted__center">
        <h1 id="wasted-title" className="wasted__word">
          Wasted
        </h1>
        <div className="wasted__copy">
          <p>
            There's nothing at <code>{pathname}</code>. The page may have moved, or the link was mistyped.
          </p>
          <div className="wasted__actions">
            <Button to="/" icon="arrowRight">
              Respawn at home
            </Button>
            <Button to="/leonida" variant="ghost" magnetic={false}>
              Open the map
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
