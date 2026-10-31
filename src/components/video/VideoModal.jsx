import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { gsap, useGSAP, prefersReducedMotion } from "../../animations/gsap";
import { lockScroll, unlockScroll } from "../../animations/smooth";
import { mediaBus } from "../../animations/mediaBus";
import { useVideo } from "../../context/VideoContext";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { embedUrl, formatDate, youtubeUrl } from "../../data/trailers";
import Icon from "../ui/Icon";

// Full-screen trailer player. Opens by growing out of the thumbnail that was
// clicked; the YouTube iframe only exists while the modal is open, so closing
// it (button, Escape, backdrop click or a route change) always stops playback.
export default function VideoModal() {
  const { active, closeVideo } = useVideo();
  const [current, setCurrent] = useState(null);
  const [prevActive, setPrevActive] = useState(active);
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const location = useLocation();
  const pathRef = useRef(location.pathname);

  // Keep the last opened video mounted while the close animation runs.
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setCurrent(active);
  }

  const open = Boolean(active && current);

  useEffect(() => {
    if (pathRef.current !== location.pathname) {
      pathRef.current = location.pathname;
      closeVideo();
    }
  }, [location.pathname, closeVideo]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    mediaBus.videoStarted();
    return () => {
      unlockScroll();
      mediaBus.videoStopped();
    };
  }, [open]);

  useFocusTrap(rootRef, open, { onEscape: closeVideo, initialFocus: closeRef });

  useGSAP(
    () => {
      if (!current) return;
      const reduce = prefersReducedMotion();
      const panel = rootRef.current;
      if (active) {
        const r = current.originRect;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const from = r
          ? `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 6px)`
          : "inset(50% 0% 50% 0% round 0px)";
        const tl = gsap.timeline();
        if (reduce) {
          tl.from(panel, { autoAlpha: 0, duration: 0.3 });
          return;
        }
        tl.fromTo(panel, { clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 0.95, ease: "wipe" })
          .from(".video-modal__player", { scale: 0.92, autoAlpha: 0, duration: 0.8, ease: "vice" }, 0.4)
          .from(".video-modal__meta > *", { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.7 }, 0.55)
          .from(".video-modal__close", { scale: 0, rotate: -90, duration: 0.6, ease: "back.out(2)" }, 0.6);
      } else {
        const done = () => setCurrent(null);
        if (reduce) {
          gsap.to(panel, { autoAlpha: 0, duration: 0.25, onComplete: done });
          return;
        }
        gsap
          .timeline({ onComplete: done })
          .to(".video-modal__player, .video-modal__meta", { autoAlpha: 0, y: 20, duration: 0.3, ease: "power2.in" })
          .to(panel, { clipPath: "inset(50% 0% 50% 0% round 0px)", duration: 0.6, ease: "wipe" }, 0.1);
      }
    },
    { dependencies: [current, active], scope: rootRef },
  );

  if (!current) return null;
  const { trailer } = current;

  return (
    <div
      ref={rootRef}
      className="video-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${trailer.title}, official Grand Theft Auto VI video`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeVideo();
      }}
      data-cursor="close"
    >
      <button ref={closeRef} type="button" className="video-modal__close" onClick={closeVideo} aria-label="Close video">
        <Icon name="close" size="1.6rem" />
      </button>

      <div className="video-modal__inner" onClick={(e) => e.target === e.currentTarget && closeVideo()}>
        <div className="video-modal__player" data-cursor="none">
          {active && (
            <iframe
              src={embedUrl(trailer)}
              title={`Grand Theft Auto VI ${trailer.title}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
        <div className="video-modal__meta">
          <h2 className="video-modal__title">{trailer.title}</h2>
          <p className="video-modal__credit">
            <span className="tabular">{formatDate(trailer.released)}</span>
            <span aria-hidden="true" className="video-modal__rule" />
            <span>
              Video by{" "}
              <a href={youtubeUrl(trailer)} target="_blank" rel="noreferrer">
                Rockstar Games on YouTube
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
