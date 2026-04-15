-- Add arrival_instructions column to sunset_events table
ALTER TABLE sunset_events ADD COLUMN IF NOT EXISTS arrival_instructions TEXT;
