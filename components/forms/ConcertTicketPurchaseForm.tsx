'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { loadStripe } from '@stripe/stripe-js';

interface ConcertTicketPurchaseFormProps {
  concertId: string;
  concertTitle: string;
  ticketPrice: number; // in cents
  maxAttendees: number;
  attendeesCount: number;
}

export default function ConcertTicketPurchaseForm({
  concertId,
  concertTitle,
  ticketPrice,
  maxAttendees,
  attendeesCount,
}: ConcertTicketPurchaseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [compCode, setCompCode] = useState('');

  const availableSeats = maxAttendees - attendeesCount;
  const isFree = ticketPrice === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For paid concerts without comp code, use Stripe
      const hasCompCode = compCode.trim().length > 0;

      if (!isFree && !hasCompCode) {
        // Paid concert, no comp code - use Stripe
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Stripe is not configured. Please contact support.');
        }

        const response = await fetch('/api/concerts/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            concertId,
            quantity,
            customerName,
            customerEmail,
            customerPhone,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create checkout session');
        }

        const { sessionId, url } = await response.json();

        // Redirect to Stripe Checkout
        if (url) {
          window.location.href = url;
        } else {
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
          if (!stripe) {
            throw new Error('Failed to load Stripe');
          }
          const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
          if (stripeError) {
            throw new Error(stripeError.message);
          }
        }
      } else {
        // Free concert or comp code - register directly
        const response = await fetch('/api/concerts/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            concertId,
            quantity,
            customerName,
            customerEmail,
            customerPhone,
            compCode: compCode.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to register for concert');
        }

        // Redirect to success page
        window.location.href = `/concerts/success?concert_id=${concertId}`;
      }
    } catch (err: any) {
      console.error('Error registering for concert:', err);
      setError(err.message || 'Failed to register. Please try again.');
      setLoading(false);
    }
  };

  if (availableSeats === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">Sold Out</p>
        <p className="text-red-600 text-sm">All seats for this concert have been reserved.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Seat Availability */}
      <div className="bg-light-blue/20 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>{availableSeats}</strong> of <strong>{maxAttendees}</strong> seats remaining
        </p>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Number of {isFree ? 'seats' : 'tickets'} *
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {Array.from({ length: Math.min(availableSeats, 10) }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? (isFree ? 'seat' : 'ticket') : (isFree ? 'seats' : 'tickets')}
              {!isFree && ` - $${((ticketPrice * num) / 100).toFixed(2)}`}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Full name *
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="John Doe"
        />
      </div>

      {/* Customer Email */}
      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email address *
        </label>
        <input
          type="email"
          id="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="john@example.com"
        />
        <p className="mt-1.5 text-sm text-gray-500">
          Your confirmation will be sent to this email
        </p>
      </div>

      {/* Customer Phone */}
      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone number (optional)
        </label>
        <input
          type="tel"
          id="customerPhone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Comp Code */}
      {!isFree && (
        <div>
          <label htmlFor="compCode" className="block text-sm font-medium text-gray-700 mb-2">
            Comp code (optional)
          </label>
          <input
            type="text"
            id="compCode"
            value={compCode}
            onChange={(e) => setCompCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter comp code"
          />
          <p className="mt-1.5 text-sm text-gray-500">
            If you have a complimentary ticket code, enter it here for free admission
          </p>
        </div>
      )}

      {/* Total */}
      {!isFree && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${((ticketPrice * quantity) / 100).toFixed(2)}
            </span>
          </div>
          {compCode.trim() && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Comp code will be validated at checkout
            </p>
          )}
        </div>
      )}

      {isFree && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold text-center">
            ✓ Free admission
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
        {loading ? (
          'Processing...'
        ) : isFree ? (
          'Reserve Seats'
        ) : compCode.trim() ? (
          'Validate Code & Register'
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Purchase Tickets
          </>
        )}
      </Button>

      {!isFree && (
        <p className="text-xs text-gray-500 text-center">
          {compCode.trim()
            ? 'Your comp code will be validated. If invalid, payment will be required.'
            : 'Secure payment processing by Stripe. You\'ll receive your confirmation via email after payment.'
          }
        </p>
      )}

      {isFree && (
        <p className="text-xs text-gray-500 text-center">
          You'll receive your confirmation and QR code via email immediately.
        </p>
      )}
    </form>
  );
}
