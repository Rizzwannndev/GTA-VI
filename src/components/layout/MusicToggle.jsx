import { toggleMusic, useMusic } from "../../audio/music";

// Five equalizer bars: still when music is off, dancing when it plays.
export default function MusicToggle({ className = "" }) {
  const { on, playing } = useMusic();
  return (
    <button
      type="button"
      className={`eq ${playing ? "is-playing" : ""} ${className}`}
      onClick={toggleMusic}
      aria-pressed={on}
      aria-label={on ? "Turn music off" : "Turn music on"}
      data-music-toggle
      data-cursor="link"
    >
      <span className="eq__bars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="eq__bar" style={{ "--i": i }} />
        ))}
      </span>
      <span className="eq__label">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
