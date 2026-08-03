/**
 * A row from the `sunset_events` table (migration 002, plus later additions:
 * comp_code 004, arrival instructions 006, image 007/008, sunset_end_time 012,
 * arrival PDF 013, discount code 014).
 */
export interface SunsetEvent {
  id: string;
  title: string;
  description: string;
  event_date: string; // DATE, ISO yyyy-mm-dd
  event_time: string; // TIME, e.g. "19:30:00"
  sunset_end_time: string | null;
  rain_date: string | null;
  location_address: string; // withheld from the public page until purchase
  location_city: string;
  location_state: string;
  location_zip: string;
  max_tickets: number;
  tickets_sold: number;
  ticket_price: number; // in cents — always the full price, before any discount
  discount_code: string | null; // promo code buyers type for discount_percent off
  discount_percent: number; // 0-100; only meaningful with discount_code. See lib/pricing.ts
  status: string; // draft | published | cancelled | completed
  published: boolean;
  comp_code: string | null;
  image_url: string | null;
  image_orientation: string | null;
  created_at: string;
  updated_at: string;
}
