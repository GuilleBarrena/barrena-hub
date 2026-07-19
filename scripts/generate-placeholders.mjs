// Generates on-brand PLACEHOLDER imagery for the landing page.
//
// These are deliberately abstract geometric compositions - they are NOT real
// satellite imagery, field photography or crew photos, and must not be
// presented as such. Replace them with real assets using the same filenames
// and nothing else needs to change.
//
// Requires `sharp` (ships transitively with next):
//   node scripts/generate-placeholders.mjs

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "assets");

// Approximated from the oklch design tokens in src/app/globals.css
const C = {
  bg: "#FBFAF8",
  surface: "#EDEBE6",
  green900: "#2C3830",
  green700: "#38463A",
  green500: "#4F6B52",
  green300: "#8FA98F",
  green100: "#C3D2C1",
  accent: "#C97A4E",
  accentSoft: "#E0A379",
  sky: "#AEBAC2",
  ink: "#22282B",
};

const rng = (seed) => () =>
  ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) =>
  "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const B = hex2rgb(b);
  return rgb2hex(hex2rgb(a).map((v, i) => v + (B[i] - v) * t));
};

const DEFS = `
  <pattern id="rows" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <line x1="0" y1="0" x2="0" y2="7" stroke="${C.green900}" stroke-width="1.6" opacity="0.5"/>
  </pattern>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#D6DEE3"/>
    <stop offset="55%" stop-color="${C.sky}"/>
    <stop offset="100%" stop-color="#7C8B94"/>
  </linearGradient>
  <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${C.ink}" stop-opacity="0.16"/>
    <stop offset="45%" stop-color="${C.ink}" stop-opacity="0"/>
    <stop offset="100%" stop-color="${C.ink}" stop-opacity="0.22"/>
  </linearGradient>
`;

