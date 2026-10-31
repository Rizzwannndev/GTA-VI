// Gallery items. Three kinds of image:
//  - `art`: the project's own artwork (fan art from the original site)
//  - `still`: official key art, hotlinked from Rockstar's YouTube thumbnails
//    (never downloaded or re-hosted), credited to Rockstar Games
//  - `photo`: official in-game screenshots from rockstargames.com/VI,
//    re-encoded in src/assets/photos and credited to Rockstar Games
import { art } from "../assets/images/art";
import { photos } from "../assets/photos/photos";
import { trailers, thumbnailUrl, youtubeUrl } from "./trailers";

const stills = trailers.map((t) => ({
  id: `still-${t.id}`,
  kind: "still",
  src: thumbnailUrl(t, "maxresdefault"),
  thumb: thumbnailUrl(t, "sddefault"),
  width: 1280,
  height: 720,
  title: t.title,
  credit: "Rockstar Games",
  creditHref: youtubeUrl(t),
}));

const photo = (key, title) => {
  const p = photos[key];
  return { id: key, kind: "photo", src: p.src, thumb: p.src, image: p, width: p.width, height: p.height, title, credit: `Screenshot: ${p.credit}`, creditHref: p.href };
};

export const gallery = [
  stills[0],
  photo("duo-skyline", "Jason and Lucia on the waterfront"),
  photo("vice-ocean-drive", "The Vice City sign"),
  { id: "bay", kind: "art", src: art.bay.src, thumb: art.bay.src, image: art.bay, width: 1536, height: 1024, title: "Vice City bay at golden hour", credit: "Fan art" },
  photo("leonida-keys", "Seaplane over the Keys"),
  photo("vice-cardozo", "Lights and sirens downtown"),
  stills[4],
  photo("lucia-pool", "Lucia by the pool"),
  photo("airboat", "Airboat through Grassrivers"),
  photo("sports-coupe", "Grotti Cheetah"),
  stills[5],
  photo("vice-city", "The towers across the water"),
  photo("jason-night", "Jason on the strip at night"),
  photo("keys-boats", "Party boats off the Keys"),
  photo("port-gellhorn-night", "Delights Cabaret, Port Gellhorn"),
  stills[3],
  photo("duo-dusk", "A kiss in the swamp at dusk"),
  photo("muscle-car", "Vapid Ganado by the sea"),
  photo("ambrosia-dusk", "Ambrosia at sundown"),
  photo("kalaga-river", "Kayaking in Mount Kalaga National Park"),
  stills[1],
  photo("stanier", "Vapid Stanier cab"),
  photo("vice-strip", "Vice City at night"),
  stills[2],
];
