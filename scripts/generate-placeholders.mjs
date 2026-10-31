// Generates the placeholder portraits in src/assets/placeholders/ for the
// supporting cast whose official art isn't on this site yet.
// Run: node scripts/generate-placeholders.mjs
// Swap any file for a real portrait with the same name (4:5, at least
// 800x1000) and nothing else changes.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("src/assets/placeholders");
fs.mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 1000;

// Deterministic PRNG so the art is stable between runs.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cast = ["cast-cal-hampton", "cast-dre-quan-priest", "cast-real-dimez", "cast-raul-bautista", "cast-brian-heder"];

// A studio-lit silhouette on graphite: a rim light from one side, the figure
// in near-black, a soft floor shadow. Monochrome so it sits in the site's
// black-and-white world without pretending to be real art.
function portrait(seed) {
  const r = rng(seed);
  const side = r() > 0.5 ? 1 : 0;
  const tilt = (r() - 0.5) * 10;
  const lx = side ? 0.82 : 0.18;
  return `<defs>
    <radialGradient id="bg" cx="${lx}" cy="0.3" r="0.95"><stop offset="0" stop-color="#4a4a4a"/><stop offset="0.55" stop-color="#1c1c1c"/><stop offset="1" stop-color="#0a0a0a"/></radialGradient>
    <linearGradient id="rim" x1="${side}" y1="0" x2="${1 - side}" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".18" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g transform="rotate(${tilt.toFixed(1)} 400 1000)">
    <g fill="#050505">
      <ellipse cx="400" cy="420" rx="128" ry="158"/>
      <rect x="352" y="540" width="96" height="90"/>
      <path d="M400 610 C210 610 120 720 90 1000 L710 1000 C680 720 590 610 400 610 Z"/>
    </g>
    <g fill="url(#rim)">
      <ellipse cx="400" cy="420" rx="128" ry="158"/>
      <path d="M400 610 C210 610 120 720 90 1000 L710 1000 C680 720 590 610 400 610 Z"/>
    </g>
  </g>`;
}

const svg = (body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">${body}</svg>\n`;

cast.forEach((name, i) => {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg(portrait((i + 1) * 977), `Placeholder portrait: ${name.replace("cast-", "").replace(/-/g, " ")}`));
});
console.log(`Wrote ${cast.length} placeholders to ${OUT}`);
