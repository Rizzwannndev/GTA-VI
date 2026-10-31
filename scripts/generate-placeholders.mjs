// Generates the themed placeholder art in src/assets/placeholders/.
// Run: node scripts/generate-placeholders.mjs
// Every file here is a stand-in; swap any of them for real art with the same
// file name (or point the data files at a new import) and nothing else changes.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("src/assets/placeholders");
fs.mkdirSync(OUT, { recursive: true });

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

const W = 1600;
const H = 1000;

const sky = (id, stops) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("")}</linearGradient>`;

// Synthwave sun with horizontal cuts.
function sun(cx, cy, r, colorTop, colorBottom, id) {
  let cuts = "";
  for (let i = 0; i < 7; i++) {
    const y = cy + r * 0.1 + i * r * 0.14;
    const h = 2 + i * 2.6;
    cuts += `<rect x="${cx - r}" y="${y}" width="${r * 2}" height="${h}" fill="#000"/>`;
  }
  return `
  <defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colorTop}"/><stop offset="1" stop-color="${colorBottom}"/></linearGradient>
    <mask id="${id}m"><rect width="${W}" height="${H}" fill="#fff"/>${cuts}</mask>
    <radialGradient id="${id}h"><stop offset="0" stop-color="${colorTop}" stop-opacity=".55"/><stop offset="1" stop-color="${colorTop}" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${r * 2.4}" fill="url(#${id}h)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}g)" mask="url(#${id}m)"/>`;
}

function palm(x, baseY, h, color, lean = 0, scale = 1) {
  const topX = x + lean;
  const topY = baseY - h;
  const trunk = `<path d="M${x - 9 * scale},${baseY} Q${x + lean * 0.3},${baseY - h * 0.5} ${topX - 3 * scale},${topY} L${topX + 5 * scale},${topY} Q${x + lean * 0.3 + 12 * scale},${baseY - h * 0.5} ${x + 9 * scale},${baseY} Z" fill="${color}"/>`;
  let fronds = "";
  const angles = [-170, -140, -110, -70, -40, -10, 20];
  for (const a of angles) {
    const rad = (a * Math.PI) / 180;
    const len = (110 + Math.abs(Math.sin(rad)) * 30) * scale;
    const ex = topX + Math.cos(rad) * len;
    const ey = topY + Math.sin(rad) * len * 0.55 + len * 0.35;
    const cx1 = topX + Math.cos(rad) * len * 0.5;
    const cy1 = topY + Math.sin(rad) * len * 0.5 - 28 * scale;
    fronds += `<path d="M${topX},${topY} Q${cx1},${cy1} ${ex},${ey} Q${cx1 + 6},${cy1 + 22 * scale} ${topX},${topY + 6 * scale} Z" fill="${color}"/>`;
  }
  return trunk + fronds;
}

function skyline(r, baseY, count, minH, maxH, color, x0 = 0, x1 = W, windows) {
  let s = "";
  let x = x0;
  while (x < x1) {
    const w = 40 + r() * 90;
    const h = minH + r() * (maxH - minH);
    s += `<rect x="${x.toFixed(1)}" y="${(baseY - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}"/>`;
    if (windows && h > 120) {
      for (let wy = baseY - h + 16; wy < baseY - 14; wy += 18) {
        for (let wx = x + 8; wx < x + w - 10; wx += 14) {
          if (r() > 0.62) s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="6" height="8" fill="${windows}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
        }
      }
    }
    x += w + 4 + r() * 10;
  }
  return s;
}

function waterLines(r, y0, y1, color) {
  let s = "";
  for (let y = y0; y < y1; y += 9 + (y - y0) * 0.05) {
    const x = r() * W * 0.8;
    const w = 80 + r() * 320;
    s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(2 + (y - y0) * 0.02).toFixed(1)}" fill="${color}" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
  }
  return s;
}

