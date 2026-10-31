// Responsive image sets for the site's own artwork. Each entry feeds the
// <Picture> component: AVIF first, WebP fallback, intrinsic size for layout.
import bg768avif from "./bg-768.avif";
import bg1536avif from "./bg-1536.avif";
import bg768webp from "./bg-768.webp";
import bg1536webp from "./bg-1536.webp";
import chars688avif from "./characters-688.avif";
import chars1376avif from "./characters-1376.avif";
import chars688webp from "./characters-688.webp";
import chars1376webp from "./characters-1376.webp";
import logo500avif from "./gta6-logo-500.avif";
import logo1000avif from "./gta6-logo-1000.avif";
import logo500webp from "./gta6-logo-500.webp";
import logo1000webp from "./gta6-logo-1000.webp";
import boobie800avif from "./boobie-ike-800.avif";
import boobie1600avif from "./boobie-ike-1600.avif";
import boobie800webp from "./boobie-ike-800.webp";
import boobie1600webp from "./boobie-ike-1600.webp";
import jasonAvif from "./jason.avif";
import jasonWebp from "./jason.webp";
import luciaAvif from "./lucia.avif";
import luciaWebp from "./lucia.webp";
import pegiAvif from "./pegi18-140.avif";
import pegiWebp from "./pegi18-140.webp";

const set = (pairs, width, height) => ({
  avif: pairs.map(([avif, , w]) => `${avif} ${w}w`).join(", "),
  webp: pairs.map(([, webp, w]) => `${webp} ${w}w`).join(", "),
  src: pairs[pairs.length - 1][1],
  width,
  height,
});

export const art = {
  bay: set([[bg768avif, bg768webp, 768], [bg1536avif, bg1536webp, 1536]], 1536, 1024),
  duo: set([[chars688avif, chars688webp, 688], [chars1376avif, chars1376webp, 1376]], 1376, 768),
  logo: set([[logo500avif, logo500webp, 500], [logo1000avif, logo1000webp, 981]], 981, 745),
  boobie: set([[boobie800avif, boobie800webp, 800], [boobie1600avif, boobie1600webp, 1600]], 1600, 1600),
  jason: set([[jasonAvif, jasonWebp, 306]], 306, 716),
  lucia: set([[luciaAvif, luciaWebp, 300]], 300, 620),
  pegi: set([[pegiAvif, pegiWebp, 140]], 140, 179),
};

// The bay plate as a single URL, for places that can't take srcset
// (the SVG <image> inside the intro mask, CSS backgrounds).
export const bayUrl = bg1536webp;
export const bayUrlSmall = bg768webp;
