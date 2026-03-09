-- Create concerts table
CREATE TABLE IF NOT EXISTS concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  ticket_link VARCHAR(500),
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_concerts_date ON concerts(date DESC);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_concerts_published ON concerts(is_published);

-- Enable Row Level Security
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;

-- Public can view published concerts
CREATE POLICY "Public can view published concerts"
  ON concerts
  FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage all concerts"
  ON concerts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_concerts_updated_at BEFORE UPDATE ON concerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
