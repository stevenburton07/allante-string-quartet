-- Add comp_code field to sunset_events table
ALTER TABLE sunset_events
  ADD COLUMN IF NOT EXISTS comp_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'easy';

-- Add comp code tracking to sunset_orders
ALTER TABLE sunset_orders
  ADD COLUMN IF NOT EXISTS used_comp_code BOOLEAN NOT NULL DEFAULT false;

-- Create index for comp_code
CREATE INDEX IF NOT EXISTS idx_sunset_events_comp_code ON sunset_events(comp_code);
