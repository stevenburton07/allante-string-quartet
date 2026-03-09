export interface Concert {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO string
  location: string;
  venue: string | null;
  ticket_link: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConcertFormData {
  title: string;
  description?: string;
  date: string;
  location: string;
  venue?: string;
  ticket_link?: string;
  image_url?: string;
  is_published: boolean;
}
