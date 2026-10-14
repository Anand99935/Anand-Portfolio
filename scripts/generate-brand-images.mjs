/* Regenerates the favicon, Apple touch icon and social cards in app/.
   The social card's portrait is the ASCII grid from lib/asciiPortrait.ts.

   Usage: node scripts/generate-brand-images.mjs
*/
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const NAME_FIRST = "Anand";
const NAME_LAST = "Mandloi";
const INITIAL = "A";
const DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://anandmandloi.vercel.app").replace(/^https?:\/\//, "");

const BG = "#0D0B09";
const INK = "#EDE5D8";
const INK3 = "#8A7D6E";
const GOLD = "#C9A852";
const MONO = "Menlo, 'JetBrains Mono', monospace";
const RAMP = " .'`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const icon = (size) => {
  const r = size * 0.22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${(r / size) * 512}" fill="${BG}"/>
  <rect width="512" height="512" rx="${(r / size) * 512}" fill="url(#g)"/>
  <text x="256" y="262" text-anchor="middle" dominant-baseline="middle" font-family="${MONO}" font-size="250" font-weight="700">
    <tspan fill="${GOLD}">{</tspan><tspan fill="#FAF5EE">${INITIAL}</tspan><tspan fill="${GOLD}">}</tspan>
  </text>
</svg>`;
};

const src = await readFile(path.resolve("lib/asciiPortrait.ts"), "utf8");
const portrait = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1));

/* Portrait block on the right of the card: 120 cols squeezed to fit. */
const PW = 470;
const cw = PW / portrait[0].length;
const lh = (630 + 40) / portrait.length;
const asciiSvg = portrait
  .map((row, y) => {
    const spans = [...row]
      .map((c) => {
        if (c === " ") return " ";
        const lvl = Math.max(0, RAMP.indexOf(c)) / (RAMP.length - 1);
        return `<tspan fill-opacity="${(0.2 + 0.8 * lvl ** 1.1).toFixed(2)}">${esc(c)}</tspan>`;
      })
      .join("");
    return `<text x="0" y="${(y * lh).toFixed(1)}" textLength="${PW}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${spans}</text>`;
  })
  .join("\n");

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="${BG}" stop-opacity="1"/>
      <stop offset="0.25" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="40%" r="55%">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(700,${lh * 0.6 - 10})" font-family="${MONO}" font-size="${(cw * 1.7).toFixed(2)}" font-weight="700" fill="${INK}">
${asciiSvg}
  </g>
  <rect x="680" width="200" height="630" fill="url(#fade)"/>
  <text x="72" y="98" font-family="${MONO}" font-size="44" font-weight="700"><tspan fill="${GOLD}">{</tspan><tspan fill="#FAF5EE">${INITIAL}</tspan><tspan fill="${GOLD}">}</tspan></text>
  <text x="180" y="90" font-family="${MONO}" font-size="16" fill="${INK3}" letter-spacing="3">SDE · KEYUTECH · MERN + FLUTTER</text>
  <text x="72" y="218" font-family="${MONO}" font-size="16" fill="${GOLD}" letter-spacing="4">FULL-STACK SOFTWARE ENGINEER</text>
  <text x="68" y="318" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="${INK}">${NAME_FIRST}</text>
  <text x="68" y="408" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-style="italic" fill="${GOLD}">${NAME_LAST}</text>
  <text x="72" y="470" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${INK}" fill-opacity="0.82">Fintech web apps, real-time systems &amp;</text>
  <text x="72" y="504" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${INK}" fill-opacity="0.82">cross-platform mobile — shipped to production.</text>
  <text x="72" y="578" font-family="${MONO}" font-size="16" fill="${INK3}" letter-spacing="1">${esc(DOMAIN)}</text>
</svg>`;

await sharp(Buffer.from(icon(512))).png().toFile("app/icon.png");
await sharp(Buffer.from(icon(512))).resize(180, 180).png().toFile("app/apple-icon.png");
const cardBuf = await sharp(Buffer.from(card)).jpeg({ quality: 90 }).toBuffer();
await sharp(cardBuf).toFile("app/opengraph-image.jpeg");
await sharp(cardBuf).toFile("app/twitter-image.jpeg");
console.log("wrote app/icon.png, app/apple-icon.png, app/opengraph-image.jpeg, app/twitter-image.jpeg");
