-- Add image_url column to sunset_events table
ALTER TABLE sunset_events ADD COLUMN IF NOT EXISTS image_url TEXT;
