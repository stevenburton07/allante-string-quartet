import type { Concert } from '@/types/concert';

interface ConcertCardProps {
  concert: Concert;
  isPast?: boolean;
}

export default function ConcertCard({ concert, isPast = false }: ConcertCardProps) {
  const concertDate = new Date(concert.date);

  const formattedDate = concertDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = concertDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className={`bg-white border-2 border-primary rounded-lg ${isPast ? 'opacity-75' : ''}`}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-secondary mb-2">{concert.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {concert.location}
                {concert.venue && ` - ${concert.venue}`}
              </span>
            </div>
          </div>

          {concert.image_url && (
            <div className="ml-6 flex-shrink-0">
              <img
                src={concert.image_url}
                alt={concert.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {concert.description && (
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{concert.description}</p>
        )}

        {concert.ticket_link && !isPast && (
          <div className="mt-6">
            <a
              href={concert.ticket_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Tickets →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
