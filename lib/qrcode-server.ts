import QRCode from 'qrcode';
import { createClient } from '@/lib/supabase/server';

/**
 * Generate a QR code for a ticket order, upload the PNG to Supabase Storage,
 * and return the public URL.
 *
 * Why upload instead of returning a base64 data URL? Gmail and most major
 * email clients refuse to render `data:` URI images, leaving customers with
 * a broken-image icon in their confirmation email. A real https URL renders
 * everywhere.
 *
 * Server-only: imports the Supabase server client which uses next/headers.
 */
export async function generateTicketQRCode(orderId: string, eventId: string): Promise<string> {
  const qrData = JSON.stringify({
    type: 'sunset_series_ticket',
    orderId,
    eventId,
    timestamp: Date.now(),
  });

  let buffer: Buffer;
  try {
    buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      width: 400,
      color: {
        dark: '#002E5C',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }

  // Path-safe: free-registration orderIds use the format CONCERT:uuid:nanoid
  // which contains colons that aren't valid in storage paths.
  const safeOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const storagePath = `qr-codes/${eventId}/${safeOrderId}.png`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from('event-images')
    .upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading QR code to storage:', uploadError);
    throw new Error(`Failed to upload QR code: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('event-images').getPublicUrl(storagePath);
  return data.publicUrl;
}
