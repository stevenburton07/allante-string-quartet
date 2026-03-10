import QRCode from 'qrcode';

/**
 * Generate a QR code data URL for a ticket order
 * @param orderId - The unique order ID
 * @param eventId - The event ID
 * @returns Promise resolving to the QR code data URL
 */
export async function generateTicketQRCode(orderId: string, eventId: string): Promise<string> {
  // Create QR code data string with order and event information
  const qrData = JSON.stringify({
    type: 'sunset_series_ticket',
    orderId,
    eventId,
    timestamp: Date.now(),
  });

  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 400,
      color: {
        dark: '#002E5C', // Primary color
        light: '#FFFFFF',
      },
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Validate and parse QR code data
 * @param qrData - The scanned QR code data string
 * @returns Parsed QR code data or null if invalid
 */
export function parseTicketQRCode(qrData: string): {
  type: string;
  orderId: string;
  eventId: string;
  timestamp: number;
} | null {
  try {
    const parsed = JSON.parse(qrData);

    // Validate structure
    if (
      parsed.type === 'sunset_series_ticket' &&
      parsed.orderId &&
      parsed.eventId &&
      parsed.timestamp
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Generate QR code as buffer (for email attachments)
 * @param orderId - The unique order ID
 * @param eventId - The event ID
 * @returns Promise resolving to Buffer
 */
export async function generateTicketQRCodeBuffer(
  orderId: string,
  eventId: string
): Promise<Buffer> {
  const qrData = JSON.stringify({
    type: 'sunset_series_ticket',
    orderId,
    eventId,
    timestamp: Date.now(),
  });

  try {
    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      width: 400,
      color: {
        dark: '#002E5C',
        light: '#FFFFFF',
      },
    });

    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}
