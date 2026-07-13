-- Add optional arrival-info PDF to sunset_events.
-- The PDF (pictures + directions) is uploaded when creating/editing an event
-- and attached to the ticket confirmation email.
ALTER TABLE sunset_events ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE sunset_events ADD COLUMN IF NOT EXISTS pdf_filename TEXT;
