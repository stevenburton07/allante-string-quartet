/**
 * Ticket pricing and promo/comp code resolution.
 *
 * Events store the full ticket_price (in cents) plus an optional
 * `discount_code` and the `discount_percent` it is worth. The discounted price
 * is never stored — it is derived here so the price quoted in the purchase
 * form and the price charged by Stripe can never drift apart.
 *
 * Intentionally dependency-free: this is imported by client components, so it
 * must not pull in the Stripe SDK or anything server-only.
 */

/** Stripe rejects card charges below $0.50 USD. */
export const STRIPE_MINIMUM_CHARGE = 50;

/** Discount amounts offered in the admin forms. */
export const DISCOUNT_OPTIONS = [
  { value: 0, label: 'No discount' },
  { value: 10, label: '10% off' },
  { value: 20, label: '20% off' },
  { value: 25, label: '25% off' },
  { value: 50, label: '50% off' },
  { value: 75, label: '75% off' },
] as const;

/**
 * The price a buyer actually pays, in cents.
 *
 * Rounds to the nearest cent, and refuses to produce a price Stripe would
 * reject: if the discount would land under the $0.50 minimum, the discount is
 * held at that floor (or dropped entirely when the full price is already
 * below it).
 */
export function getEffectivePrice(
  basePriceCents: number,
  discountPercent?: number | null
): number {
  const base = Math.round(basePriceCents || 0);
  const percent = Math.min(Math.max(Math.round(discountPercent || 0), 0), 100);

  if (base <= 0 || percent <= 0) return base;

  const discounted = Math.round(base * (1 - percent / 100));

  if (discounted < STRIPE_MINIMUM_CHARGE) {
    return Math.min(base, STRIPE_MINIMUM_CHARGE);
  }

  return discounted;
}

/**
 * Whether a discount actually lowers the price — i.e. it survived the rounding
 * and minimum-charge rules above. Use this rather than `percent > 0` alone.
 */
export function hasDiscount(
  basePriceCents: number,
  discountPercent?: number | null
): boolean {
  return getEffectivePrice(basePriceCents, discountPercent) < Math.round(basePriceCents || 0);
}

/** Format cents as `$12.34`. */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * What a code the buyer typed turns out to be.
 * - `none`     — they left the box empty
 * - `comp`     — a complimentary code; the ticket is free and skips Stripe
 * - `discount` — a promo code; still paid, at `percent` off
 * - `invalid`  — matched nothing usable
 */
export type CodeKind = 'none' | 'comp' | 'discount' | 'invalid';

export interface CodeResolution {
  kind: CodeKind;
  /** Percent off for a discount code; 0 otherwise. */
  percent: number;
  /** Per-ticket price in cents once the code is applied. */
  unitPrice: number;
}

/** The event fields code resolution needs, from either table. */
export interface CodeBearingEvent {
  ticket_price: number;
  comp_code?: string | null;
  discount_code?: string | null;
  discount_percent?: number | null;
}

function normalize(code: string | null | undefined): string {
  return (code || '').trim().toUpperCase();
}

/**
 * Decide what a submitted code does for a given event.
 *
 * Comp codes are checked first, so if an event is ever configured with the
 * same string for both, the free ticket wins. Callers must run this on the
 * server before charging — the client copy is only there to quote a total.
 */
export function resolveCode(
  code: string | null | undefined,
  event: CodeBearingEvent
): CodeResolution {
  const submitted = normalize(code);
  const basePrice = Math.round(event.ticket_price || 0);

  if (!submitted) {
    return { kind: 'none', percent: 0, unitPrice: basePrice };
  }

  if (normalize(event.comp_code) && submitted === normalize(event.comp_code)) {
    return { kind: 'comp', percent: 0, unitPrice: 0 };
  }

  const percent = event.discount_percent || 0;
  if (
    normalize(event.discount_code) &&
    submitted === normalize(event.discount_code) &&
    percent > 0
  ) {
    return {
      kind: 'discount',
      percent,
      unitPrice: getEffectivePrice(basePrice, percent),
    };
  }

  return { kind: 'invalid', percent: 0, unitPrice: basePrice };
}