// Irregular quadrilateral parcels tiled into a grid - reads as cultivated plots.
function mosaic(W, H, cols, rows, seed, { inset = 5, jitter = 18 } = {}) {
  const r = rng(seed);
  const cw = W / cols;
  const ch = H / rows;
  let out = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const x0 = x * cw + inset;
      const y0 = y * ch + inset;
      const x1 = (x + 1) * cw - inset;
      const y1 = (y + 1) * ch - inset;
      const pts = [
        [x0 + (r() - 0.5) * jitter, y0 + (r() - 0.5) * jitter],
        [x1 + (r() - 0.5) * jitter, y0 + (r() - 0.5) * jitter],
        [x1 + (r() - 0.5) * jitter, y1 + (r() - 0.5) * jitter],
        [x0 + (r() - 0.5) * jitter, y1 + (r() - 0.5) * jitter],
      ]
        .map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`)
        .join(" ");
      const t = r();
      out += `<polygon points="${pts}" fill="${mix(C.green700, C.green300, t)}"/>`;
      if (t > 0.5) {
        out += `<polygon points="${pts}" fill="url(#rows)" opacity="0.3"/>`;
      }
    }
  }
  return out;
}

// A serpentine machine pass, the way a tractor actually works a plot.
function serpentine(W, H, passes, seed) {
  const r = rng(seed);
  const margin = W * 0.1;
  const usable = H - margin * 2;
  const step = usable / (passes - 1);
  let d = "";
  for (let i = 0; i < passes; i++) {
    const y = margin + i * step + (r() - 0.5) * 6;
    const left = margin + (r() - 0.5) * 10;
    const right = W - margin + (r() - 0.5) * 10;
    const [a, b] = i % 2 === 0 ? [left, right] : [right, left];
    d += i === 0 ? `M ${a.toFixed(1)} ${y.toFixed(1)}` : ` L ${a.toFixed(1)} ${y.toFixed(1)}`;
    d += ` L ${b.toFixed(1)} ${y.toFixed(1)}`;
    if (i < passes - 1) {
      const ny = margin + (i + 1) * step;
      const bulge = b > a ? 26 : -26;
      d += ` Q ${(b + bulge).toFixed(1)} ${((y + ny) / 2).toFixed(1)} ${b.toFixed(1)} ${ny.toFixed(1)}`;
    }
  }
  return d;
}

const wrap = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${DEFS}</defs>${body}</svg>`;

// 01 - hero: wide cultivated landscape with a live machine trace
function satelliteMap(W = 1600, H = 1000) {
  const path = serpentine(W, H, 9, 7);
  return wrap(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${C.green900}"/>
     ${mosaic(W, H, 5, 4, 12)}
     <path d="${path}" fill="none" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="${path}" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="26 16"/>
     <circle cx="${W * 0.1}" cy="${H * 0.1}" r="11" fill="${C.accent}"/>
     <circle cx="${W * 0.1}" cy="${H * 0.1}" r="21" fill="none" stroke="${C.accent}" stroke-width="3" opacity="0.5"/>
     <rect width="${W}" height="${H}" fill="url(#vignette)"/>`
  );
}

// 02 - fleet tracking: fewer, larger plots, one plot mid-pass
function featureTracking(W = 1200, H = 900) {
  const path = serpentine(W, H, 7, 21);
  return wrap(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${C.green900}"/>
     ${mosaic(W, H, 3, 3, 33, { jitter: 24 })}
     <path d="${path}" fill="none" stroke="${C.ink}" stroke-opacity="0.3" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="${path}" fill="none" stroke="${C.accent}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="22 14"/>
     <rect width="${W}" height="${H}" fill="url(#vignette)"/>`
  );
}

// 03 - NDVI: smooth vigor field sampled onto a raster grid
function featureSatellite(W = 1200, H = 900) {
  const cols = 26;
  const rows = 20;
  const cw = W / cols;
  const ch = H / rows;
  let cells = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n =
        Math.sin(x * 0.42) * Math.cos(y * 0.36) * 0.5 +
        Math.sin((x + y) * 0.21) * 0.35 +
        0.5;
      const v = Math.min(1, Math.max(0, n));
      // low vigor -> accent/orange, high vigor -> deep green
      const fill = v < 0.5 ? mix(C.accent, C.green300, v * 2) : mix(C.green300, C.green900, (v - 0.5) * 2);
      cells += `<rect x="${(x * cw).toFixed(1)}" y="${(y * ch).toFixed(1)}" width="${(cw + 0.6).toFixed(1)}" height="${(ch + 0.6).toFixed(1)}" fill="${fill}"/>`;
    }
  }
  return wrap(
    W,
    H,
    `${cells}
     <path d="M ${W * 0.08} ${H * 0.14} L ${W * 0.44} ${H * 0.08} L ${W * 0.63} ${H * 0.36} L ${W * 0.5} ${H * 0.72} L ${W * 0.14} ${H * 0.66} Z"
           fill="none" stroke="${C.bg}" stroke-width="3" stroke-opacity="0.85" stroke-dasharray="12 9"/>
     <rect width="${W}" height="${H}" fill="url(#vignette)"/>`
  );
}

