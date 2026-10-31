import { useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP, Flip, prefersReducedMotion } from "../animations/gsap";
import { revealText, scrambleText } from "../animations/motion";
import { NEWS_CATEGORIES, news } from "../data/news";
import { formatDate } from "../data/trailers";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import Icon from "../components/ui/Icon";

const FILTERS = ["All", ...NEWS_CATEGORIES];

export default function News() {
  const rootRef = useRef(null);
  const flipState = useRef(null);
  const [filter, setFilter] = useState("All");

  useGSAP(
    () => {
      revealText(".wire__title", { type: "chars", stagger: 0.02 });
      scrambleText(".wire__meta time", { trigger: ".wire__list", start: "top 85%", delay: 0.2 });
      if (prefersReducedMotion()) return;
      gsap.from(".wire__card", {
        y: 70,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1,
        scrollTrigger: { trigger: ".wire__list", start: "top 85%", once: true },
      });
    },
    { scope: rootRef },
  );

  const choose = (f) => {
    if (f === filter) return;
    flipState.current = Flip.getState(rootRef.current.querySelectorAll(".wire__card"));
    setFilter(f);
  };

  // Cards that stay glide to their new slots; the rest fade and shrink out.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    if (prefersReducedMotion()) return;
    const anim = Flip.from(state, {
      targets: rootRef.current.querySelectorAll(".wire__card"),
      duration: 0.7,
      ease: "vice",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.4 }),
    });
    return () => anim.kill();
  }, [filter]);

  const count = (f) => (f === "All" ? news.length : news.filter((n) => n.category === f).length);

  return (
    <div ref={rootRef}>
      <PageMeta route="news" />
      <PageHero
        title="News"
        lede="Every official milestone on the road to launch, each linked to Rockstar's own post or video."
        src={`https://i.ytimg.com/vi/${news[0].youtubeId}/maxresdefault.jpg`}
      />
      <section className="wire section" aria-labelledby="wire-title">
        <div className="wrap">
          <h2 id="wire-title" className="wire__title">
            From the newswire
          </h2>
          <div className="wire__filters" role="group" aria-label="Filter news by topic">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`chip ${f === filter ? "is-active" : ""}`}
                aria-pressed={f === filter}
                onClick={() => choose(f)}
              >
                {f} <span className="chip__count tabular">{count(f)}</span>
              </button>
            ))}
          </div>
          <ul className="wire__list" aria-live="polite">
            {news.map((n) => {
              const hidden = filter !== "All" && n.category !== filter;
              return (
                <li key={n.id} className="wire__card" data-flip-id={n.id} hidden={hidden}>
                  <a className="wire__link" href={n.source.href} target="_blank" rel="noreferrer">
                    <span className="wire__thumb">
                      <img src={`https://i.ytimg.com/vi/${n.youtubeId}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy" decoding="async" />
                    </span>
                    <span className="wire__body">
                      <span className="wire__meta">
                        <span className="wire__cat">{n.category}</span>
                        <time className="tabular" dateTime={n.date}>
                          {formatDate(n.date)}
                        </time>
                      </span>
                      <span className="wire__headline">{n.title}</span>
                      <span className="wire__summary">{n.summary}</span>
                      <span className="wire__source">
                        {n.source.label}
                        <Icon name="arrowUpRight" size="1.1em" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="wire__note">Thumbnails are Rockstar Games' own YouTube artwork, loaded from YouTube.</p>
        </div>
      </section>
    </div>
  );
}
