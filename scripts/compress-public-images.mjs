/**
 * One-off cleanup: downscale + recompress the static images in public/images.
 *
 * Companion to compress-existing-images.mjs, which does the same job for the
 * Supabase `event-images` bucket. That script never touched public/images, so
 * these shipped at camera resolution (up to 2560px wide, 870KB) even though no
 * layout displays them that large.
 *
 * Each image is rewritten IN PLACE in its EXISTING format at its EXISTING path,
 * so no markup, import, or URL has to change.
 *
 * Usage:
 *   node scripts/compress-public-images.mjs --dry-run   # report what would change
 *   node scripts/compress-public-images.mjs             # do it
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DRY_RUN = process.argv.includes('--dry-run');

const DIR = 'public/images';
const MAX_DIMENSION = 1920; // matches compress-existing-images.mjs
const QUALITY = 82;
const MIN_GAIN = 0.1; // require a 10% saving before accepting a re-encode
const EXT_RE = /\.(jpe?g|png)$/i;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

async function main() {
  if (!fs.existsSync(DIR)) {
    console.error(`Missing directory: ${DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIR).filter((f) => EXT_RE.test(f));
  if (files.length === 0) {
    console.log('No JPEG/PNG files found.');
    return;
  }

  console.log(DRY_RUN ? '🔍 Dry run — nothing will be written\n' : '🗜  Compressing in place\n');

  let before = 0;
  let after = 0;
  let changed = 0;

  for (const file of files) {
    const filePath = path.join(DIR, file);
    const original = fs.statSync(filePath).size;
    before += original;

    const meta = await sharp(filePath).metadata();
    const oversized = Math.max(meta.width, meta.height) > MAX_DIMENSION;

    // Every file is re-encoded, not just oversized ones: /_next/image is a
    // passthrough on Cloudflare, so whatever is on disk is exactly what every
    // visitor downloads. The "no gain" guard below protects already-good files.
    const pipeline = sharp(filePath).rotate(); // respect EXIF orientation
    if (oversized) {
      pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true });
    }

    // Re-encode in the SAME format so the filename stays valid.
    const isPng = /\.png$/i.test(file);
    const buffer = await (isPng
      ? pipeline.png({ quality: QUALITY, compressionLevel: 9 })
      : pipeline.jpeg({ quality: QUALITY, mozjpeg: true })
    ).toBuffer();

    // Re-encoding a JPEG always costs a little quality, so only accept a result
    // that saves enough to be worth it. Files already well-compressed at their
    // display size land here and are left byte-for-byte alone.
    if (buffer.length >= original * (1 - MIN_GAIN)) {
      after += original;
      console.log(
        `  skip   ${file.padEnd(34)} ${kb(original).padStart(7)}  (already efficient)`
      );
      continue;
    }

    const newMeta = await sharp(buffer).metadata();
    const pct = (100 - (buffer.length / original) * 100).toFixed(0);
    console.log(
      `  ${DRY_RUN ? 'would' : 'write'}  ${file.padEnd(34)} ` +
        `${kb(original).padStart(7)} → ${kb(buffer.length).padStart(7)}  (-${pct}%)  ` +
        `${meta.width}x${meta.height} → ${newMeta.width}x${newMeta.height}`
    );

    if (!DRY_RUN) fs.writeFileSync(filePath, buffer);
    after += buffer.length;
    changed++;
  }

  console.log(
    `\n${DRY_RUN ? 'Would change' : 'Changed'} ${changed} of ${files.length} files: ` +
      `${kb(before)} → ${kb(after)} (-${(100 - (after / before) * 100).toFixed(0)}%)`
  );
  if (DRY_RUN) console.log('Re-run without --dry-run to apply.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
