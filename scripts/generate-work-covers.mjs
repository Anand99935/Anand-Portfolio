/* Writes the 1280x720 SVG covers in public/assets/work/ used by lib/data.ts.
   The work behind them is private client code, so each cover is an
   illustrative mock in the site palette rather than a screenshot.

   Usage: node scripts/generate-work-covers.mjs
*/
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/assets/work");
const C = {
  bg: "#0D0B09",
  panel: "#161310",
  panel2: "#1F1B18",
  line: "#2B2520",
  ink: "#EDE5D8",
  ink2: "#C4B8A8",
  ink3: "#8A7D6E",
  gold: "#C9A852",
  cool: "#8FA8C4",
  green: "#AEC6A4",
  red: "#D9826B",
};
const MONO = "ui-monospace, 'JetBrains Mono', 'SFMono-Regular', Menlo, monospace";
const SANS = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const frame = (accent, title, body) => `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="80%" cy="0%" r="90%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${C.ink}" fill-opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="${C.bg}"/>
  <rect width="1280" height="720" fill="url(#dots)"/>
  <rect width="1280" height="720" fill="url(#glow)"/>
  <text x="64" y="72" font-family="${MONO}" font-size="18" fill="${C.ink3}" letter-spacing="2">${esc(title)}</text>
  <circle cx="1204" cy="66" r="6" fill="${accent}"/>
${body}
</svg>
`;

const terminal = (x, y, w, h, label, lines) => `
  <g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="16" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>
    <path d="M0 16 a16 16 0 0 1 16 -16 h${w - 32} a16 16 0 0 1 16 16 v28 h-${w} z" fill="${C.panel2}"/>
    <circle cx="26" cy="22" r="6" fill="#EF4444" fill-opacity="0.8"/>
    <circle cx="46" cy="22" r="6" fill="#EAB308" fill-opacity="0.8"/>
    <circle cx="66" cy="22" r="6" fill="#22C55E" fill-opacity="0.8"/>
    <text x="92" y="27" font-family="${MONO}" font-size="14" fill="${C.ink3}">${esc(label)}</text>
    ${lines
      .map(
        ([text, color = C.ink2], i) =>
          `<text x="28" y="${84 + i * 30}" font-family="${MONO}" font-size="17" fill="${color}" xml:space="preserve">${esc(text)}</text>`,
      )
      .join("\n    ")}
  </g>`;

