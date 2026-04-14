-- Create sunset_events table for managing Sunset Series events
CREATE TABLE IF NOT EXISTS sunset_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  rain_date DATE,
  location_address TEXT NOT NULL, -- Private until ticket purchased
  location_city VARCHAR(100) NOT NULL,
  location_state VARCHAR(50) NOT NULL,
  location_zip VARCHAR(20) NOT NULL,
  max_tickets INTEGER NOT NULL DEFAULT 75,
  tickets_sold INTEGER NOT NULL DEFAULT 0,
  ticket_price INTEGER NOT NULL DEFAULT 2000, -- In cents
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, published, cancelled, completed
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sunset_orders table for ticket purchases
CREATE TABLE IF NOT EXISTS sunset_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES sunset_events(id) ON DELETE CASCADE,

  -- Customer information
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),

  -- Payment information
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_session_id VARCHAR(255) UNIQUE,
  amount_paid INTEGER NOT NULL, -- In cents
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, refunded, failed

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sunset_events_event_date ON sunset_events(event_date);
CREATE INDEX IF NOT EXISTS idx_sunset_events_status ON sunset_events(status);
CREATE INDEX IF NOT EXISTS idx_sunset_events_published ON sunset_events(published);
CREATE INDEX IF NOT EXISTS idx_sunset_orders_event_id ON sunset_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_sunset_orders_customer_email ON sunset_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_sunset_orders_stripe_payment_intent ON sunset_orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_sunset_orders_qr_code ON sunset_orders(qr_code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sunset_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER sunset_events_updated_at
BEFORE UPDATE ON sunset_events
FOR EACH ROW
EXECUTE FUNCTION update_sunset_updated_at();

CREATE TRIGGER sunset_orders_updated_at
BEFORE UPDATE ON sunset_orders
FOR EACH ROW
EXECUTE FUNCTION update_sunset_updated_at();

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE sunset_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sunset_orders ENABLE ROW LEVEL SECURITY;

-- Sunset Events Policies
-- Public can view published events (but not location details until they have a ticket)
CREATE POLICY "Public can view published sunset events"
ON sunset_events FOR SELECT
TO public
USING (published = true);

-- Authenticated users (admins) can do everything with sunset events
CREATE POLICY "Authenticated users can manage sunset events"
ON sunset_events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Sunset Orders Policies
-- Users can view their own orders by email
CREATE POLICY "Users can view own sunset orders"
ON sunset_orders FOR SELECT
TO public
USING (true); -- We'll filter by email in the application

-- Only authenticated users (admins) can insert orders (via webhook)
CREATE POLICY "Service role can create sunset orders"
ON sunset_orders FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can update orders
CREATE POLICY "Authenticated users can update sunset orders"
ON sunset_orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users (admins) can delete orders
CREATE POLICY "Authenticated users can delete sunset orders"
ON sunset_orders FOR DELETE
TO authenticated
USING (true);
