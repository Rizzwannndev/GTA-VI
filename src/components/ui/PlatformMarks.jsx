import playstation from "remixicon/icons/Logos/playstation-fill.svg?raw";
import xbox from "remixicon/icons/Logos/xbox-fill.svg?raw";

// The two launch platforms, as icon plus name. Replaces the old ps5.png badge,
// which named the wrong Xbox.
export default function PlatformMarks({ className = "" }) {
  return (
    <p className={`platforms ${className}`}>
      <span className="platforms__item">
        <span className="platforms__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: playstation }} />
        PlayStation 5
      </span>
      <span className="platforms__rule" aria-hidden="true" />
      <span className="platforms__item">
        <span className="platforms__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: xbox }} />
        Xbox Series X|S
      </span>
    </p>
  );
}
