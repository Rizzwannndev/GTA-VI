// Inline SVG icons from the Remix Icon set (one family, one stroke weight).
// Only the glyphs listed here are bundled, as raw SVG strings.
import arrowDown from "remixicon/icons/Arrows/arrow-down-line.svg?raw";
import arrowUpRight from "remixicon/icons/Arrows/arrow-right-up-line.svg?raw";
import arrowLeft from "remixicon/icons/Arrows/arrow-left-line.svg?raw";
import arrowRight from "remixicon/icons/Arrows/arrow-right-line.svg?raw";
import play from "remixicon/icons/Media/play-fill.svg?raw";
import close from "remixicon/icons/System/close-line.svg?raw";
import youtube from "remixicon/icons/Logos/youtube-fill.svg?raw";
import x from "remixicon/icons/Logos/twitter-x-fill.svg?raw";
import instagram from "remixicon/icons/Logos/instagram-line.svg?raw";
import tiktok from "remixicon/icons/Logos/tiktok-fill.svg?raw";
import facebook from "remixicon/icons/Logos/facebook-circle-fill.svg?raw";
import external from "remixicon/icons/System/external-link-line.svg?raw";
import pin from "remixicon/icons/Map/map-pin-2-line.svg?raw";
import check from "remixicon/icons/System/check-line.svg?raw";
import warning from "remixicon/icons/System/error-warning-line.svg?raw";

const icons = {
  arrowDown,
  arrowUpRight,
  arrowLeft,
  arrowRight,
  play,
  close,
  youtube,
  x,
  instagram,
  tiktok,
  facebook,
  external,
  pin,
  check,
  warning,
};

export default function Icon({ name, size = "1em", className = "", title }) {
  const svg = icons[name];
  if (!svg) return null;
  return (
    <span
      className={`icon ${className}`}
      style={{ width: size, height: size }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