/* ── 02 Real-time chat ────────────────────────────────────────────── */
const bubble = (y, text, mine, w) => {
  const x = mine ? 360 - w : 24;
  return `<rect x="${x}" y="${y}" width="${w}" height="46" rx="18" fill="${mine ? C.gold : C.panel2}" fill-opacity="${mine ? 0.9 : 1}"/>
      <text x="${x + 18}" y="${y + 29}" font-family="${SANS}" font-size="15" fill="${mine ? C.bg : C.ink}">${esc(text)}</text>`;
};
const chat = frame(
  C.gold,
  "FLUTTER · SOCKET.IO · REAL-TIME CHAT",
  `
  <g transform="translate(150,96)">
    <rect width="384" height="600" rx="44" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
    <rect x="142" y="14" width="100" height="24" rx="12" fill="${C.bg}"/>
    <g transform="translate(0,56)">
      <circle cx="48" cy="34" r="20" fill="${C.cool}" fill-opacity="0.3"/>
      <circle cx="62" cy="48" r="6" fill="${C.green}" stroke="${C.panel}" stroke-width="3"/>
      <text x="80" y="32" font-family="${SANS}" font-size="17" font-weight="600" fill="${C.ink}">Support Team</text>
      <text x="80" y="52" font-family="${SANS}" font-size="13" fill="${C.green}">● online</text>
      <line x1="0" x2="384" y1="76" y2="76" stroke="${C.line}"/>
      <g transform="translate(0,96)">
        ${bubble(0, "Hi! Is my KYC approved?", false, 230)}
        ${bubble(62, "Checking that for you 👀", true, 220)}
        ${bubble(124, "Approved ✓ just now", true, 190)}
        ${bubble(186, "Awesome, thanks!", false, 170)}
        ${bubble(248, "Anytime 🙌", true, 130)}
        <rect x="24" y="314" width="86" height="40" rx="18" fill="${C.panel2}"/>
        <circle cx="50" cy="334" r="5" fill="${C.ink3}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/></circle>
        <circle cx="67" cy="334" r="5" fill="${C.ink3}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.2s" repeatCount="indefinite"/></circle>
        <circle cx="84" cy="334" r="5" fill="${C.ink3}"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite"/></circle>
        <text x="122" y="340" font-family="${SANS}" font-size="13" fill="${C.ink3}">typing…</text>
      </g>
      <rect x="20" y="468" width="290" height="48" rx="24" fill="${C.panel2}"/>
      <text x="44" y="498" font-family="${SANS}" font-size="15" fill="${C.ink3}">Message</text>
      <circle cx="340" cy="492" r="24" fill="${C.gold}"/>
      <path d="M331 492 l20 -9 -7 9 7 9 z" fill="${C.bg}"/>
    </g>
  </g>
  ${terminal(640, 150, 560, 470, "socket.io — events", [
    ["→ connect        user:4821", C.green],
    ["← presence       { online: true }", C.ink2],
    ["← typing:start   room:support", C.gold],
    ["← message        \"Hi! Is my KYC…\"", C.ink2],
    ["→ typing:start   room:support", C.gold],
    ["→ message        \"Checking that…\"", C.ink2],
    ["→ ack            id:9f2c  12ms", C.cool],
    ["← typing:stop    room:support", C.ink3],
    ["", C.ink3],
    ["$ flutter build ipa --release", C.ink],
    ["✓ uploaded to TestFlight", C.green],
  ])}`,
);

/* ── 03 Production deployments ────────────────────────────────────── */
const infra = frame(
  C.cool,
  "DIGITALOCEAN · HOSTINGER VPS · NGINX · SSL",
  terminal(64, 104, 1152, 560, "deploy@prod-01: ~/app", [
    ["$ git pull origin main && npm ci --omit=dev", C.ink],
    ["  ✓ 412 packages installed in 18.4s", C.green],
    ["$ npm run build", C.ink],
    ["  ✓ client bundle built · 214 kB gzipped", C.green],
    ["$ pm2 reload ecosystem.config.js --update-env", C.ink],
    ["  [PM2] api   ↺ reloaded  (0 downtime)", C.cool],
    ["$ sudo nginx -t && sudo systemctl reload nginx", C.ink],
    ["  nginx: configuration file /etc/nginx/nginx.conf test is successful", C.green],
    ["$ sudo certbot renew --dry-run", C.ink],
    ["  ✓ all simulated renewals succeeded · HTTPS ok", C.green],
    ["$ curl -sI https://app.example.com | head -1", C.ink],
    ["  HTTP/2 200", C.gold],
    ["$ ▍", C.ink],
  ]),
);

