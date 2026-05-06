import Stripe from 'stripe';

// Lazily initialize Stripe per-request. On Cloudflare Workers (with
// OpenNext), process.env is populated lazily — a top-level constant
// captured during cold start can be null even when the secret is set.
// Use fetch-based HTTP client because Stripe's default Node client
// doesn't work reliably on Workers even with nodejs_compat.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key
    ? new Stripe(key, {
        apiVersion: '2026-02-25.clover',
        httpClient: Stripe.createFetchHttpClient(),
      })
    : null;
}

/** @deprecated Use getStripe() — this captures the key at module load time. */
export const stripe = getStripe();

// Stripe publishable key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return Boolean(stripe && STRIPE_PUBLISHABLE_KEY);
}

// Donation amounts (in cents)
export const SUGGESTED_AMOUNTS = [
  { label: '$25', value: 2500 },
  { label: '$50', value: 5000 },
  { label: '$100', value: 10000 },
  { label: '$250', value: 25000 },
];

// Format cents to dollars
export function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Parse dollar string to cents
export function parseDollarsTocents(dollars: string): number {
  const cleaned = dollars.replace(/[^0-9.]/g, '');
  const amount = parseFloat(cleaned);
  return Math.round(amount * 100);
}

// Sunset Series ticket price (in cents)
export const TICKET_PRICE = parseInt(process.env.TICKET_PRICE || '2000', 10);
