#!/usr/bin/env node

/**
 * Generate Open Graph image (1200x630) and Apple Touch Icon (180x180)
 * for the Tolka developer documentation site.
 *
 * Usage: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

const TEAL = '#0D9488';
const GRAY = '#6B7280';
const WHITE = '#FFFFFF';

// ---------------------------------------------------------------------------
// 1. Open Graph image (1200 x 630)
// ---------------------------------------------------------------------------

function buildOgSvg() {
  const W = 1200;
  const H = 630;

  // Waveform bars — original logo coords (viewBox 0 0 120 32):
  //   bar1: x=3  y=10 w=3.5 h=12  rx=1.75
  //   bar2: x=9  y=5  w=3.5 h=22  rx=1.75
  //   bar3: x=15 y=12 w=3.5 h=8   rx=1.75
  //
  // We scale them up 8x and center horizontally in the canvas.
  // The three bars span x=3..18.5 in logo space → 15.5 logo units wide.
  // Scaled width = 15.5 * 8 = 124px.  Center offset = (1200 - 124) / 2 = 538.
  const S = 8; // scale factor
  const barGroupWidth = 15.5 * S; // 124
  const offsetX = (W - barGroupWidth) / 2;
  const offsetY = 160; // vertical start for the bars

  const bar = (x, y, w, h, rx) =>
    `<rect x="${offsetX + x * S}" y="${offsetY + y * S}" width="${w * S}" height="${h * S}" rx="${rx * S}" fill="${TEAL}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${WHITE}"/>

  <!-- Waveform bars (scaled 8x, centered) -->
  ${bar(3, 10, 3.5, 12, 1.75)}
  ${bar(9, 5, 3.5, 22, 1.75)}
  ${bar(15, 12, 3.5, 8, 1.75)}

  <!-- "tolka" wordmark -->
  <text x="${W / 2}" y="${offsetY + 32 * S + 60}"
        font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
        font-size="72" font-weight="700" fill="#1E293B" text-anchor="middle">
    tolka
  </text>

  <!-- "Developer Documentation" subtitle -->
  <text x="${W / 2}" y="${offsetY + 32 * S + 110}"
        font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
        font-size="30" font-weight="400" fill="${GRAY}" text-anchor="middle">
    Developer Documentation
  </text>

  <!-- Tagline at bottom -->
  <text x="${W / 2}" y="${H - 40}"
        font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="${GRAY}" text-anchor="middle">
    Medical Translation API
  </text>

  <!-- Teal accent bar at the very bottom -->
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${TEAL}"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. Apple Touch Icon (180 x 180) — circular teal background with white bars
// ---------------------------------------------------------------------------

function buildTouchIconSvg() {
  const SIZE = 180;

  // Original favicon bars in a 32x32 viewBox:
  //   bar1: x=7  y=11  w=4 h=10 rx=2
  //   bar2: x=14 y=7   w=4 h=18 rx=2
  //   bar3: x=21 y=13  w=4 h=6  rx=2
  //
  // Scale from 32 to 180 → factor = 180/32 = 5.625
  const S = SIZE / 32;

  const bar = (x, y, w, h, rx) =>
    `<rect x="${x * S}" y="${y * S}" width="${w * S}" height="${h * S}" rx="${rx * S}" fill="${WHITE}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="${TEAL}"/>
  ${bar(7, 11, 4, 10, 2)}
  ${bar(14, 7, 4, 18, 2)}
  ${bar(21, 13, 4, 6, 2)}
</svg>`;
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

async function main() {
  const ogSvg = buildOgSvg();
  const touchSvg = buildTouchIconSvg();

  const ogPath = path.join(publicDir, 'og-image.png');
  const touchPath = path.join(publicDir, 'apple-touch-icon.png');

  await Promise.all([
    sharp(Buffer.from(ogSvg))
      .png()
      .toFile(ogPath)
      .then((info) => console.log(`Created ${ogPath}  (${info.width}x${info.height}, ${info.size} bytes)`)),

    sharp(Buffer.from(touchSvg))
      .png()
      .toFile(touchPath)
      .then((info) => console.log(`Created ${touchPath}  (${info.width}x${info.height}, ${info.size} bytes)`)),
  ]);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
