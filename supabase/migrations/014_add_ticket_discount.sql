-- Add a per-event percentage discount code to both event types.
--
-- This is the paid sibling of the existing comp_code: a comp_code makes a
-- ticket free, a discount_code takes discount_percent off and still goes
-- through Stripe. Both live in the same box on the purchase form.
--
-- discount_percent is only meaningful when discount_code is set. The stored
-- ticket_price always stays the full public price — the discount is applied at
-- checkout, and orders keep recording what Stripe actually charged, so
-- changing any of this later never rewrites past sales.
ALTER TABLE concerts
  ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0
    CHECK (discount_percent >= 0 AND discount_percent <= 100);

ALTER TABLE sunset_events
  ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS discount_percent INTEGER NOT NULL DEFAULT 0
    CHECK (discount_percent >= 0 AND discount_percent <= 100);

-- Codes are looked up on every checkout attempt, same as comp_code.
CREATE INDEX IF NOT EXISTS idx_concerts_discount_code ON concerts(discount_code);
CREATE INDEX IF NOT EXISTS idx_sunset_events_discount_code ON sunset_events(discount_code);
