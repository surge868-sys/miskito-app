// Generates the app icons (an orange orb on cream) as PNGs without any deps.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
};

function png(size, pixel) {
  const row = size * 4 + 1;
  const raw = Buffer.alloc(row * size);
  for (let y = 0; y < size; y++) {
    raw[y * row] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x + 0.5, y + 0.5);
      raw.set([r, g, b, a], y * row + 1 + x * 4);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const cream = hex("#fdf6e7");
const top = hex("#ffd58f");
const mid = hex("#ff9b5c");
const bottom = hex("#f2794a");
const lav = hex("#c9a6f2");

function orb(size, radiusRatio, transparentBg) {
  const c = size / 2;
  const r = size * radiusRatio;
  return (x, y) => {
    const d = Math.hypot(x - c, y - c);
    const edge = Math.min(1, Math.max(0, r + 0.75 - d) / 1.5);
    const t = Math.min(1, Math.max(0, (x + y) / (2 * size)));
    let col = t < 0.5 ? lerp(top, mid, t * 2) : lerp(mid, bottom, (t - 0.5) * 2);
    const corner = Math.min(1, Math.max(0, (1.3 - (0.85 * (x - c)) / r - (0.5 * (y - c)) / r) / 0.8));
    col = lerp(lav, col, corner);
    if (edge <= 0) return transparentBg ? [0, 0, 0, 0] : [...cream, 255];
    if (transparentBg) return [...col, Math.round(edge * 255)];
    return [...lerp(cream, col, edge), 255];
  };
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", png(192, orb(192, 0.36, false)));
writeFileSync("public/icons/icon-512.png", png(512, orb(512, 0.36, false)));
writeFileSync("public/icons/maskable-512.png", png(512, orb(512, 0.28, false)));
writeFileSync("src/app/icon.png", png(64, orb(64, 0.42, true)));
writeFileSync("src/app/apple-icon.png", png(180, orb(180, 0.36, false)));
console.log("icons written");
