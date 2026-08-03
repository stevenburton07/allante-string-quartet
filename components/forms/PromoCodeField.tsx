'use client';

import { useState } from 'react';
import { formatPrice, type CodeResolution } from '@/lib/pricing';

/**
 * The one code box on a purchase form. It accepts both kinds of code the
 * quartet hands out — a comp code (free ticket) and a discount code
 * (percentage off) — and asks the server which one was typed, so the buyer
 * sees the real total before paying.
 *
 * The server re-checks the code at checkout. Nothing here is trusted.
 */
export function usePromoCode(eventType: 'concert' | 'sunset', eventId: string) {
  const [code, setCodeRaw] = useState('');
  const [applied, setApplied] = useState<CodeResolution | null>(null);
  const [checking, setChecking] = useState(false);
  const [codeError, setCodeError] = useState('');

  const setCode = (value: string) => {
    setCodeRaw(value.toUpperCase());
    // Editing the code invalidates whatever was applied before, so the total
    // can never show a discount for a code that is no longer in the box.
    setApplied(null);
    setCodeError('');
  };

  /**
   * Resolve the current code against the server.
   *
   * Returns null when the box is empty. Throws a message fit to show the
   * buyer when the code is rejected or the check fails — callers already
   * surface thrown messages in their error banner.
   */
  const resolve = async (): Promise<CodeResolution | null> => {
    const trimmed = code.trim();
    if (!trimmed) {
      setApplied(null);
      return null;
    }
    if (applied) return applied;

    setChecking(true);
    setCodeError('');

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventId, code: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Could not check that code. Please try again.');
      }

      const resolution: CodeResolution = await response.json();

      if (resolution.kind === 'invalid') {
        setApplied(null);
        setCodeError('That code is not valid for this event.');
        throw new Error('That code is not valid for this event.');
      }

      setApplied(resolution);
      return resolution;
    } finally {
      setChecking(false);
    }
  };

  /** For the Apply button, which reports failures inline rather than throwing. */
  const applyNow = async () => {
    try {
      await resolve();
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Could not check that code.');
    }
  };

  return { code, setCode, applied, checking, codeError, resolve, applyNow };
}

export type PromoCode = ReturnType<typeof usePromoCode>;

interface PromoCodeFieldProps {
  promo: PromoCode;
  disabled?: boolean;
}

export default function PromoCodeField({ promo, disabled }: PromoCodeFieldProps) {
  const { code, setCode, applied, checking, codeError, applyNow } = promo;

  return (
    <div>
      <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
        Promo or comp code (optional)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id="promoCode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={disabled}
          className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
          placeholder="Enter code"
        />
        <button
          type="button"
          onClick={applyNow}
          disabled={disabled || checking || !code.trim()}
          className="shrink-0 px-4 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {checking ? 'Checking…' : 'Apply'}
        </button>
      </div>

      {codeError && <p className="mt-1.5 text-sm text-red-600">{codeError}</p>}

      {applied?.kind === 'comp' && (
        <p className="mt-1.5 text-sm font-semibold text-green-700">
          Comp code applied — your tickets are free.
        </p>
      )}

      {applied?.kind === 'discount' && (
        <p className="mt-1.5 text-sm font-semibold text-green-700">
          {applied.percent}% off applied — {formatPrice(applied.unitPrice)} per ticket.
        </p>
      )}

      {!applied && !codeError && (
        <p className="mt-1.5 text-sm text-gray-500">
          Have a discount or complimentary ticket code? Enter it and tap Apply.
        </p>
      )}
    </div>
  );
}
