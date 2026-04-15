-- Add image_orientation column to concerts table
ALTER TABLE concerts
ADD COLUMN image_orientation TEXT CHECK (image_orientation IN ('landscape', 'portrait'));

-- Add image_orientation column to sunset_events table
ALTER TABLE sunset_events
ADD COLUMN image_orientation TEXT CHECK (image_orientation IN ('landscape', 'portrait'));