function ridge(r, baseY, amp, step, color, rough = 0.5) {
  let d = `M0,${H} L0,${baseY}`;
  for (let x = 0; x <= W; x += step) {
    const y = baseY - Math.sin(x / 260 + r() * rough) * amp - r() * amp * rough;
    d += ` L${x},${y.toFixed(1)}`;
  }
  return `<path d="${d} L${W},${H} Z" fill="${color}"/>`;
}

function pines(r, baseY, count, color, minH = 60, maxH = 160) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = r() * W;
    const h = minH + r() * (maxH - minH);
    const w = h * 0.36;
    s += `<path d="M${x},${baseY - h} L${x + w / 2},${baseY} L${x - w / 2},${baseY} Z" fill="${color}"/>`;
  }
  return s;
}

function grain(id) {
  return `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 -.2"/></filter><rect width="${W}" height="${H}" filter="url(#${id})" opacity=".18" style="mix-blend-mode:overlay"/>`;
}

const svg = (body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">${body}</svg>\n`;

// ---------- Locations ----------
const locations = {
  "location-vice-city": (r) =>
    `<defs>${sky("s", [[0, "#2b1a6b"], [0.45, "#d43f8d"], [0.7, "#ff8b3d"], [1, "#ffcf7a"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(820, 560, 190, "#ffe08a", "#ff3d8b", "vc")}
     ${skyline(r, 640, 30, 120, 380, "#2a1450", 0, W, "#ffcf7a")}
     <rect y="640" width="${W}" height="${H - 640}" fill="#1b0d3f"/>
     ${waterLines(r, 650, H, "#ff6fae")}
     ${palm(170, 1000, 520, "#120827", 40)}${palm(330, 1000, 380, "#120827", -30, 0.8)}${palm(1430, 1000, 560, "#120827", -50, 1.1)}`,
  "location-leonida-keys": (r) =>
    `<defs>${sky("s", [[0, "#3b5ad8"], [0.5, "#8a6fe0"], [0.75, "#ff9fb8"], [1, "#ffd9a0"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(1180, 520, 120, "#fff1c4", "#ff9b4a", "lk")}
     <rect y="560" width="${W}" height="${H - 560}" fill="#17b5b0"/>
     <rect y="560" width="${W}" height="${H - 560}" fill="url(#s)" opacity=".25"/>
     ${waterLines(r, 570, H, "#e9fffb")}
     <path d="M0,600 Q300,592 600,598 T1200,596 T1600,600" stroke="#203a6b" stroke-width="10" fill="none"/>
     ${Array.from({ length: 22 }, (_, i) => `<rect x="${i * 76}" y="598" width="6" height="36" fill="#203a6b"/>`).join("")}
     <ellipse cx="260" cy="700" rx="230" ry="34" fill="#0f5a5f"/><ellipse cx="980" cy="760" rx="160" ry="26" fill="#0f5a5f"/>
     ${palm(220, 700, 260, "#0b2f3a", 30, 0.7)}${palm(330, 700, 200, "#0b2f3a", -20, 0.55)}${palm(1000, 760, 230, "#0b2f3a", 25, 0.62)}`,
  "location-grassrivers": (r) =>
    `<defs>${sky("s", [[0, "#1f2a4f"], [0.5, "#5b4a8f"], [0.8, "#d88a6a"], [1, "#f2c48a"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(420, 560, 110, "#ffd38a", "#ff7a59", "gr")}
     <rect y="600" width="${W}" height="${H - 600}" fill="#24334a"/>
     ${waterLines(r, 610, H, "#f2c48a")}
     ${Array.from({ length: 220 }, () => { const x = r() * W; const h = 30 + r() * 120; const y = 600 + r() * 380; return `<path d="M${x.toFixed(0)},${y.toFixed(0)} q${(r() * 16 - 8).toFixed(0)},${(-h / 2).toFixed(0)} ${(r() * 20 - 10).toFixed(0)},${(-h).toFixed(0)}" stroke="#13261f" stroke-width="${(2 + r() * 3).toFixed(1)}" fill="none"/>`; }).join("")}
     ${Array.from({ length: 6 }, (_, i) => { const x = 900 + i * 110 + r() * 40; const h = 240 + r() * 140; return `<path d="M${x},600 L${x + 8},${600 - h} L${x + 16},600 Z" fill="#132219"/><ellipse cx="${x + 8}" cy="${600 - h}" rx="${50 + r() * 30}" ry="22" fill="#132219"/>`; }).join("")}
     <path d="M620,760 l220,0 l-20,26 l-190,0 Z" fill="#0d1726"/><rect x="760" y="700" width="10" height="60" fill="#0d1726"/><circle cx="765" cy="700" r="34" fill="none" stroke="#0d1726" stroke-width="8"/>`,
  "location-port-gellhorn": (r) =>
    `<defs>${sky("s", [[0, "#3a2d5c"], [0.55, "#9c5a7a"], [0.85, "#e59a6a"], [1, "#f4c890"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(1250, 600, 100, "#ffd9a0", "#ff8b3d", "pg")}
     ${Array.from({ length: 4 }, (_, i) => { const x = 160 + i * 300; return `<path d="M${x},640 L${x},300 L${x + 30},300 L${x + 30},640 Z M${x - 80},300 L${x + 260},300 L${x + 260},326 L${x - 80},326 Z M${x + 30},326 L${x + 200},326 L${x + 30},420 Z" fill="#241a3a"/><rect x="${x + 180}" y="326" width="4" height="${120 + r() * 120}" fill="#241a3a"/>`; }).join("")}
     ${Array.from({ length: 40 }, () => { const x = r() * W; const y = 560 + r() * 70; const c = ["#ff3d8b", "#30e3d0", "#ff8b3d", "#4a6ee0", "#c2187f"][Math.floor(r() * 5)]; return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(60 + r() * 40).toFixed(0)}" height="26" fill="${c}" opacity=".8"/>`; }).join("")}
     <rect y="640" width="${W}" height="${H - 640}" fill="#2a2140"/>
     ${waterLines(r, 650, H, "#f4c890")}`,
  "location-ambrosia": (r) =>
    `<defs>${sky("s", [[0, "#4b2a52"], [0.5, "#c0566a"], [0.85, "#ff9b4a"], [1, "#ffd27a"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(500, 600, 150, "#ffe7a0", "#ff6a3d", "am")}
     ${Array.from({ length: 7 }, (_, i) => { const x = 820 + i * 95; const h = 260 + r() * 220; return `<rect x="${x}" y="${640 - h}" width="${26 + r() * 20}" height="${h}" fill="#2b1530"/>${Array.from({ length: 5 }, (_, k) => `<circle cx="${x + 18 + k * 18 + r() * 20}" cy="${640 - h - 20 - k * 34}" r="${20 + k * 12}" fill="#f2b8a0" opacity="${(0.28 - k * 0.04).toFixed(2)}"/>`).join("")}`; }).join("")}
     <rect x="760" y="520" width="700" height="120" fill="#2b1530"/>
     <rect y="640" width="${W}" height="${H - 640}" fill="#5a2a3a"/>
     ${Array.from({ length: 30 }, (_, i) => `<path d="M${-200 + i * 70},${H} L800,640" stroke="#7a3a48" stroke-width="3"/>`).join("")}`,
  "location-mount-kalaga": (r) =>
    `<defs>${sky("s", [[0, "#1a1440"], [0.45, "#4a3a8f"], [0.75, "#c06a9a"], [1, "#f4a87a"]])}</defs>
     <rect width="${W}" height="${H}" fill="url(#s)"/>
     ${sun(1100, 420, 90, "#ffe0b0", "#ff7aa0", "mk")}
     <path d="M0,${H} L0,560 L380,330 L560,430 L760,250 L980,460 L1200,380 L1600,560 L1600,${H} Z" fill="#3b2a6b"/>
     <path d="M760,250 L700,310 L740,300 L770,330 L800,296 L830,312 Z" fill="#e8d8ff" opacity=".7"/>
     ${ridge(r, 640, 50, 40, "#2a1d52", 0.6)}
     ${pines(r, 760, 60, "#1a1238", 80, 200)}
     ${ridge(r, 820, 30, 30, "#120c2a", 0.4)}
     ${pines(r, 900, 40, "#0c081d", 120, 260)}`,
};

// ---------- Vehicles ----------
function road(r, horizon, accent) {
  let s = `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="#0c0820"/>`;
  for (let i = -12; i <= 12; i++) s += `<path d="M${W / 2},${horizon} L${W / 2 + i * 260},${H}" stroke="${accent}" stroke-opacity=".45" stroke-width="2"/>`;
  for (let k = 1; k < 12; k++) {
    const y = horizon + Math.pow(k / 12, 2.2) * (H - horizon);
    s += `<rect y="${y.toFixed(1)}" width="${W}" height="${(1 + k * 0.25).toFixed(2)}" fill="${accent}" opacity=".5"/>`;
  }
  return s;
}

const vehicleShapes = {
  sports: `<path d="M320,700 C360,640 520,600 640,590 C720,540 860,520 980,540 C1080,556 1170,600 1240,640 C1290,650 1310,680 1300,712 L1290,730 L330,730 Z" fill="#120a26"/><path d="M700,592 C760,552 880,540 960,556 L1010,600 Z" fill="#30e3d0" opacity=".35"/>`,
  muscle: `<path d="M300,700 L330,640 C420,630 560,620 640,610 L720,548 C820,536 940,536 1000,552 L1080,612 C1180,622 1260,632 1300,650 L1310,730 L300,730 Z" fill="#120a26"/><path d="M740,560 L990,560 L1050,606 L700,606 Z" fill="#ff8b3d" opacity=".3"/>`,
  bike: `<path d="M560,720 L700,600 L820,600 L900,560 L1000,560 L960,600 L1060,640 L1100,720 Z" fill="#120a26"/><path d="M820,600 L860,520 L900,520 L880,600 Z" fill="#120a26"/>`,
  airboat: `<path d="M300,740 L1250,740 L1300,700 L340,700 Z" fill="#120a26"/><rect x="560" y="620" width="120" height="80" fill="#120a26"/><circle cx="1000" cy="600" r="120" fill="none" stroke="#120a26" stroke-width="16"/><rect x="990" y="480" width="20" height="240" fill="#120a26"/>`,
  speedboat: `<path d="M260,720 C520,740 1000,740 1340,680 L1300,650 L300,650 Z" fill="#120a26"/><path d="M700,650 L780,580 L960,580 L1000,650 Z" fill="#120a26"/><path d="M780,592 L950,592 L980,640 L740,640 Z" fill="#30e3d0" opacity=".3"/>`,
  police: `<path d="M300,700 C340,640 480,620 600,610 L700,540 C800,526 960,526 1040,544 L1120,610 C1220,620 1290,640 1300,700 L1300,730 L300,730 Z" fill="#120a26"/><rect x="820" y="512" width="40" height="22" fill="#ff3d8b"/><rect x="860" y="512" width="40" height="22" fill="#4a6ee0"/>`,
  heli: `<ellipse cx="820" cy="560" rx="200" ry="90" fill="#120a26"/><path d="M1000,560 L1360,520 L1370,560 L1010,600 Z" fill="#120a26"/><rect x="560" y="440" width="560" height="10" fill="#120a26"/><rect x="815" y="440" width="10" height="40" fill="#120a26"/><path d="M640,660 L1000,660" stroke="#120a26" stroke-width="10"/>`,
  truck: `<path d="M280,700 L300,600 L560,590 L620,500 L840,500 L860,590 L1320,600 L1320,730 L280,730 Z" fill="#120a26"/><rect x="640" y="514" width="180" height="70" fill="#ff8b3d" opacity=".3"/>`,
};

function wheels(kind) {
  const pairs = {
    sports: [[470, 730], [1150, 730]],
    muscle: [[450, 730], [1150, 730]],
    bike: [[620, 730], [1060, 730]],
    police: [[460, 730], [1150, 730]],
    truck: [[460, 740], [1140, 740]],
  }[kind];
  if (!pairs) return "";
  return pairs
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="70" fill="#120a26"/><circle cx="${x}" cy="${y}" r="34" fill="none" stroke="#ff3d8b" stroke-width="5" opacity=".7"/>`)
    .join("");
}

const vehicleArt = {
  "vehicle-sports-coupe": ["sports", "#ff3d8b", [[0, "#1d1150"], [0.6, "#c2187f"], [1, "#ff8b3d"]]],
  "vehicle-muscle-car": ["muscle", "#ff8b3d", [[0, "#2a1450"], [0.6, "#ff3d8b"], [1, "#ffcf7a"]]],
  "vehicle-street-bike": ["bike", "#30e3d0", [[0, "#0f1a4a"], [0.6, "#4a6ee0"], [1, "#30e3d0"]]],
  "vehicle-airboat": ["airboat", "#ffcf7a", [[0, "#1f2a4f"], [0.6, "#5b4a8f"], [1, "#f2c48a"]]],
  "vehicle-speedboat": ["speedboat", "#30e3d0", [[0, "#3b5ad8"], [0.6, "#8a6fe0"], [1, "#ff9fb8"]]],
  "vehicle-police-cruiser": ["police", "#4a6ee0", [[0, "#120a30"], [0.6, "#3a1f78"], [1, "#ff3d8b"]]],
  "vehicle-helicopter": ["heli", "#ff8b3d", [[0, "#2b1a6b"], [0.6, "#d43f8d"], [1, "#ffcf7a"]]],
  "vehicle-swamp-truck": ["truck", "#ffcf7a", [[0, "#1f2a2f"], [0.6, "#5a4a3a"], [1, "#e59a6a"]]],
};

// ---------- Supporting cast portraits ----------
const cast = {
  "cast-cal-hampton": ["#4a6ee0", "#30e3d0"],
  "cast-dre-quan-priest": ["#c2187f", "#ffcf7a"],
  "cast-real-dimez": ["#ff3d8b", "#8a4fd0"],
  "cast-raul-bautista": ["#ff8b3d", "#3a1f78"],
  "cast-brian-heder": ["#30e3d0", "#ff8b3d"],
};

function portrait([a, b], seed) {
  const r = rng(seed);
  const tilt = (r() - 0.5) * 30;
  return `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="h" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#p)"/>
    <rect width="${W}" height="${H}" fill="url(#h)"/>
    ${Array.from({ length: 14 }, (_, i) => `<rect y="${i * 72}" width="${W}" height="2" fill="#0c0820" opacity=".18"/>`).join("")}
    <g transform="rotate(${tilt.toFixed(1)} 800 1000)" fill="#0c0820">
      <ellipse cx="800" cy="430" rx="150" ry="180"/>
      <path d="M800,600 C560,600 420,720 380,1000 L1220,1000 C1180,720 1040,600 800,600 Z"/>
      <rect x="745" y="560" width="110" height="80"/>
    </g>`;
}

let n = 0;
for (const [name, draw] of Object.entries(locations)) {
  const body = draw(rng(++n * 977)) + `<defs></defs>` + grain("g");
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg(body, `Placeholder art: ${name.replace("location-", "").replace(/-/g, " ")}`));
}
for (const [name, [kind, accent, stops]] of Object.entries(vehicleArt)) {
  const r = rng(++n * 977);
  const body = `<defs>${sky("s", stops)}</defs><rect width="${W}" height="${H}" fill="url(#s)"/>${sun(800, 520, 150, "#ffe08a", accent, "v")}${road(r, 560, accent)}<g>${vehicleShapes[kind]}${wheels(kind)}</g>${grain("g")}`;
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg(body, `Placeholder art: ${name.replace("vehicle-", "").replace(/-/g, " ")}`));
}
for (const [name, colors] of Object.entries(cast)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg(portrait(colors, ++n * 977) + grain("g"), `Placeholder portrait: ${name.replace("cast-", "").replace(/-/g, " ")}`));
}
console.log(`Wrote ${fs.readdirSync(OUT).length} placeholders to ${OUT}`);
