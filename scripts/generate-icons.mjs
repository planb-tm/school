import sharp from 'sharp';
import { mkdirSync } from 'fs';

const bg = '#C9B8FF';
const ink = '#20212A';

/** Lavender squircle with bold “B.” matching the in-app BrandMark. */
function makeSvg(size, { rounded = true, safePad = 0 } = {}) {
  const content = size - safePad * 2;
  const rx = rounded ? Math.round(size * 0.223) : 0;
  const fontSize = Math.round(content * 0.5);
  const letterX = size / 2 - content * 0.06;
  const baseline = size / 2 + fontSize * 0.35;
  const dotR = Math.max(2, Math.round(fontSize * 0.085));
  const dotX = letterX + fontSize * 0.42;
  const dotY = baseline - dotR * 0.15;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${bg}"/>
  <text x="${letterX}" y="${baseline}" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" fill="${ink}">B</text>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="${ink}"/>
</svg>`;
}

async function writePng(path, size, opts) {
  const svg = Buffer.from(makeSvg(size, opts));
  await sharp(svg).png().toFile(path);
  console.log('wrote', path, size);
}

mkdirSync('public/icons', { recursive: true });
await writePng('public/icons/icon-192.png', 192);
await writePng('public/icons/icon-512.png', 512);
await writePng('public/icons/icon-180.png', 180);
await writePng('public/apple-touch-icon.png', 180);
await writePng('public/icons/icon-512-maskable.png', 512, {
  rounded: false,
  safePad: 48,
});
