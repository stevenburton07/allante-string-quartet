import type { Concert } from '@/types/concert';
import ConcertTicketPurchaseForm from '@/components/forms/ConcertTicketPurchaseForm';

interface ConcertCardProps {
  concert: Concert;
  isPast?: boolean;
}

export default function ConcertCard({ concert, isPast = false }: ConcertCardProps) {
  // Parse date as local time to avoid timezone conversion issues
  const concertDateString = concert.date.slice(0, 16); // Get YYYY-MM-DDTHH:mm
  const [datePart, timePart] = concertDateString.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');

  const concertDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  const isCancelled = concert.status === 'cancelled';
  const isCompleted = concert.status === 'completed';

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
    <div className={`bg-white border-2 rounded-lg ${isCancelled ? 'border-red-700' : 'border-primary'} ${isPast ? 'opacity-75' : ''}`}>
      <div className="p-8">
        {isCancelled && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-900 font-semibold text-center">
              ⚠️ This concert has been cancelled
            </p>
            <p className="text-red-800 text-sm text-center mt-1">
              If you have tickets, you will be contacted regarding refunds.
            </p>
          </div>
        )}
        {isCompleted && (
          <div className="bg-light-blue/30 border border-primary rounded-lg p-4 mb-6">
            <p className="text-primary font-semibold text-center">
              ✓ This concert has been completed
            </p>
            <p className="text-gray-700 text-sm text-center mt-1">
              Thank you to everyone who attended!
            </p>
          </div>
        )}

        {/* Concert Image */}
        {concert.image_url && (
          <div className={`mb-6 w-full ${concert.image_orientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/9]'}`}>
            <img
              src={concert.image_url}
              alt={concert.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="mb-6">
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
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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

        {concert.description && (
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{concert.description}</p>
        )}

        {!isPast && !isCancelled && !isCompleted && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-xl font-semibold text-primary mb-4">
              {concert.ticket_price === 0 ? 'Reserve your seat' : 'Purchase tickets'}
            </h4>
            <ConcertTicketPurchaseForm
              concertId={concert.id}
              concertTitle={concert.title}
              ticketPrice={concert.ticket_price}
              maxAttendees={concert.max_attendees}
              attendeesCount={concert.attendees_count}
            />
          </div>
        )}
      </div>
    </div>
  );
}
