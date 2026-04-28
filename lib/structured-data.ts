const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://allantestringquartet.com';

const PERFORMER = {
  '@type': 'MusicGroup',
  name: 'Allante String Quartet',
  url: SITE_URL,
};

type ConcertRow = {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  location?: string | null;
  venue?: string | null;
  ticket_price: number;
  max_attendees: number;
  attendees_count: number;
  status: string;
};

type SunsetEventRow = {
  id: string;
  title: string;
  event_date: string;
  event_time?: string | null;
  description?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  ticket_price: number;
  max_tickets: number;
  tickets_sold: number;
  status?: string | null;
};

function eventStatus(status: string | null | undefined) {
  if (status === 'cancelled') return 'https://schema.org/EventCancelled';
  if (status === 'postponed') return 'https://schema.org/EventPostponed';
  return 'https://schema.org/EventScheduled';
}

function offerAvailability(remaining: number) {
  return remaining > 0
    ? 'https://schema.org/InStock'
    : 'https://schema.org/SoldOut';
}

function combineDateTime(dateOnly: string, time: string | null | undefined) {
  if (!time) return dateOnly;
  // dateOnly may already include a T component (e.g. ISO timestamp).
  if (dateOnly.includes('T')) return dateOnly;
  return `${dateOnly}T${time}`;
}

export function buildConcertEventsJsonLd(concerts: ConcertRow[]) {
  return concerts.map((concert) => {
    const remaining = Math.max(0, concert.max_attendees - concert.attendees_count);
    const placeName = [concert.venue, concert.location].filter(Boolean).join(', ') || 'Utah';

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: concert.title,
      startDate: concert.date,
      eventStatus: eventStatus(concert.status),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: concert.description ?? undefined,
      location: {
        '@type': 'Place',
        name: placeName,
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'UT',
          addressCountry: 'US',
        },
      },
      performer: PERFORMER,
      organizer: PERFORMER,
      url: `${SITE_URL}/concerts`,
      offers: {
        '@type': 'Offer',
        price: (concert.ticket_price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: offerAvailability(remaining),
        url: `${SITE_URL}/concerts`,
      },
    };
  });
}

export function buildSunsetEventsJsonLd(events: SunsetEventRow[]) {
  return events.map((event) => {
    const remaining = Math.max(0, event.max_tickets - event.tickets_sold);
    const placeName = [event.location_city, event.location_state]
      .filter(Boolean)
      .join(', ') || 'Utah';

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      startDate: combineDateTime(event.event_date, event.event_time),
      eventStatus: eventStatus(event.status ?? null),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: event.description ?? undefined,
      location: {
        '@type': 'Place',
        name: placeName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.location_city ?? undefined,
          addressRegion: event.location_state ?? 'UT',
          addressCountry: 'US',
        },
      },
      performer: PERFORMER,
      organizer: PERFORMER,
      url: `${SITE_URL}/sunset-series`,
      offers: {
        '@type': 'Offer',
        price: (event.ticket_price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: offerAvailability(remaining),
        url: `${SITE_URL}/sunset-series`,
      },
    };
  });
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
