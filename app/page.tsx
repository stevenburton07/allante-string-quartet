import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch upcoming concerts (published, cancelled, or completed)
  const { data: upcomingConcerts } = await supabase
    .from('concerts')
    .select('*')
    .in('status', ['published', 'cancelled', 'completed'])
    .gte('date', now)
    .order('date', { ascending: true })
    .limit(3);

  // Fetch upcoming sunset series events
  const { data: upcomingSunsetEvents } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('published', true)
    .gte('event_date', now)
    .order('event_date', { ascending: true })
    .limit(3);

  const hasUpcomingEvents =
    (upcomingConcerts && upcomingConcerts.length > 0) ||
    (upcomingSunsetEvents && upcomingSunsetEvents.length > 0);
  return (
    <div>
      {/* Hero Section */}
      <section>
        {/* Hero Image */}
        <div className="relative w-full h-[500px] md:h-[700px]">
          <Image
            src="/images/hero-background.JPG"
            alt="Allante String Quartet"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 55%' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo.jpg"
              alt="Allante String Quartet"
              width={400}
              height={200}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-700">
            Professional string quartet of Utah county
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/hire"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Hire us
            </a>
            <a
              href="/concerts"
              className="border-2 border-primary text-primary bg-transparent px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all"
            >
              View concerts
            </a>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Welcome
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              The Allante String Quartet is a professional ensemble dedicated to performing
              exceptional chamber music for audiences throughout Utah County and beyond.
              Our repertoire spans from classical masterworks to contemporary compositions.
            </p>
            <a
              href="/about"
              className="inline-block text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-4 py-2"
            >
              Learn more about us →
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Concerts Preview */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Upcoming performances
          </h2>

          {!hasUpcomingEvents ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Stay tuned for our upcoming concert schedule
              </p>
              <a
                href="/concerts"
                className="inline-block border-2 border-primary text-primary bg-transparent px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all"
              >
                View all concerts
              </a>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Upcoming Concerts */}
              {upcomingConcerts && upcomingConcerts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-primary">Concerts</h3>
                    <Link
                      href="/concerts"
                      className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-4 py-2 text-sm"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingConcerts.map((concert) => {
                      // Parse date as local time to avoid timezone conversion issues
                      const concertDateString = concert.date.slice(0, 16);
                      const [datePart, timePart] = concertDateString.split('T');
                      const [year, month, day] = datePart.split('-');
                      const [hour, minute] = timePart.split(':');
                      const concertDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
                      const isCancelled = concert.status === 'cancelled';
                      const isCompleted = concert.status === 'completed';
                      return (
                        <div key={concert.id} className={`bg-white border-2 rounded-lg p-8 ${isCancelled ? 'border-red-700' : 'border-primary'}`}>
                          {isCancelled && (
                            <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
                              <p className="text-red-900 font-semibold text-center text-sm">
                                ⚠️ This concert has been cancelled
                              </p>
                            </div>
                          )}
                          {isCompleted && (
                            <div className="bg-light-blue/30 border border-primary rounded-lg p-3 mb-4">
                              <p className="text-primary font-semibold text-center text-sm">
                                ✓ This concert has been completed
                              </p>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-2xl font-bold text-secondary mb-4">
                                {concert.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>
                                  {concertDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
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
                                <span>
                                  {concertDate.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
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
                          </div>
                          {concert.description && (
                            <p className="text-gray-700 whitespace-pre-wrap line-clamp-3 mb-4 mt-4">
                              {concert.description}
                            </p>
                          )}

                          {!isCancelled && !isCompleted && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              <div>
                                {concert.ticket_price === 0 ? (
                                  <span className="text-green-600 font-semibold">Free admission</span>
                                ) : (
                                  <span className="text-lg font-bold text-secondary">
                                    ${(concert.ticket_price / 100).toFixed(2)}
                                  </span>
                                )}
                                <p className="text-xs text-gray-500">
                                  {concert.max_attendees - concert.attendees_count} seats remaining
                                </p>
                              </div>
                              <Link
                                href="/concerts"
                                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity text-sm"
                              >
                                {concert.ticket_price === 0 ? (
                                  'Reserve seat'
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                    Get tickets
                                  </>
                                )}
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming Sunset Series */}
              {upcomingSunsetEvents && upcomingSunsetEvents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-primary">Sunset Series</h3>
                    <Link
                      href="/sunset-series"
                      className="text-primary bg-transparent hover:bg-primary/10 font-semibold rounded-lg transition-all px-4 py-2 text-sm"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingSunsetEvents.map((event) => {
                      const eventDate = new Date(event.event_date);
                      const [hours, minutes] = event.event_time.split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      const formattedTime = `${displayHour}:${minutes} ${ampm}`;

                      return (
                        <div key={event.id} className="bg-white border-2 border-primary rounded-lg p-8">
                          <div className="flex-1 mb-4">
                            <h4 className="text-2xl font-bold text-secondary mb-4">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {eventDate.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
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
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
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
                                {event.location_city}, {event.location_state}
                                <span className="ml-2 text-xs italic">
                                  (exact location revealed after purchase)
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span className="capitalize">
                                {event.difficulty || 'Easy'} difficulty
                              </span>
                            </div>
                          </div>

                          {event.description && (
                            <p className="text-gray-700 whitespace-pre-wrap line-clamp-3 mb-4">
                              {event.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div>
                              <span className="text-lg font-bold text-secondary">
                                ${(event.ticket_price / 100).toFixed(2)}
                              </span>
                              <p className="text-xs text-gray-500">
                                {event.max_tickets - event.tickets_sold} tickets remaining
                              </p>
                            </div>
                            <Link
                              href="/sunset-series"
                              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                              Get tickets
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Support our music
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Your donations help us continue bringing live chamber music to the community
          </p>
          <a
            href="/donate"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Make a donation
          </a>
        </div>
      </section>
    </div>
  );
}