/* ── 04 AI-augmented development ──────────────────────────────────── */
const diff = [
  ["@@ src/services/payments.js @@", C.cool],
  ["- const res = await fetch(url).then(r => r.json())", C.red],
  ["- if (res.status != 'ok') console.log('err')", C.red],
  ["+ const res = await api.get(url, { timeout: 8000 });", C.green],
  ["+ if (res.status !== 'ok') {", C.green],
  ["+   throw new PaymentError(res.code, res.message);", C.green],
  ["+ }", C.green],
  ["", C.ink3],
  ["✦ claude: extracted retry + typed error, added test", C.gold],
  ["✦ copilot: suggested PaymentError guard", C.gold],
  ["✓ 38 tests passed · review approved", C.green],
];
const ai = frame(
  C.gold,
  "CLAUDE CODE · COPILOT · CHATGPT · CODESPACES",
  `${terminal(64, 104, 760, 560, "review: refactor payments service", diff)}
  <g transform="translate(860,104)">
    <rect width="356" height="560" rx="16" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>
    <text x="32" y="64" font-family="${SANS}" font-size="16" fill="${C.ink3}">Time on repetitive tasks</text>
    <rect x="32" y="110" width="292" height="36" rx="8" fill="${C.panel2}"/>
    <rect x="32" y="110" width="292" height="36" rx="8" fill="${C.ink3}" fill-opacity="0.5"/>
    <text x="44" y="134" font-family="${MONO}" font-size="14" fill="${C.ink}">before</text>
    <rect x="32" y="166" width="292" height="36" rx="8" fill="${C.panel2}"/>
    <rect x="32" y="166" width="190" height="36" rx="8" fill="${C.gold}" fill-opacity="0.85"/>
    <text x="44" y="190" font-family="${MONO}" font-size="14" fill="${C.bg}">with AI</text>
    <text x="32" y="300" font-family="${SANS}" font-size="72" font-weight="700" fill="${C.gold}">30–40%</text>
    <text x="32" y="340" font-family="${SANS}" font-size="18" fill="${C.ink2}">faster on repetitive &amp;</text>
    <text x="32" y="366" font-family="${SANS}" font-size="18" fill="${C.ink2}">review-heavy work</text>
    <text x="32" y="510" font-family="${MONO}" font-size="13" fill="${C.ink3}">estimate · review-first workflow</text>
  </g>`,
);

/* ── 05 Digital India internship ──────────────────────────────────── */
const commits = [
  ["a41f2c9", "feat(ui): responsive form layout for citizen module"],
  ["7be03d1", "fix(api): handle empty response in status lookup"],
  ["c2d9e88", "feat: integrate document upload REST endpoint"],
  ["19aa7f0", "fix(ui): table overflow on small screens"],
  ["e6b1240", "test: add smoke tests for login flow"],
  ["5d0c3ab", "chore(deploy): staging build + env config"],
  ["0f8e6d2", "feat(ui): pagination for application list"],
  ["b7731c4", "fix: date formatting across modules"],
];
const intern = frame(
  C.cool,
  "DIGITAL INDIA PVT. LTD. · MAR – DEC 2024",
  `${terminal(
    64,
    120,
    1152,
    360,
    "git log --oneline --author=anand",
    commits.map(([hash, msg]) => [`${hash}  ${msg}`, msg.startsWith("fix") ? C.ink2 : C.ink]),
  )}
  <g transform="translate(64,540)">
    ${Array.from({ length: 40 }, (_, i) => {
      const h = [3, 1, 4, 2, 0, 3, 2, 4, 1, 2][i % 10];
      const op = [0.08, 0.3, 0.5, 0.75, 0.95][h];
      return `<rect x="${i * 28.8}" y="0" width="22" height="22" rx="5" fill="${C.cool}" fill-opacity="${op}"/>`;
    }).join("")}
    <text x="0" y="62" font-family="${MONO}" font-size="16" fill="${C.ink3}">~20–30 features &amp; fixes · 9 months · Agile/Scrum</text>
  </g>`,
);

/* ── 06 ASCII renderer ────────────────────────────────────────────── */
const portrait = await readFile(path.resolve("lib/asciiPortrait.ts"), "utf8").then((src) =>
  JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1)),
);
const RAMP = " .'`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
/* Only a slice of the glyph field (the shoulder/shirt band) — enough to
   show the technique without giving the portrait away in a thumbnail. */
