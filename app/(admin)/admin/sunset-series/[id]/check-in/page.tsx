'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRScanner, { QRScannerHandle } from '@/components/admin/QRScanner';
import Button from '@/components/ui/Button';
import { parseTicketQRCode } from '@/lib/qrcode';
import { formatSunsetRange, formatEventDate } from '@/lib/format-time';

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkInResult, setCheckInResult] = useState<{
    status: 'success' | 'already' | 'error';
    message: string;
    order?: any;
  } | null>(null);
  const [checkInCount, setCheckInCount] = useState(0);
  const scannerRef = useRef<QRScannerHandle>(null);

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/admin/sunset-series/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleContinue = () => {
    setCheckInResult(null);
    scannerRef.current?.resume();
  };

  const handleScan = async (qrData: string) => {
    setCheckInResult(null);

    // Parse QR code
    const parsed = parseTicketQRCode(qrData);

    if (!parsed) {
      setCheckInResult({
        status: 'error',
        message: 'Invalid QR code. This is not a valid Sunset Series ticket.',
      });
      return;
    }

    // Verify event matches
    if (parsed.eventId !== id) {
      setCheckInResult({
        status: 'error',
        message: 'This ticket is for a different event.',
      });
      return;
    }

    // Check in the ticket
    try {
      const response = await fetch('/api/admin/sunset-series/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: parsed.orderId,
          eventId: parsed.eventId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCheckInResult({
          status: 'success',
          message: `${result.order.customer_name} — ${result.order.ticket_quantity} ticket(s)`,
          order: result.order,
        });
        setCheckInCount((prev) => prev + 1);
      } else if (result.order?.checked_in) {
        // Valid ticket that was already scanned — not a real problem, just a duplicate.
        const time = new Date(result.order.checked_in_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        setCheckInResult({
          status: 'already',
          message: `${result.order.customer_name} — first checked in at ${time}`,
          order: result.order,
        });
      } else {
        setCheckInResult({
          status: 'error',
          message: result.error || 'Check-in failed.',
        });
      }
    } catch (error) {
      console.error('Error checking in:', error);
      setCheckInResult({
        status: 'error',
        message: 'Network error. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
      <div>
        <Link
          href={`/admin/sunset-series/${id}/orders`}
          className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-2 text-sm inline-flex items-center mb-4"
        >
          ← Back to orders
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2">Check-in: {event.title}</h1>
        <p className="text-gray-600">
          {formatEventDate(event.event_date, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
          {' · '}
          {formatSunsetRange(event.event_time, event.sunset_end_time)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">Scan ticket QR code</h2>
          {checkInCount > 0 && (
            <span className="text-sm font-semibold text-gray-600">
              {checkInCount} checked in
            </span>
          )}
        </div>
        {/* Hide the live camera while a result is shown so the operator focuses on Continue */}
        <div className={checkInResult ? 'hidden' : ''}>
          <QRScanner ref={scannerRef} onScan={handleScan} />
        </div>

        {checkInResult && (
          <div
            className={`rounded-lg p-6 text-center ${
              checkInResult.status === 'success'
                ? 'bg-green-50 border border-green-200'
                : checkInResult.status === 'already'
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className="text-5xl mb-3">
              {checkInResult.status === 'success'
                ? '✓'
                : checkInResult.status === 'already'
                ? '⚠️'
                : '✕'}
            </p>
            <p
              className={`text-xl font-bold mb-1 ${
                checkInResult.status === 'success'
                  ? 'text-green-800'
                  : checkInResult.status === 'already'
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}
            >
              {checkInResult.status === 'success'
                ? 'Checked in'
                : checkInResult.status === 'already'
                ? 'Already checked in'
                : 'Not checked in'}
            </p>
            <p
              className={`text-base mb-6 ${
                checkInResult.status === 'success'
                  ? 'text-green-700'
                  : checkInResult.status === 'already'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {checkInResult.message}
            </p>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
