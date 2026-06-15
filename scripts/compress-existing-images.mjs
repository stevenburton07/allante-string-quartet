/**
 * One-off cleanup: downscale + recompress oversized images already sitting in the
 * Supabase `event-images` bucket. New uploads are resized in the browser before
 * upload (see lib/image-resize.ts); this brings the back catalogue down to the
 * same budget.
 *
 * Each image is re-uploaded to its EXISTING key in its EXISTING format, so public
 * URLs never change and no concert/event rows need updating. QR codes (stored
 * under the qr-codes/ prefix) are skipped — they must stay pixel-perfect.
 *
 * Usage:
 *   node scripts/compress-existing-images.mjs --dry-run   # report what would change
 *   node scripts/compress-existing-images.mjs             # do it
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// --- minimal .env.local loader (no dotenv dependency) ---
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const DRY_RUN = process.argv.includes('--dry-run');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = 'event-images';
const SKIP_PREFIX = 'qr-codes/'; // QR images live here — never touch them
const MAX_WIDTH = 1920;
const SIZE_BUDGET = 400 * 1024; // recompress anything heavier than this
const QUALITY = 82;
const EXT_RE = /\.(jpe?g|png|webp)$/i;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CONTENT_TYPE = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/** Recursively collect every file under the bucket as { key, size }. */
async function listAllFiles(prefix = '') {
  const files = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw new Error(`list ${BUCKET}/${prefix}: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const entry of data) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      // Folders come back with a null id; recurse into them.
      if (entry.id === null) {
        files.push(...(await listAllFiles(full)));
      } else {
        files.push({ key: full, size: entry.metadata?.size ?? 0 });
      }
    }
    if (data.length < 100) break;
    offset += data.length;
  }
  return files;
}

/** Recompress a buffer with sharp, re-encoding in its original format. */
async function recompress(buffer, ext) {
  const img = sharp(buffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (ext === 'png') return img.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer();
  if (ext === 'webp') return img.webp({ quality: QUALITY }).toBuffer();
  return img.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
}

function fmt(n) {
  return n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(2)} MB`;
}

async function main() {
  console.log(DRY_RUN ? 'DRY RUN — no uploads will happen\n' : 'Compressing existing images…\n');

  const files = await listAllFiles();
  let scanned = 0;
  let changed = 0;
  let savedBytes = 0;

  for (const { key, size } of files) {
    if (key.startsWith(SKIP_PREFIX) || !EXT_RE.test(key)) continue;
    scanned++;
    const ext = key.split('.').pop().toLowerCase();

    // Decide from the authoritative list metadata size — Supabase's download()
    // endpoint can serve a stale cached copy, which would make re-runs loop.
    if (size <= SIZE_BUDGET) continue;

    const { data, error } = await supabase.storage.from(BUCKET).download(key);
    if (error || !data) {
      console.log(`  ! ${key}: download failed`);
      continue;
    }
    const original = Buffer.from(await data.arrayBuffer());
    const meta = await sharp(original).metadata();

    let out;
    try {
      out = await recompress(original, ext);
    } catch (e) {
      console.log(`  ! ${key}: sharp failed (${e.message})`);
      continue;
    }

    // Only re-upload for a meaningful win (≥10% smaller). Files already near the
    // budget would otherwise churn on every run for a few KB.
    if (out.length > original.length * 0.9) continue;

    const delta = original.length - out.length;
    savedBytes += delta;
    changed++;
    console.log(
      `  ${DRY_RUN ? 'would shrink' : 'shrank'} ${key}  ` +
        `${meta.width}px ${fmt(original.length)} → ${fmt(out.length)}  (-${fmt(delta)})`
    );

    if (!DRY_RUN) {
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(key, out, { contentType: CONTENT_TYPE[ext], upsert: true });
      if (upErr) console.log(`  ! ${key}: upload failed (${upErr.message})`);
    }
  }

  console.log(
    `\n${DRY_RUN ? 'Would process' : 'Processed'} ${changed}/${scanned} images. ` +
      `Total saved: ${fmt(savedBytes)}.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
