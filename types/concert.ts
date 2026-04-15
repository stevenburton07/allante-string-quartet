export interface Concert {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO string
  location: string;
  venue: string | null;
  image_url: string | null;
  image_orientation: string | null; // 'landscape' or 'portrait'
  is_published: boolean;
  status: string; // draft, published, cancelled, completed
  ticket_price: number; // In cents
  max_attendees: number;
  attendees_count: number;
  comp_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConcertFormData {
  title: string;
  description?: string;
  date: string;
  location: string;
  venue?: string;
  image_url?: string;
  is_published: boolean;
  ticket_price: number;
  max_attendees: number;
  comp_code?: string;
}
