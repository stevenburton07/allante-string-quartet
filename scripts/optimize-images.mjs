import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'fs';
import path from 'path';

const DIR = path.resolve('public/images');

// filename -> max width (height auto). Landscape heroes 2560, portraits 1280.
const TARGETS = {
  'hero-background.JPG': 2560,
  'about.JPG': 2560,
  'contact-us.JPG': 2560,
  'donate.JPG': 1600,        // portrait hero
  'thank-you.jpg': 2560,
  'rachel.jpeg': 1280,
  'kristi.JPG': 1280,
  'bonnie.JPG': 1280,
  'alli.JPG': 1280,
  'logo.jpg': 1600,
};

const QUALITY = 82;
let before = 0, after = 0;

for (const [file, width] of Object.entries(TARGETS)) {
  const fp = path.join(DIR, file);
  const orig = statSync(fp).size;
  const input = readFileSync(fp);
  const out = await sharp(input)
    .rotate()                                  // bake in EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  writeFileSync(fp, out);
  before += orig; after += out.length;
  const pct = ((1 - out.length / orig) * 100).toFixed(0);
  console.log(
    `${file.padEnd(28)} ${(orig / 1e6).toFixed(1)}MB -> ${(out.length / 1e6).toFixed(2)}MB  (-${pct}%)`
  );
}

console.log(
  `\nTOTAL ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB  ` +
  `(-${((1 - after / before) * 100).toFixed(0)}%)`
);
