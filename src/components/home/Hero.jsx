import { useRef } from "react";
import { gsap, useGSAP, MQ, prefersReducedMotion, isFinePointer } from "../../animations/gsap";
import { scrollToTarget } from "../../animations/smooth";
import { scrambleText } from "../../animations/motion";
import { art } from "../../assets/images/art";
import Picture from "../ui/Picture";
import Icon from "../ui/Icon";
import PlatformMarks from "../ui/PlatformMarks";
import Button from "../ui/Button";
import { useVideo } from "../../context/VideoContext";
import { featuredTrailer } from "../../data/trailers";
import { OFFICIAL_URL, RELEASE_LABEL } from "../../data/site";

// The landing scene. On reveal it plays the original "settle" (every layer
// starts zoomed and rotated and eases into place). On scroll it pins, and the
// layers pull apart by depth while dusk falls over the bay.
export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const { openVideo } = useVideo();

  // Scroll choreography, set up once on mount so pin spacing exists before
  // the sections below measure themselves.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions;
        if (!motion) return;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: desktop ? "+=140%" : "+=110%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(".hero__layer--bg", { scale: 1.16, yPercent: -5 }, 0)
          .to(".hero__layer--logo", { yPercent: -45, scale: 0.8, autoAlpha: 0 }, 0)
          .to(".hero__layer--chars", { scale: desktop ? 1.22 : 1.12, yPercent: 14 }, 0)
          .to(".hero__bar", { autoAlpha: 0, y: 40, duration: 0.25 }, 0)
          .to(".hero__dusk", { opacity: 1, duration: 0.6 }, 0.25)
          .fromTo(".hero__premise", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // The original settle, kept value for value.
  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) {
        gsap.from(".hero__stage", { autoAlpha: 0, duration: 0.6 });
        gsap.set(".hero__chars", { scale: 0.82 });
        return;
      }
      gsap.fromTo(".hero__stage", { scale: 1.7, rotate: -10 }, { scale: 1, rotate: 0, duration: 2, delay: -1, ease: "expo.inOut" });
      gsap.fromTo(".hero__bg", { scale: 1.7, rotate: -3 }, { scale: 1.1, rotate: 0, duration: 2, delay: -0.8, ease: "expo.inOut" });
      gsap.fromTo(
        ".hero__chars",
        { scale: 1.9, rotate: -10, opacity: 0 },
        { scale: 0.82, rotate: 0, opacity: 1, duration: 2, delay: -1, ease: "expo.inOut" },
      );
      gsap.fromTo(".hero__logo", { scale: 1.6, rotate: -10 }, { scale: 1, rotate: 0, duration: 2, delay: -0.95, ease: "expo.inOut" });
      gsap.fromTo(".hero__bar-item", { opacity: 0.1 }, { opacity: 1, duration: 2, delay: -0.5, ease: "expo.inOut" });
      gsap.from(".hero__info > *", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.2, delay: 0.5, ease: "vice" });
      scrambleText(".hero__date-text", { scroll: false, delay: 0.6, duration: 1.4 });
    },
    { dependencies: [ready], scope: rootRef },
  );

  // The original mouse parallax on the logo and bay, now cleaned up.
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion() || !isFinePointer()) return;
      const root = rootRef.current;
      const logoX = gsap.quickTo(".hero__logo", "x", { duration: 0.9, ease: "power3" });
      const bgX = gsap.quickTo(".hero__bg", "x", { duration: 0.9, ease: "power3" });
      const charsX = gsap.quickTo(".hero__chars", "x", { duration: 1.1, ease: "power3" });
      const onMove = (e) => {
        const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
        logoX(xMove * 0.2 * (window.innerWidth / 100));
        bgX(xMove * 1.7);
        charsX(xMove * -0.6);
      };
      root.addEventListener("mousemove", onMove);
      return () => root.removeEventListener("mousemove", onMove);
    },
    { dependencies: [ready], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="hero" aria-label="Grand Theft Auto VI">
      <div className="hero__stage">
        <div className="hero__layer hero__layer--bg">
          <Picture
            image={art.bay}
            alt="Vice City's skyline across the bay at golden hour, a police boat speeding past"
            className="hero__bg-pic"
            imgClassName="hero__bg"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="hero__layer hero__layer--logo">
          <div className="hero__logo-pos">
            <Picture image={art.logo} alt="Grand Theft Auto VI" imgClassName="hero__logo" loading="eager" sizes="(max-width: 900px) 70vw, 560px" />
          </div>
        </div>
        <div className="hero__layer hero__layer--chars">
          <Picture
            image={art.duo}
            alt="Lucia and Jason, guns drawn"
            imgClassName="hero__chars"
            loading="eager"
            sizes="(max-width: 900px) 200vw, 100vw"
          />
        </div>
        <div className="hero__dusk" aria-hidden="true" />

        <div className="hero__premise">
          <p className="hero__premise-text">
            Jason and Lucia have always known the deck is stacked against them. But when an easy score goes wrong, they
            find themselves on the darkest side of the sunniest place in America.
          </p>
          <p className="hero__premise-credit">From Rockstar Games' description of the story</p>
        </div>

        <div className="hero__bar">
          <div className="hero__info">
            <p className="hero__date">
              <span className="sr-only">Release date: </span>
              <span className="hero__date-text">{RELEASE_LABEL}</span>
            </p>
            <PlatformMarks className="hero__platforms" />
            <div className="hero__actions">
              <Button icon="play" onClick={(e) => openVideo(featuredTrailer, e.currentTarget)}>
                Watch the {featuredTrailer.title}
              </Button>
              <Button href={OFFICIAL_URL} variant="ghost" icon="arrowUpRight" magnetic={false}>
                Pre-order
              </Button>
            </div>
          </div>
          <div className="hero__aside">
            <button type="button" className="hero__bar-item hero__scroll" onClick={() => scrollToTarget("#welcome")} data-cursor="link">
              <Icon name="arrowDown" size="1.25rem" />
              <span>Scroll</span>
            </button>
            <Picture image={art.pegi} alt="PEGI 18" imgClassName="hero__bar-item hero__pegi" sizes="56px" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
