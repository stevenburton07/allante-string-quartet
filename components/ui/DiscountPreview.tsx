import { formatPrice, getEffectivePrice, hasDiscount } from '@/lib/pricing';

interface DiscountPreviewProps {
  /** Full ticket price in cents. */
  basePriceCents: number;
  /** The code as typed into the admin form. */
  code: string;
  /** Percent off the code is worth. */
  percent: number;
}

/**
 * Admin-form feedback for a discount code. Says plainly what buyers will pay,
 * and calls out the half-configured states — a code with no amount, or an
 * amount with no code — that would otherwise leave a discount nobody can use.
 */
export default function DiscountPreview({ basePriceCents, code, percent }: DiscountPreviewProps) {
  const trimmed = code.trim();

  if (!trimmed && percent === 0) return null;

  const warning = (message: string) => (
    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>
  );

  if (trimmed && percent === 0) {
    return warning('Pick a discount amount, or this code won\'t do anything.');
  }

  if (!trimmed && percent > 0) {
    return warning('Add a code — without one, nobody can claim this discount.');
  }

  if (basePriceCents === 0) {
    return warning('This event is free, so there is nothing to discount.');
  }

  if (!hasDiscount(basePriceCents, percent)) {
    return warning('This ticket is too cheap to discount — card payments have a $0.50 minimum.');
  }

  return (
    <p className="mt-2 rounded-lg bg-secondary/10 px-3 py-2 text-sm text-gray-800">
      Anyone who enters <strong className="font-mono">{trimmed.toUpperCase()}</strong> pays{' '}
      <strong>{formatPrice(getEffectivePrice(basePriceCents, percent))}</strong> per ticket instead
      of {formatPrice(basePriceCents)}.
    </p>
  );
}
