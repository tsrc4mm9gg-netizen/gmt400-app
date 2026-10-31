// Generuje ikony PWA z własnego wektora assets/icons/gmt400-icon.svg (bez grafik AI): node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const svg = readFileSync(new URL('../assets/icons/gmt400-icon.svg', import.meta.url));
const out = (p) => new URL('../' + p, import.meta.url).pathname;
const square = (size) => sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 });
await square(192).toFile(out('public/icon-192.png'));
await square(512).toFile(out('public/icon-512.png'));
// Apple: bez przezroczystych rogów (iOS sam zaokrągla) — pełne tło.
const flatSvg = Buffer.from(svg.toString().replace('<rect width="512" height="512" rx="112"', '<rect width="512" height="512" rx="0"'));
await sharp(flatSvg, { density: 384 }).resize(180, 180).png({ compressionLevel: 9 }).toFile(out('public/apple-touch-icon.png'));
await sharp(flatSvg, { density: 384 }).resize(180, 180).png({ compressionLevel: 9 }).toFile(out('src/app/apple-icon.png'));
// Maskable: treść w bezpiecznej strefie (~72%), pełne tło.
const inner = await sharp(svg, { density: 384 }).resize(368, 368).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#121214' } }).composite([{ input: inner, left: 72, top: 72 }]).png({ compressionLevel: 9 }).toFile(out('public/icon-maskable-512.png'));
console.log('ikony gotowe');