// 04 - weather: layered sky, cloud mass, wind flow and rain
function featureWeather(W = 1200, H = 900) {
  const r = rng(88);
  let clouds = "";
  for (let i = 0; i < 5; i++) {
    const cx = W * (0.15 + i * 0.18) + (r() - 0.5) * 70;
    const cy = H * (0.22 + r() * 0.16);
    const s = 68 + r() * 62;
    clouds += `<g opacity="${(0.5 + r() * 0.35).toFixed(2)}">
      <ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${(s * 1.7).toFixed(0)}" ry="${s.toFixed(0)}" fill="#5E6B74"/>
      <ellipse cx="${(cx + s).toFixed(0)}" cy="${(cy + s * 0.22).toFixed(0)}" rx="${(s * 1.2).toFixed(0)}" ry="${(s * 0.8).toFixed(0)}" fill="#6E7A83"/>
    </g>`;
  }
  let rain = "";
  for (let i = 0; i < 46; i++) {
    const x = r() * W;
    const y = H * 0.45 + r() * H * 0.5;
    const len = 22 + r() * 30;
    rain += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - len * 0.32).toFixed(0)}" y2="${(y + len).toFixed(0)}" stroke="${C.bg}" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>`;
  }
  let wind = "";
  for (let i = 0; i < 3; i++) {
    const y = H * (0.5 + i * 0.075);
    wind += `<path d="M ${W * 0.1} ${y} Q ${W * 0.4} ${y - 42} ${W * 0.72} ${y} T ${W * 0.94} ${y - 12}" fill="none" stroke="${C.accent}" stroke-width="3.5" stroke-linecap="round" opacity="${0.85 - i * 0.22}"/>`;
  }
  return wrap(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>
     ${clouds}${rain}${wind}
     <rect y="${H * 0.82}" width="${W}" height="${H * 0.18}" fill="${C.green900}"/>
     <path d="M 0 ${H * 0.82} Q ${W * 0.3} ${H * 0.78} ${W * 0.55} ${H * 0.83} T ${W} ${H * 0.8} L ${W} ${H} L 0 ${H} Z" fill="${C.green700}"/>
     <rect width="${W}" height="${H}" fill="url(#vignette)"/>`
  );
}

// 05 - crews & tasks: work-order cards with checklist rows and figures
function featureWorkers(W = 1200, H = 900) {
  const r = rng(404);
  let cards = "";
  for (let i = 0; i < 3; i++) {
    const x = W * 0.09 + i * W * 0.29;
    const y = H * 0.2 + (r() - 0.5) * 44;
    const cw = W * 0.24;
    const chh = H * 0.5;
    cards += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${cw.toFixed(0)}" height="${chh.toFixed(0)}" rx="18" fill="${C.bg}" opacity="0.95"/>`;
    // avatar
    cards += `<circle cx="${(x + 40).toFixed(0)}" cy="${(y + 44).toFixed(0)}" r="17" fill="${mix(C.green500, C.accent, i / 2)}"/>`;
    cards += `<rect x="${(x + 68).toFixed(0)}" y="${(y + 34).toFixed(0)}" width="${(cw * 0.42).toFixed(0)}" height="9" rx="4.5" fill="${C.green300}"/>`;
    cards += `<rect x="${(x + 68).toFixed(0)}" y="${(y + 51).toFixed(0)}" width="${(cw * 0.3).toFixed(0)}" height="8" rx="4" fill="${C.surface}"/>`;
    // checklist rows
    for (let k = 0; k < 5; k++) {
      const ry = y + 92 + k * 40;
      const done = k < 3 - i * 0.5;
      cards += `<rect x="${(x + 26).toFixed(0)}" y="${ry.toFixed(0)}" width="20" height="20" rx="6" fill="${done ? C.green500 : C.surface}"/>`;
      if (done) {
        cards += `<path d="M ${(x + 31).toFixed(0)} ${(ry + 10).toFixed(0)} l 4.5 5 l 9 -9.5" fill="none" stroke="${C.bg}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      cards += `<rect x="${(x + 56).toFixed(0)}" y="${(ry + 5).toFixed(0)}" width="${(cw * (0.4 + r() * 0.3)).toFixed(0)}" height="9" rx="4.5" fill="${done ? C.green100 : C.surface}"/>`;
    }
  }
  return wrap(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${C.green700}"/>
     ${mosaic(W, H, 4, 3, 55, { jitter: 10, inset: 0 })}
     <rect width="${W}" height="${H}" fill="${C.green900}" opacity="0.55"/>
     ${cards}
     <rect width="${W}" height="${H}" fill="url(#vignette)"/>`
  );
}

const IMAGES = [
  ["satellite-map.jpg", satelliteMap()],
  ["feature-tracking.jpg", featureTracking()],
  ["feature-satellite.jpg", featureSatellite()],
  ["feature-weather.jpg", featureWeather()],
  ["feature-workers.jpg", featureWorkers()],
];

await mkdir(OUT, { recursive: true });
for (const [name, svg] of IMAGES) {
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, name));
  console.log("wrote", name);
}
