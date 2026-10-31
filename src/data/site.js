// Site-wide facts and links. Facts verified 2026-10-31 against Rockstar's
// Newswire (rockstargames.com/newswire) and the official GTA VI page.

export const RELEASE_DATE = "2026-11-19";
export const RELEASE_LABEL = "November 19, 2026";
export const PLATFORMS = ["PlayStation 5", "Xbox Series X|S"];

export const OFFICIAL_URL = "https://www.rockstargames.com/VI";
export const NEWSWIRE_URL = "https://www.rockstargames.com/newswire";

export const SITE_NAME = "Leonida Unofficial";
export const SITE_TAGLINE = "A fan-made guide to Grand Theft Auto VI.";
export const DISCLAIMER =
  "Fan-made project, not affiliated with Rockstar Games. All trailers and trademarks belong to Rockstar Games.";

export const AUTHOR = {
  name: "Rizwan Waseem",
  url: "https://www.linkedin.com/in/rizwan-waseem",
  email: "razaatrader25@gmail.com",
};

// Rockstar's official channels.
export const socials = [
  { id: "youtube", label: "Rockstar Games on YouTube", short: "YouTube", href: "https://www.youtube.com/@RockstarGames" },
  { id: "x", label: "Rockstar Games on X", short: "X", href: "https://x.com/RockstarGames" },
  { id: "instagram", label: "Rockstar Games on Instagram", short: "Instagram", href: "https://www.instagram.com/rockstargames" },
  { id: "tiktok", label: "Rockstar Games on TikTok", short: "TikTok", href: "https://www.tiktok.com/@rockstargames" },
  { id: "facebook", label: "Rockstar Games on Facebook", short: "Facebook", href: "https://www.facebook.com/rockstargames" },
];

export function daysUntilRelease(now = new Date()) {
  const release = new Date(`${RELEASE_DATE}T00:00:00`);
  return Math.max(0, Math.ceil((release - now) / 86_400_000));
}
