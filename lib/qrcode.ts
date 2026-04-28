/**
 * Validate and parse QR code data scanned at check-in.
 *
 * Client-safe: this module has no server-only imports so it can be bundled
 * into the camera-scanner page in the admin panel. The QR _generator_ lives
 * in lib/qrcode-server.ts because it uploads to Supabase Storage.
 */
export function parseTicketQRCode(qrData: string): {
  type: string;
  orderId: string;
  eventId: string;
  timestamp: number;
} | null {
  try {
    const parsed = JSON.parse(qrData);

    if (
      parsed.type === 'sunset_series_ticket' &&
      parsed.orderId &&
      parsed.eventId &&
      parsed.timestamp
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}
