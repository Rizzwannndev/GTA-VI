import { useRef } from "react";
import { useGSAP } from "../../animations/gsap";
import { revealImage, revealText } from "../../animations/motion";
import { featuredTrailer, formatDate } from "../../data/trailers";
import VideoFacade from "../video/VideoFacade";
import Button from "../ui/Button";

// The latest embeddable official trailer, large, with a pulsing play button.
export default function TrailerFeature() {
  const rootRef = useRef(null);
  const t = featuredTrailer;

  useGSAP(
    () => {
      revealText(".trailer-feature__title", { type: "chars", stagger: 0.02 });
      revealText(".trailer-feature__lede", { delay: 0.15 });
      revealImage(".trailer-feature .facade__frame", { start: "top 80%" });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="trailer-feature section" aria-labelledby="trailer-feature-title">
      <div className="wrap trailer-feature__grid">
        <header className="trailer-feature__head">
          <h2 id="trailer-feature-title" className="trailer-feature__title">
            Watch the {t.title.toLowerCase()}
          </h2>
          <p className="trailer-feature__lede">
            Released {formatDate(t.released)}. {t.description}
          </p>
          <Button to="/trailers" variant="ghost" icon="arrowRight" magnetic={false}>
            All official trailers
          </Button>
        </header>
        <VideoFacade trailer={t} variant="feature" showMeta={false} />
        <p className="trailer-feature__credit">
          Official video by Rockstar Games, embedded from{" "}
          <a href={`https://www.youtube.com/watch?v=${t.youtubeId}`} target="_blank" rel="noreferrer">
            YouTube
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </section>
  );
}
