/*
  Official Grand Theft Auto VI videos. This is the only place video data lives.

  Every entry was verified on 2026-10-31 against YouTube's oEmbed endpoint
  (uploader: "Rockstar Games", https://www.youtube.com/@RockstarGames) and
  cross-checked with https://www.rockstargames.com/VI. Dates are the YouTube
  publish dates; durations come from the watch page.

  To add a video: copy an entry, paste the 11-character ID from the YouTube URL
  (youtube.com/watch?v=<id>), and fill in the rest. Set `embeddable: false`
  for age-restricted uploads; YouTube refuses to play those inside an iframe,
  so the site links out to YouTube for them instead.
*/

export const trailers = [
  {
    id: "launch-trailer",
    youtubeId: "rz1B4B2yBZY",
    title: "Launch Trailer",
    released: "2026-10-15",
    duration: "1:30",
    embeddable: true,
    description:
      "The final trailer before release, closing on the date itself: November 19, 2026.",
  },
  {
    id: "extended-look",
    youtubeId: "tJbzMqJGH4k",
    title: "An Extended Look",
    released: "2026-08-27",
    duration: "26:48",
    embeddable: false,
    description:
      "A long-form tour of Leonida and its people. Age-restricted by Rockstar, so it plays on YouTube only.",
  },
  {
    id: "extended-look-teaser",
    youtubeId: "qq76pQsI1iw",
    title: "An Extended Look: Coming August 27",
    released: "2026-08-06",
    duration: "0:25",
    embeddable: true,
    description: "The short announcement that set the date for the Extended Look premiere.",
  },
  {
    id: "cover-art",
    youtubeId: "EiQEBYDox_k",
    title: "Official Cover Art Reveal",
    released: "2026-06-18",
    duration: "0:33",
    embeddable: true,
    description: "The box art, revealed one week before pre-orders opened on June 25.",
  },
  {
    id: "trailer-2",
    youtubeId: "VQRLujxTm3c",
    title: "Trailer 2",
    released: "2025-05-06",
    duration: "2:47",
    embeddable: true,
    description:
      "Jason and Lucia's story takes shape, with a first proper look at the people of Vice City and beyond.",
  },
  {
    id: "trailer-1",
    youtubeId: "QdBZY2fkU-0",
    title: "Trailer 1",
    released: "2023-12-04",
    duration: "1:30",
    embeddable: true,
    description:
      "The reveal. Lucia, Jason, and a return to Vice City set to Tom Petty's \"Love Is a Long Road.\"",
  },
];

export const featuredTrailer = trailers.find((t) => t.embeddable);

export const youtubeUrl = (t) => `https://www.youtube.com/watch?v=${t.youtubeId}`;

export const thumbnailUrl = (t, quality = "maxresdefault") =>
  `https://i.ytimg.com/vi/${t.youtubeId}/${quality}.jpg`;

export const embedUrl = (t) => {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "",
  });
  return `https://www.youtube-nocookie.com/embed/${t.youtubeId}?${params}`;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (iso) => dateFormat.format(new Date(`${iso}T00:00:00Z`));
