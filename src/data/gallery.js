// Gallery items. Three kinds of image:
//  - `art`: the project's own artwork (fan art from the original site)
//  - `still`: official key art, hotlinked from Rockstar's YouTube thumbnails
//    (never downloaded or re-hosted), credited to Rockstar Games
//  - `photo`: real-world Florida photography from Unsplash, credited to the
//    photographer (stand-ins for Leonida, not game footage)
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
  return { id: key, kind: "photo", src: p.src, thumb: p.src, image: p, width: p.width, height: p.height, title, credit: `Photo: ${p.credit}`, creditHref: p.href };
};

export const gallery = [
  stills[0],
  photo("vice-ocean-drive", "Ocean Drive after dark"),
  { id: "bay", kind: "art", src: art.bay.src, thumb: art.bay.src, image: art.bay, width: 1536, height: 1024, title: "Vice City bay at golden hour", credit: "Fan art" },
  photo("leonida-keys", "The overseas highway"),
  stills[4],
  { id: "lucia", kind: "art", src: art.lucia.src, thumb: art.lucia.src, image: art.lucia, width: 300, height: 620, title: "Lucia Caminos", credit: "Fan art" },
  photo("vice-cardozo", "Art deco front at night"),
  photo("airboat", "Airboat run at dawn"),
  stills[5],
  { id: "boobie", kind: "art", src: art.boobie.src, thumb: art.boobie.src, image: art.boobie, width: 1600, height: 1600, title: "Boobie Ike outside the Jack of Hearts", credit: "Fan art" },
  photo("vice-city", "Downtown across the water"),
  photo("muscle-car", "Parked on the strip"),
  stills[3],
  { id: "jason", kind: "art", src: art.jason.src, thumb: art.jason.src, image: art.jason, width: 306, height: 716, title: "Jason Duval", credit: "Fan art" },
  photo("port-gellhorn", "Cranes at twilight"),
  photo("vice-beach", "The beach from above"),
  stills[1],
  { id: "duo", kind: "art", src: art.duo.src, thumb: art.duo.src, image: art.duo, width: 1376, height: 768, title: "Lucia and Jason", credit: "Fan art" },
  photo("mount-kalaga", "Pines in the clouds"),
  stills[2],
];
