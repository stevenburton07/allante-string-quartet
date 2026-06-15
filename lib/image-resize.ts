// Browser-side image downscaling + recompression, run before upload so we never
// ship multi-megabyte phone photos to Supabase Storage. Admins shoot event
// photos on their phones (12–16MB straight off the camera) — this shrinks them
// on the way up without the user noticing, keeping storage small and page loads
// fast even before next/image optimization runs.
//
// Mirrors the static-asset budget enforced by scripts/optimize-images.mjs.

export interface ResizeOptions {
  /** Longest dimension the image is allowed to keep. Default 1920px. */
  maxWidth?: number;
  maxHeight?: number;
  /** Lossy encode quality, 0–1. Default 0.82. */
  quality?: number;
}

const PROCESSABLE = /^image\/(jpeg|png|webp)$/;

/**
 * Returns a resized/recompressed File, or the original untouched if it can't be
 * processed (unknown type, decode failure, or recompression wouldn't help). Safe
 * to call on every upload — small images pass through essentially unchanged.
 */
export async function resizeImage(
  file: File,
  opts: ResizeOptions = {}
): Promise<File> {
  const maxWidth = opts.maxWidth ?? 1920;
  const maxHeight = opts.maxHeight ?? 1920;
  const quality = opts.quality ?? 0.82;

  if (typeof document === 'undefined' || !PROCESSABLE.test(file.type)) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // can't decode — let the server deal with the original
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  // PNG/WebP may carry transparency, so re-encode those to WebP (keeps alpha,
  // compresses well); plain photos go to JPEG.
  const outType =
    file.type === 'image/png' || file.type === 'image/webp'
      ? 'image/webp'
      : 'image/jpeg';

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outType, quality)
  );
  if (!blob) return file;

  // No downscale happened and recompression didn't shrink it — keep the original.
  if (scale === 1 && blob.size >= file.size) return file;

  const ext = outType === 'image/webp' ? 'webp' : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.${ext}`, {
    type: outType,
    lastModified: Date.now(),
  });
}
