import QRCode from 'qrcode';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Use the service role key for storage uploads — the anon key is blocked
// by RLS policies on the event-images bucket, and these uploads happen in
// server-side contexts without an authenticated user session.
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
export async function generateTicketQRCode(
  orderId: string,
  eventId: string,
  type: 'sunset_series_ticket' | 'concert_ticket' = 'sunset_series_ticket'
): Promise<string> {
  const qrData = JSON.stringify({
    type,
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

  const supabase = getAdminClient();
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
