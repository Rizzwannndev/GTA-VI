import { useRef } from "react";
import { useVideo } from "../../context/VideoContext";
import { formatDate, thumbnailUrl, youtubeUrl } from "../../data/trailers";
import Icon from "../ui/Icon";

// Lightweight stand-in for a YouTube player: a themed thumbnail and play
// button. The real iframe is created only when the visitor presses play.
// Age-restricted videos can't be embedded, so those link out to YouTube.
export default function VideoFacade({ trailer, variant = "card", loading = "lazy", showMeta = true, headingLevel = 3 }) {
  const { openVideo } = useVideo();
  const frameRef = useRef(null);
  const Heading = `h${headingLevel}`;
  const thumb = thumbnailUrl(trailer, variant === "feature" ? "maxresdefault" : "sddefault");

  const inner = (
    <>
      <img
        className="facade__img"
        src={thumb}
        alt=""
        width={variant === "feature" ? 1280 : 640}
        height={variant === "feature" ? 720 : 480}
        loading={loading}
        decoding="async"
      />
      <span className="facade__shade" aria-hidden="true" />
      <span className="facade__play" aria-hidden="true">
        <span className="facade__ring" />
        <span className="facade__ring facade__ring--late" />
        <Icon name={trailer.embeddable ? "play" : "external"} size={variant === "feature" ? "2.2rem" : "1.4rem"} />
      </span>
      {!trailer.embeddable && <span className="facade__badge">Plays on YouTube</span>}
      <span className="facade__duration tabular">{trailer.duration}</span>
    </>
  );

  return (
    <figure className={`facade facade--${variant}`}>
      {trailer.embeddable ? (
        <button
          ref={frameRef}
          type="button"
          className="facade__frame"
          onClick={() => openVideo(trailer, frameRef.current)}
          data-cursor="play"
          aria-label={`Play ${trailer.title} (${trailer.duration})`}
        >
          {inner}
        </button>
      ) : (
        <a
          className="facade__frame"
          href={youtubeUrl(trailer)}
          target="_blank"
          rel="noreferrer"
          data-cursor="watch"
          aria-label={`Watch ${trailer.title} on YouTube (opens in a new tab)`}
        >
          {inner}
        </a>
      )}
      {showMeta && (
        <figcaption className="facade__meta">
          <Heading className="facade__title">{trailer.title}</Heading>
          <p className="facade__date tabular">
            {formatDate(trailer.released)} <span className="facade__sep" aria-hidden="true" /> {trailer.duration}
          </p>
          <p className="facade__credit">
            Video by Rockstar Games.{" "}
            <a href={youtubeUrl(trailer)} target="_blank" rel="noreferrer">
              Watch on YouTube
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </figcaption>
      )}
    </figure>
  );
}
