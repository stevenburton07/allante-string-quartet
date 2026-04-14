-- Add ticketing fields to concerts table
ALTER TABLE concerts
  ADD COLUMN IF NOT EXISTS ticket_price INTEGER DEFAULT 0, -- In cents, 0 = free
  ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS attendees_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comp_code VARCHAR(50);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_concerts_comp_code ON concerts(comp_code);

-- Create concert_orders table
CREATE TABLE IF NOT EXISTS concert_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,

  -- Customer information
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),

  -- Payment information
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_session_id VARCHAR(255) UNIQUE,
  amount_paid INTEGER NOT NULL DEFAULT 0, -- In cents, 0 for comp tickets
  payment_status VARCHAR(50) NOT NULL DEFAULT 'completed', -- pending, completed, refunded, failed
  used_comp_code BOOLEAN NOT NULL DEFAULT false,

  -- Ticket information
  ticket_quantity INTEGER NOT NULL DEFAULT 1,
  qr_code TEXT, -- QR code data for ticket verification
  qr_code_url TEXT, -- URL to QR code image

  -- Check-in tracking
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for concert_orders
CREATE INDEX IF NOT EXISTS idx_concert_orders_concert_id ON concert_orders(concert_id);
CREATE INDEX IF NOT EXISTS idx_concert_orders_customer_email ON concert_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_concert_orders_stripe_payment_intent ON concert_orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_concert_orders_qr_code ON concert_orders(qr_code);

-- Create trigger for concert_orders updated_at
CREATE TRIGGER concert_orders_updated_at
BEFORE UPDATE ON concert_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for concert_orders
ALTER TABLE concert_orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own concert orders"
ON concert_orders FOR SELECT
TO public
USING (true);

-- Only authenticated users (admins) can insert orders
CREATE POLICY "Service role can create concert orders"
ON concert_orders FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can update orders
CREATE POLICY "Authenticated users can update concert orders"
ON concert_orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users (admins) can delete orders
CREATE POLICY "Authenticated users can delete concert orders"
ON concert_orders FOR DELETE
TO authenticated
USING (true);
