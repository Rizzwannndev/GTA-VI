import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "../../animations/gsap";
import { lockScroll, unlockScroll } from "../../animations/smooth";
import { navRoutes } from "../../data/routes";
import { OFFICIAL_URL, SITE_TAGLINE, socials } from "../../data/site";
import { useMusic } from "../../audio/music";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import Icon from "../ui/Icon";

// Full-screen menu. Three wipe panels (sunset pink, orange, black) bring it
// in, then the page names rise as one oversized editorial paragraph that is
// indented and wraps across the screen like a magazine title page. Behind
// it, the shown page's screenshot fills the room as soft ambient light, and a
// sharp preview card trails the pointer, each new picture wiping up over the
// last. Hovering a name rolls its letters and turns the others to outlines.
// On touch screens it becomes a stacked list lit the same way.
// Focus trapping and Esc live in the Header, which holds the toggle too.
export default function Menu({ open, onClose }) {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const tlRef = useRef(null);
  const { pathname } = useLocation();
  const { track, playing } = useMusic();
  const follow = useMediaQuery(`${MQ.desktop} and ${MQ.fine} and ${MQ.motion}`);
  const [visible, setVisible] = useState(open);
  const [hover, setHover] = useState(null);
  const [prevOpen, setPrevOpen] = useState(open);

  // Mount as soon as it opens; unmount only after the close animation.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setVisible(true);
  }

  const currentKey = navRoutes.find((r) => r.path === pathname)?.key ?? null;
  const shownKey = hover ?? currentKey ?? navRoutes[0].key;

  // The ambient light keeps only two pictures mounted: the one fading in
  // and the one beneath it. Each change gets a fresh id so the new layer
  // always mounts on top and fades in over the last.
  const [ambient, setAmbient] = useState(() => [{ key: shownKey, id: 0 }]);
  const top = ambient[ambient.length - 1];
  if (top.key !== shownKey) setAmbient([top, { key: shownKey, id: top.id + 1 }]);
  const previewOf = (key) => navRoutes.find((r) => r.key === key)?.preview;

  useEffect(() => {
    if (!visible) return;
    lockScroll();
    return () => unlockScroll();
  }, [visible]);

  // Open and close choreography.
  useGSAP(
    () => {
      if (!visible) return;
      const reduce = prefersReducedMotion();
      // Whichever way it is going, the other direction's timeline stops, so
      // a quick open-then-close never leaves two timelines fighting.
      tlRef.current?.kill();
      if (open) {
        if (reduce) {
          tlRef.current = gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
          return;
        }
        tlRef.current = gsap
          .timeline()
          .set(rootRef.current, { autoAlpha: 1 })
          .set(".menu__inner", { autoAlpha: 1 })
          .fromTo(".menu__panel", { yPercent: -101 }, { yPercent: 0, duration: 0.85, stagger: 0.09, ease: "wipe" })
          .fromTo(".menu__ambient", { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" }, 0.55)
          // The names rise only once the black panel has covered the page,
          // from far enough below their masks that no edge shows early.
          .fromTo(".menu__word", { yPercent: 140 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: "vice" }, 0.72)
          .fromTo(".menu__meta", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.04 }, 1.1)
          .fromTo(".menu__rule", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 0.7)
          .fromTo(".menu__info > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06 }, 0.9);
      } else {
        const done = () => {
          setVisible(false);
          setHover(null);
        };
        if (reduce) {
          tlRef.current = gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.25, onComplete: done });
          return;
        }
        tlRef.current = gsap
          .timeline({ onComplete: done })
          // Each letter carries its roll copy as a text shadow just below it,
          // so the names leave downwards: sliding up would pull that copy
          // into the mask and leave the names on screen.
          .to(".menu__word", { yPercent: 140, duration: 0.36, stagger: 0.012, ease: "power3.in" })
          .to(".menu__meta, .menu__info > *, .menu__rule, .menu__card, .menu__ambient", { autoAlpha: 0, duration: 0.3 }, 0)
          // Nothing of the menu's content survives past this point, so the
          // page is never seen through the panels with names still on it.
          .set(".menu__inner", { autoAlpha: 0 }, 0.46)
          .to([...rootRef.current.querySelectorAll(".menu__panel")].reverse(), { yPercent: 101, duration: 0.7, stagger: 0.07, ease: "wipe" }, 0.4);
      }
    },
    { dependencies: [open, visible], scope: rootRef },
  );

  // The preview card trails the pointer and leans into its movement.
  useGSAP(
    () => {
      if (!visible || !follow) return;
      const card = cardRef.current;
      const root = rootRef.current;
      gsap.set(card, { xPercent: -50, yPercent: -50, x: window.innerWidth * 0.7, y: window.innerHeight * 0.45, autoAlpha: 0, scale: 0.6, rotation: 0 });
      const x = gsap.quickTo(card, "x", { duration: 0.8, ease: "power3" });
      const y = gsap.quickTo(card, "y", { duration: 0.8, ease: "power3" });
      const r = gsap.quickTo(card, "rotation", { duration: 0.9, ease: "power3" });
      const settle = gsap.delayedCall(0.12, () => r(0)).pause();
      let last = null;
      const onMove = (e) => {
        x(e.clientX);
        y(e.clientY);
        if (last != null) r(gsap.utils.clamp(-9, 9, (e.clientX - last) * 0.4));
        last = e.clientX;
        settle.restart(true);
      };
      root.addEventListener("pointermove", onMove);
      return () => {
        root.removeEventListener("pointermove", onMove);
        settle.kill();
      };
    },
    { dependencies: [visible, follow], scope: rootRef },
  );

  // Show or hide the card, and wipe the newly hovered picture up over the
  // previous one.
  useGSAP(
    () => {
      if (!visible || !follow || !cardRef.current) return;
      const card = cardRef.current;
      gsap.to(card, {
        autoAlpha: hover ? 1 : 0,
        scale: hover ? 1 : 0.6,
        duration: hover ? 0.7 : 0.4,
        ease: hover ? "expo.out" : "power3.in",
        overwrite: "auto",
      });
      if (!hover) return;
      const img = card.querySelector(`[data-key="${hover}"]`);
      if (!img) return;
      const z = (Number(card.dataset.z) || 1) + 1;
      card.dataset.z = String(z);
      gsap.set(img, { zIndex: z });
      gsap.fromTo(
        img,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.35 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: "expo.out", overwrite: "auto" },
      );
    },
    { dependencies: [hover, visible, follow], scope: rootRef },
  );

  if (!visible) return null;

  return (
    <div ref={rootRef} id="site-menu" className="menu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="menu__panel menu__panel--a" aria-hidden="true" />
      <div className="menu__panel menu__panel--b" aria-hidden="true" />
      <div className="menu__panel menu__panel--c" aria-hidden="true" />

      {/* Ambient light: the shown page's screenshot, blurred and dimmed. */}
      <div className="menu__ambient" aria-hidden="true">
        <div className="menu__ambient-wash">
          {ambient.map((a) => (
            <img key={a.id} src={previewOf(a.key)} alt="" className="menu__ambient-img" decoding="async" />
          ))}
        </div>
        <span className="menu__glow" />
      </div>

      {follow && (
        <div ref={cardRef} className="menu__card" aria-hidden="true">
          {navRoutes.map((r) => (
            <img key={r.key} data-key={r.key} src={r.preview} alt="" className="menu__card-img" decoding="async" />
          ))}
        </div>
      )}

      <div className="menu__inner">
        <nav aria-label="Main" className="menu__nav">
          <ol className={`menu__list ${hover ? "is-hovering" : ""}`} onPointerLeave={() => setHover(null)}>
            {navRoutes.map((r, i) => {
              const current = r.key === currentKey;
              return (
                <li key={r.key} className={`menu__item ${hover === r.key ? "is-hovered" : ""}`} style={{ "--i": i }}>
                  <Link
                    to={r.path}
                    className="menu__link"
                    aria-current={current ? "page" : undefined}
                    onPointerEnter={() => setHover(r.key)}
                    onFocus={() => setHover(r.key)}
                    onBlur={() => setHover(null)}
                    onClick={onClose}
                    data-cursor="link"
                  >
                    <span className="menu__mask">
                      <span className="menu__word">
                        <span className="sr-only">{r.name}</span>
                        {[...r.name].map((c, ci) => (
                          <span key={ci} className="menu__char" data-c={c} style={{ "--ci": ci }} aria-hidden="true">
                            {c}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="menu__meta">
                      {current && <span className="menu__here">You are here</span>}
                      <span className="menu__blurb">{r.blurb}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="menu__foot">
          <span className="menu__rule" aria-hidden="true" />
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
    </div>
  );
}
