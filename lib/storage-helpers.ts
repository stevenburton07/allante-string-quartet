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
