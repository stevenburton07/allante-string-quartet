-- Atomic increment for concert attendees to prevent race conditions
CREATE OR REPLACE FUNCTION increment_attendees(concert_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE concerts
  SET attendees_count = attendees_count + amount
  WHERE id = concert_id
    AND attendees_count + amount <= max_attendees;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough seats available';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Atomic increment for sunset event tickets to prevent race conditions
CREATE OR REPLACE FUNCTION increment_tickets_sold(event_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE sunset_events
  SET tickets_sold = tickets_sold + amount
  WHERE id = event_id
    AND tickets_sold + amount <= max_tickets;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough tickets available';
  END IF;
END;
$$ LANGUAGE plpgsql;
