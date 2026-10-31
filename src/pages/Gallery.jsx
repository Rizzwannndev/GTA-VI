import { useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP, Flip, prefersReducedMotion } from "../animations/gsap";
import { revealText } from "../animations/motion";
import { lockScroll, unlockScroll } from "../animations/smooth";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { art } from "../assets/images/art";
import { gallery } from "../data/gallery";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Icon from "../components/ui/Icon";
import Picture from "../components/ui/Picture";

const KIND_LABEL = { art: "Fan art", still: "Official still", photo: "Photo" };

export default function Gallery() {
  const rootRef = useRef(null);
  const boxRef = useRef(null);
  const closeRef = useRef(null);
  const flipState = useRef(null);
  const wasOpen = useRef(false);
  const [open, setOpen] = useState(-1);
  const [closing, setClosing] = useState(false);
  const item = gallery[open];

  useGSAP(
    () => {
      revealText(".shots__title", { type: "chars", stagger: 0.02 });
      revealText(".shots__intro", { delay: 0.1 });
      if (prefersReducedMotion()) return;
      gsap.utils.toArray(".shots__item").forEach((el) => {
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  const thumbFor = (i) => rootRef.current?.querySelector(`[data-shot="${gallery[i]?.id}"] img`);

  const show = (i) => {
    const thumb = thumbFor(i);
    flipState.current = thumb ? Flip.getState(thumb) : null;
    setClosing(false);
    setOpen(i);
  };

  // Thumbnail -> fullscreen: the big image starts at the thumbnail's box.
  useLayoutEffect(() => {
    if (open < 0 || !boxRef.current) return;
    const img = boxRef.current.querySelector(".lightbox__img");
    const tl = gsap.timeline();
    if (wasOpen.current) {
      // Arrow navigation: swap the frame without replaying the entrance.
      tl.fromTo(img, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.45 });
      return () => tl.kill();
    }
    wasOpen.current = true;
    tl.fromTo(".lightbox__backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
    if (flipState.current && img && !prefersReducedMotion()) {
      tl.add(Flip.from(flipState.current, { targets: img, duration: 0.8, ease: "vice", scale: true }), 0);
    } else if (img) {
      tl.fromTo(img, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
    }
    tl.fromTo(".lightbox__ui", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.35);
    flipState.current = null;
    return () => tl.kill();
  }, [open]);

  const isOpen = open >= 0;
  useLayoutEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => {
      unlockScroll();
      wasOpen.current = false;
    };
  }, [isOpen]);

  const close = () => {
    if (closing || open < 0) return;
    setClosing(true);
    const img = boxRef.current?.querySelector(".lightbox__img");
    const thumb = thumbFor(open);
    const done = () => {
      setOpen(-1);
      setClosing(false);
    };
    if (!img || !thumb || prefersReducedMotion()) {
      gsap.to(".lightbox", { autoAlpha: 0, duration: 0.25, onComplete: done });
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(".lightbox__ui", { autoAlpha: 0, duration: 0.2 })
      .add(Flip.fit(img, thumb, { duration: 0.7, ease: "vice", scale: true }), 0)
      .to(".lightbox__backdrop", { autoAlpha: 0, duration: 0.5 }, 0.15);
  };

  const step = (dir) => setOpen((i) => (i + dir + gallery.length) % gallery.length);

  useFocusTrap(boxRef, isOpen, { onEscape: close, initialFocus: closeRef });

  return (
    <div ref={rootRef}>
      <PageMeta route="gallery" />
      <PageHero
        title="Gallery"
        lede="Key art, stills from Rockstar's trailers and the site's own artwork. Open any frame to see it full size."
        image={art.bay}
      />
      <section className="shots section" aria-labelledby="shots-title">
        <div className="wrap">
          <h2 id="shots-title" className="shots__title">
            Frames from Leonida
          </h2>
          <p className="shots__intro">Official stills load straight from Rockstar's YouTube thumbnails and stay credited to Rockstar Games.</p>
          <ul className="shots__grid">
            {gallery.map((g, i) => (
              <li key={g.id} className="shots__item" data-shot={g.id}>
                <button type="button" className="shots__btn" onClick={() => show(i)} data-cursor="view" aria-label={`Open ${g.title}`}>
                  <Picture
                    image={g.image}
                    src={g.thumb}
                    alt=""
                    width={g.width}
                    height={g.height}
                    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    data-flip-id={g.id}
                    style={{ visibility: i === open ? "hidden" : undefined }}
                  />
                  <span className="shots__cap">
                    <span className="shots__name">{g.title}</span>
                    <span className={`shots__kind shots__kind--${g.kind}`}>{KIND_LABEL[g.kind]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {item && (
        <div
          ref={boxRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <div className="lightbox__backdrop" onClick={close} />
          <figure className="lightbox__figure">
            <img
              key={item.id}
              className="lightbox__img"
              data-flip-id={item.id}
              src={item.src}
              alt={item.title}
              width={item.width}
              height={item.height}
              decoding="async"
              onClick={close}
            />
            <figcaption className="lightbox__ui lightbox__cap">
              <span className="lightbox__title">{item.title}</span>
              <span className="lightbox__credit">
                {item.creditHref ? (
                  <a href={item.creditHref} target="_blank" rel="noreferrer">
                    {item.credit}, watch on YouTube
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  item.credit
                )}
              </span>
              <span className="lightbox__count tabular">
                {open + 1} / {gallery.length}
              </span>
            </figcaption>
          </figure>
          <div className="lightbox__ui lightbox__nav">
            <button type="button" className="round-btn" onClick={() => step(-1)} aria-label="Previous image">
              <Icon name="arrowLeft" size="1.3rem" />
            </button>
            <button type="button" className="round-btn" onClick={() => step(1)} aria-label="Next image">
              <Icon name="arrowRight" size="1.3rem" />
            </button>
          </div>
          <button ref={closeRef} type="button" className="round-btn lightbox__ui lightbox__close" onClick={close} aria-label="Close image">
            <Icon name="close" size="1.4rem" />
          </button>
        </div>
      )}
    </div>
  );
}