const band = portrait.slice(58, 74).map((row) => row.slice(0, 120));
const asciiCover = frame(
  C.gold,
  "ASCII PORTRAIT RENDERER · NEXT.JS · CANVAS",
  `
  <g transform="translate(64,112)">
    <text x="0" y="0" font-family="${MONO}" font-size="16" fill="${C.ink3}">ramp</text>
    ${[...RAMP.trim()]
      .map(
        (c, i) =>
          `<text x="${60 + i * 16.4}" y="0" font-family="${MONO}" font-size="16" fill="${C.ink}" fill-opacity="${(0.15 + 0.85 * (i / RAMP.length)).toFixed(2)}">${esc(c)}</text>`,
      )
      .join("")}
  </g>
  <g transform="translate(64,170)">
    ${["photo", "mask", "CLAHE", "equalise", "glyphs", "canvas"]
      .map(
        (s, i) => `<rect x="${i * 196}" y="0" width="168" height="48" rx="24" fill="none" stroke="${i === 5 ? C.gold : C.line}" stroke-width="1.5"/>
    <text x="${i * 196 + 84}" y="30" text-anchor="middle" font-family="${MONO}" font-size="15" fill="${i === 5 ? C.gold : C.ink2}">${s}</text>
    ${i < 5 ? `<path d="M${i * 196 + 172} 24 h20" stroke="${C.ink3}" stroke-width="1.5"/>` : ""}`,
      )
      .join("\n    ")}
  </g>
  <g transform="translate(64,268)">
    ${band
      .map(
        (row, y) =>
          `<text x="0" y="${y * 24}" xml:space="preserve">${[...row]
            .map((c) => {
              const lvl = Math.max(0, RAMP.indexOf(c)) / (RAMP.length - 1);
              return c === " "
                ? " "
                : `<tspan fill="${C.ink}" fill-opacity="${(0.12 + 0.88 * lvl ** 1.5).toFixed(2)}">${esc(c)}</tspan>`;
            })
            .join("")}</text>`,
      )
      .join("\n    ")
      .replace(/<text /g, `<text font-family="${MONO}" font-size="16.6" textLength="1152" `)}
  </g>`,
);

/* ── Product covers: phone and/or browser mock carrying the product name ── */
const phone = (x, y, name, accent, rows) => `
  <g transform="translate(${x},${y})">
    <rect width="300" height="560" rx="40" fill="${C.panel}" stroke="${C.line}" stroke-width="2"/>
    <rect x="110" y="14" width="80" height="20" rx="10" fill="${C.bg}"/>
    <text x="28" y="92" font-family="${SANS}" font-size="24" font-weight="700" fill="${C.ink}">${esc(name)}</text>
    <rect x="28" y="116" width="244" height="120" rx="18" fill="${accent}" fill-opacity="0.16"/>
    <rect x="48" y="140" width="110" height="12" rx="6" fill="${accent}" fill-opacity="0.7"/>
    <rect x="48" y="170" width="170" height="26" rx="8" fill="${C.ink}" fill-opacity="0.85"/>
    ${rows
      .map(
        (label, i) => `<rect x="28" y="${262 + i * 66}" width="244" height="52" rx="14" fill="${C.panel2}"/>
    <circle cx="56" cy="${288 + i * 66}" r="12" fill="${accent}" fill-opacity="0.5"/>
    <text x="80" y="${294 + i * 66}" font-family="${SANS}" font-size="15" fill="${C.ink2}">${esc(label)}</text>`,
      )
      .join("\n    ")}
    <rect x="100" y="530" width="100" height="5" rx="3" fill="${C.ink3}"/>
  </g>`;

