import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { lockScroll, unlockScroll } from "../../animations/smooth";
import { navRoutes } from "../../data/routes";
import { OFFICIAL_URL, SITE_TAGLINE, socials } from "../../data/site";
import { useMusic } from "../../audio/music";
import Icon from "../ui/Icon";

// Full-screen menu, after sidewave.it: two sunset panels and a black one
// wipe down in turn, then the links rise out of their masks. Hovering a link
// dims the others, flips it to an outline and fades in that page's picture.
// Focus trapping and Esc live in the Header, which holds both this overlay
// and the toggle button that sits above it.
export default function Menu({ open, onClose }) {
  const rootRef = useRef(null);
  const { pathname } = useLocation();
  const { track, playing } = useMusic();
  const [visible, setVisible] = useState(open);
  const [hover, setHover] = useState(null);
  const [prevOpen, setPrevOpen] = useState(open);

  // Mount as soon as it opens; unmount only after the close animation.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setVisible(true);
  }

  useEffect(() => {
    if (!visible) return;
    lockScroll();
    return () => unlockScroll();
  }, [visible]);

  useGSAP(
    () => {
      if (!visible) return;
      const reduce = prefersReducedMotion();
      if (open) {
        if (reduce) {
          gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
          return;
        }
        gsap
          .timeline()
          .set(rootRef.current, { autoAlpha: 1 })
          .fromTo(".menu__panel", { yPercent: -101 }, { yPercent: 0, duration: 0.85, stagger: 0.09, ease: "wipe" })
          .fromTo(".menu__link-text", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.045, ease: "vice" }, 0.5)
          .fromTo(".menu__info > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06 }, 0.75);
      } else {
        const done = () => {
          setVisible(false);
          setHover(null);
        };
        if (reduce) {
          gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.25, onComplete: done });
          return;
        }
        gsap
          .timeline({ onComplete: done })
          .to(".menu__link-text", { yPercent: -110, duration: 0.45, stagger: 0.02, ease: "power3.in" })
          .to(".menu__info > *, .menu__preview", { autoAlpha: 0, duration: 0.3 }, 0)
          .to([...rootRef.current.querySelectorAll(".menu__panel")].reverse(), { yPercent: 101, duration: 0.7, stagger: 0.07, ease: "wipe" }, 0.25);
      }
    },
    { dependencies: [open, visible], scope: rootRef },
  );

  if (!visible) return null;

  return (
    <div ref={rootRef} id="site-menu" className="menu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="menu__panel menu__panel--a" aria-hidden="true" />
      <div className="menu__panel menu__panel--b" aria-hidden="true" />
      <div className="menu__panel menu__panel--c" aria-hidden="true" />

      <div className="menu__preview" aria-hidden="true">
        {navRoutes.map((r) => (
          <img
            key={r.key}
            src={r.preview}
            alt=""
            className={`menu__preview-img ${hover === r.key ? "is-shown" : ""}`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <div className="menu__inner">
        <nav aria-label="Main">
          <ol className={`menu__list ${hover ? "is-hovering" : ""}`} onPointerLeave={() => setHover(null)}>
            {navRoutes.map((r) => {
              const current = r.path === pathname;
              return (
                <li key={r.key} className={`menu__item ${hover === r.key ? "is-hovered" : ""}`}>
                  <Link
                    to={r.path}
                    className="menu__link"
                    aria-current={current ? "page" : undefined}
                    onPointerEnter={() => setHover(r.key)}
                    onFocus={() => setHover(r.key)}
                    onClick={onClose}
                    data-cursor="link"
                  >
                    <span className="menu__link-text" data-text={r.name}>
                      {r.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="menu__info">
          <p className="menu__tagline">{SITE_TAGLINE}</p>
          <p className="menu__now">
            <span className={`menu__now-dot ${playing ? "is-on" : ""}`} aria-hidden="true" />
            {playing ? `Now playing: ${track}` : `Music off: ${track}`}
          </p>
          <ul className="menu__socials" aria-label="Rockstar Games on social media">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.label} (opens in a new tab)`} data-cursor="link">
                  <Icon name={s.id} size="1.2rem" />
                </a>
              </li>
            ))}
            <li>
              <a href={OFFICIAL_URL} target="_blank" rel="noreferrer" className="menu__official" data-cursor="link">
                rockstargames.com/VI
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
