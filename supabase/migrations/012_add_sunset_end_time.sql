-- Add sunset_end_time column to sunset_events for sunset time range display
ALTER TABLE sunset_events ADD COLUMN sunset_end_time TIME;
