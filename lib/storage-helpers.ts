import { createClient } from '@/lib/supabase/server';

/**
 * Extract filename from Supabase storage URL
 */
export function getFileNameFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    const urlParts = url.split('/event-images/');
    if (urlParts.length < 2) return null;

    return urlParts[1];
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return true;

  const fileName = getFileNameFromUrl(imageUrl);
  if (!fileName) return true;

  try {
    const supabase = await createClient();
    const { error } = await supabase.storage
      .from('event-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image from storage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Delete every QR code stored under qr-codes/{eventId}/ in the event-images
 * bucket. Used by the admin "clean up old QR codes" maintenance action once
 * an event has passed and the QRs are no longer needed for check-in.
 */
export async function deleteQRCodesForEvent(eventId: string): Promise<number> {
  const supabase = await createClient();

  const { data: files, error: listError } = await supabase.storage
    .from('event-images')
    .list(`qr-codes/${eventId}`);

  if (listError) {
    console.error(`Error listing QR codes for event ${eventId}:`, listError);
    return 0;
  }

  if (!files || files.length === 0) {
    return 0;
  }

  const paths = files.map((f) => `qr-codes/${eventId}/${f.name}`);
  const { error: removeError } = await supabase.storage
    .from('event-images')
    .remove(paths);

  if (removeError) {
    console.error(`Error removing QR codes for event ${eventId}:`, removeError);
    return 0;
  }

  return paths.length;
}
