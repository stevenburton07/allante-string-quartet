'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { loadStripe } from '@stripe/stripe-js';

interface TicketPurchaseFormProps {
  eventId: string;
  eventTitle: string;
  ticketPrice: number; // in cents
  maxTickets: number;
  ticketsSold: number;
}

export default function TicketPurchaseForm({
  eventId,
  eventTitle,
  ticketPrice,
  maxTickets,
  ticketsSold,
}: TicketPurchaseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const availableTickets = maxTickets - ticketsSold;
  const totalPrice = (ticketPrice * quantity) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate Stripe is configured
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe is not configured. Please contact support.');
      }

      // Create checkout session
      const response = await fetch('/api/sunset-series/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
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
        // Fallback: use Stripe.js to redirect
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (err: any) {
      console.error('Error purchasing tickets:', err);
      setError(err.message || 'Failed to purchase tickets. Please try again.');
      setLoading(false);
    }
  };

  if (availableTickets === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">Sold Out</p>
        <p className="text-red-600 text-sm">All tickets for this event have been sold.</p>
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

      {/* Ticket Availability */}
      <div className="bg-light-blue/20 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>{availableTickets}</strong> of <strong>{maxTickets}</strong> tickets remaining
        </p>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Tickets *
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {Array.from({ length: Math.min(availableTickets, 10) }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'ticket' : 'tickets'} - ${((ticketPrice * num) / 100).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
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
          Email Address *
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
          Your ticket confirmation will be sent to this email
        </p>
      </div>

      {/* Customer Phone */}
      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number (Optional)
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

      {/* Total */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
        {loading ? 'Processing...' : 'Purchase Tickets'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment processing by Stripe. You'll receive your tickets and event location details
        via email after payment.
      </p>
    </form>
  );
}
