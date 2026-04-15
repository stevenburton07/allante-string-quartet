-- Add status column to concerts table
ALTER TABLE concerts ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'draft';

-- Add check constraint for valid status values
ALTER TABLE concerts ADD CONSTRAINT concerts_status_check
  CHECK (status IN ('draft', 'published', 'cancelled', 'completed'));

-- Create index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_concerts_status ON concerts(status);

-- Update existing concerts to have status match is_published
UPDATE concerts
SET status = CASE
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END
WHERE status = 'draft';
