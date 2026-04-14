'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import QRScanner from '@/components/admin/QRScanner';
import { parseTicketQRCode } from '@/lib/qrcode';

export default function ConcertCheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [concert, setConcert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    message: string;
    order?: any;
  } | null>(null);
  const [checkInHistory, setCheckInHistory] = useState<any[]>([]);

  useEffect(() => {
    // Fetch concert details
    const fetchConcert = async () => {
      try {
        const response = await fetch(`/api/concerts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setConcert(data);
        }
      } catch (error) {
        console.error('Error fetching concert:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcert();
  }, [id]);

  const handleScan = async (qrData: string) => {
    setCheckInResult(null);

    // Parse QR code
    const parsed = parseTicketQRCode(qrData);

    if (!parsed) {
      setCheckInResult({
        success: false,
        message: 'Invalid QR code. This is not a valid concert ticket.',
      });
      return;
    }

    // Verify concert matches
    if (parsed.eventId !== id) {
      setCheckInResult({
        success: false,
        message: 'This ticket is for a different concert.',
      });
      return;
    }

    // Check in the ticket
    try {
      const response = await fetch('/api/admin/concerts/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: parsed.orderId,
          concertId: parsed.eventId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCheckInResult({
          success: true,
          message: `✓ Checked in successfully! ${result.order.customer_name} - ${result.order.ticket_quantity} attendee(s).`,
          order: result.order,
        });

        // Add to history
        setCheckInHistory((prev) => [result.order, ...prev]);
      } else {
        setCheckInResult({
          success: false,
          message: result.error || 'Check-in failed.',
        });
      }
    } catch (error) {
      console.error('Error checking in:', error);
      setCheckInResult({
        success: false,
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

  if (!concert) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Concert not found</p>
      </div>
    );
  }

  const concertDate = new Date(concert.date);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
      <div>
        <Link
          href={`/admin/concerts/${id}/orders`}
          className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-3 py-1.5 text-sm inline-flex items-center mb-4"
        >
          ← Back to orders
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Check-in: {concert.title}</h1>
        <p className="text-gray-600">
          {concertDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          at{' '}
          {concertDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Scan ticket QR code</h2>
        <QRScanner onScan={handleScan} />
      </div>

      {checkInResult && (
        <div
          className={`rounded-lg p-6 ${
            checkInResult.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              checkInResult.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {checkInResult.message}
          </p>
        </div>
      )}

      {checkInHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Recent check-ins ({checkInHistory.length})
          </h2>
          <div className="space-y-3">
            {checkInHistory.map((order, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {order.ticket_quantity} attendee{order.ticket_quantity !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.checked_in_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
