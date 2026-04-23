-- Enable Row Level Security on newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can read subscribers (needed for duplicate email check in subscribe endpoint)
CREATE POLICY "Public can view newsletter subscribers"
ON newsletter_subscribers FOR SELECT
TO public
USING (true);

-- Public can insert new subscribers (subscribe form)
CREATE POLICY "Public can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT
TO public
WITH CHECK (true);

-- Public can update subscribers (reactivation of unsubscribed users)
CREATE POLICY "Public can update newsletter subscribers"
ON newsletter_subscribers FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage newsletter subscribers"
ON newsletter_subscribers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
