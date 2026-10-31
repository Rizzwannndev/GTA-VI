import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../animations/gsap";
import { revealText, scrambleText } from "../animations/motion";
import { featuredTrailer, formatDate, thumbnailUrl, trailers, youtubeUrl } from "../data/trailers";
import PageMeta from "../components/layout/PageMeta";
import PageHero from "../components/layout/PageHero";
import VideoFacade from "../components/video/VideoFacade";
import Button from "../components/ui/Button";

const rest = trailers.filter((t) => t.id !== featuredTrailer.id);

export default function Trailers() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      revealText(".reel__title", { type: "chars", stagger: 0.02 });
      revealText(".reel__desc", { delay: 0.1 });
      scrambleText(".reel__date");
      revealText(".archive__title", { type: "chars", stagger: 0.02 });
      if (prefersReducedMotion()) return;
      gsap.from(".reel__player", {
        y: 80,
        autoAlpha: 0,
        duration: 1.2,
        scrollTrigger: { trigger: ".reel", start: "top 80%", once: true },
      });
      gsap.utils.toArray(".archive__row").forEach((row) => {
        gsap.from(row.querySelectorAll(".archive__media, .archive__text > *"), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 1,
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <PageMeta route="trailers" />
      <PageHero
        title="Trailers"
        lede={`Every official Grand Theft Auto VI video from Rockstar Games, newest first. ${trailers.length} so far.`}
        src={thumbnailUrl(featuredTrailer, "maxresdefault")}
      />

      <section className="reel section" aria-labelledby="reel-title">
        <div className="wrap reel__grid">
          <div className="reel__head">
            <h2 id="reel-title" className="reel__title">
              Latest: {featuredTrailer.title}
            </h2>
            <p className="reel__desc">{featuredTrailer.description}</p>
            <p className="reel__date tabular">Released {formatDate(featuredTrailer.released)}</p>
          </div>
          <div className="reel__player">
            <VideoFacade trailer={featuredTrailer} variant="feature" loading="eager" showMeta={false} />
            <p className="reel__credit">
              Video by Rockstar Games.{" "}
              <a href={youtubeUrl(featuredTrailer)} target="_blank" rel="noreferrer">
                Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="archive section" aria-labelledby="archive-title">
        <div className="wrap">
          <h2 id="archive-title" className="archive__title">
            The full reel
          </h2>
          <ol className="archive__list" reversed>
            {rest.map((t) => (
              <li key={t.id} className="archive__row">
                <div className="archive__media">
                  <VideoFacade trailer={t} variant="card" showMeta={false} />
                </div>
                <div className="archive__text">
                  <p className="archive__date tabular">
                    {formatDate(t.released)} <span aria-hidden="true">/</span> {t.duration}
                  </p>
                  <h3 className="archive__name">{t.title}</h3>
                  <p className="archive__desc">{t.description}</p>
                  <p className="archive__credit">
                    Video by Rockstar Games.{" "}
                    <a href={youtubeUrl(t)} target="_blank" rel="noreferrer">
                      Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="archive__more">
            <Button href="https://www.youtube.com/@RockstarGames" variant="ghost" icon="youtube" magnetic={false}>
              Rockstar Games on YouTube
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
