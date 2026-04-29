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

    const validTypes = ['sunset_series_ticket', 'concert_ticket'];
    if (
      validTypes.includes(parsed.type) &&
      parsed.orderId &&
      (parsed.eventId || parsed.concertId) &&
      parsed.timestamp
    ) {
      return {
        type: parsed.type,
        orderId: parsed.orderId,
        eventId: parsed.eventId || parsed.concertId,
        timestamp: parsed.timestamp,
      };
    }

    return null;
  } catch {
    return null;
  }
}