const browser = (x, y, w, h, domain, name, accent, cards) => `
  <g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="16" fill="${C.panel}" stroke="${C.line}" stroke-width="1.5"/>
    <path d="M0 16 a16 16 0 0 1 16 -16 h${w - 32} a16 16 0 0 1 16 16 v28 h-${w} z" fill="${C.panel2}"/>
    <circle cx="26" cy="22" r="6" fill="#EF4444" fill-opacity="0.8"/>
    <circle cx="46" cy="22" r="6" fill="#EAB308" fill-opacity="0.8"/>
    <circle cx="66" cy="22" r="6" fill="#22C55E" fill-opacity="0.8"/>
    <rect x="96" y="10" width="${Math.min(360, w - 120)}" height="24" rx="12" fill="${C.bg}"/>
    <text x="114" y="27" font-family="${MONO}" font-size="13" fill="${C.ink3}">🔒 ${esc(domain)}</text>
    <text x="40" y="112" font-family="${SANS}" font-size="20" font-weight="700" fill="${C.ink}">${esc(name)}</text>
    <rect x="${w - 170}" y="92" width="130" height="34" rx="17" fill="${accent}" fill-opacity="0.85"/>
    <rect x="40" y="168" width="${w * 0.52}" height="30" rx="8" fill="${C.ink}" fill-opacity="0.85"/>
    <rect x="40" y="212" width="${w * 0.38}" height="30" rx="8" fill="${C.ink}" fill-opacity="0.55"/>
    <rect x="40" y="266" width="${w * 0.42}" height="12" rx="6" fill="${C.ink3}" fill-opacity="0.6"/>
    <rect x="40" y="290" width="${w * 0.34}" height="12" rx="6" fill="${C.ink3}" fill-opacity="0.4"/>
    ${cards
      .map((label, i) => {
        const cw = (w - 80 - (cards.length - 1) * 20) / cards.length;
        return `<g transform="translate(${40 + i * (cw + 20)},${h - 150})">
      <rect width="${cw}" height="110" rx="14" fill="${C.panel2}" stroke="${C.line}"/>
      <rect x="18" y="20" width="28" height="28" rx="8" fill="${accent}" fill-opacity="0.35"/>
      <text x="18" y="84" font-family="${SANS}" font-size="15" fill="${C.ink2}">${esc(label)}</text>
    </g>`;
      })
      .join("\n    ")}
  </g>`;

const mypursu = frame(
  C.cool,
  "MYPURSU · UPI PAYMENTS · FLUTTER APP + WEB",
  `${phone(72, 120, "MyPursu", C.cool, ["Scan & pay UPI", "Merchant wallet", "Rewards", "Agents"])}
  ${browser(420, 120, 796, 560, "mypursu.com", "MyPursu", C.cool, ["UPI payments", "Promotions", "Rewards wallet"])}`,
);
const mypursuBusiness = frame(
  C.gold,
  "BUSINESS.MYPURSU.COM · US ⇄ INDIA SERVICES",
  browser(64, 110, 1152, 570, "business.mypursu.com", "MyPursu Business", C.gold, [
    "UPI & bills",
    "Travel",
    "Pack & Ship",
    "Virtual mailbox",
    "Concierge",
  ]),
);
const coinyodha = frame(
  C.cool,
  "COINYODHA · FLUTTER APP + WEB",
  `${browser(64, 120, 796, 560, "coinyodha.com", "CoinYodha", C.cool, ["Web app", "REST APIs", "Responsive UI"])}
  ${phone(908, 120, "CoinYodha", C.cool, ["Home", "Explore", "Activity", "Profile"])}`,
);
const parchoon = frame(
  C.gold,
  "PARCHOON · FLUTTER MOBILE APP",
  `${phone(330, 120, "Parchoon", C.gold, ["Home", "Search", "Notifications", "Profile"])}
  ${phone(650, 120, "Parchoon", C.gold, ["iOS · TestFlight", "Android", "REST APIs", "Notifications"])}`,
);
const keyutechWeb = frame(
  C.cool,
  "KEYUTECH.COM · COMPANY WEBSITE",
  browser(64, 110, 1152, 570, "keyutech.com", "Keyutech", C.cool, [
    "Web & mobile dev",
    "Quality assurance",
    "Automation360",
    "MyPursu",
  ]),
);
const avanti = frame(
  C.gold,
  "AVANTI TECH · WEB APPLICATION",
  browser(64, 110, 1152, 570, "avanti tech", "Avanti Tech", C.gold, ["React UI", "REST APIs", "Nginx + SSL"]),
);

await mkdir(OUT, { recursive: true });
const files = {
  "mypursu.svg": mypursu,
  "mypursu-business.svg": mypursuBusiness,
  "coinyodha.svg": coinyodha,
  "parchoon.svg": parchoon,
  "keyutech-web.svg": keyutechWeb,
  "avanti-tech.svg": avanti,
  "realtime-chat.svg": chat,
  "production-infra.svg": infra,
  "ai-workflow.svg": ai,
  "digital-india.svg": intern,
  "ascii-portrait.svg": asciiCover,
};
for (const [name, svg] of Object.entries(files)) {
  await writeFile(path.join(OUT, name), svg);
  console.log("wrote", name);
}
