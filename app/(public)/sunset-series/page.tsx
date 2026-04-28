import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import TicketPurchaseForm from '@/components/forms/TicketPurchaseForm';
import { formatSunsetRange } from '@/lib/format-time';
import { buildSunsetEventsJsonLd } from '@/lib/structured-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sunset Series',
  description: 'Join us for intimate outdoor concerts at beautiful hiking destinations across Utah. The Sunset Series combines chamber music with nature.',
};

export default async function SunsetSeriesPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch upcoming published, cancelled, or completed events
  const { data: upcomingEvents } = await supabase
    .from('sunset_events')
    .select('*')
    .in('status', ['published', 'cancelled', 'completed'])
    .gte('event_date', now)
    .order('event_date', { ascending: true });

  const eventsJsonLd = buildSunsetEventsJsonLd(upcomingEvents ?? []);

  return (
    <div>
      {eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
      )}
      {/* Hero Image */}
      <section className="relative w-full h-[500px] md:h-[700px] mb-16">
        <Image
          src="/images/sunset-hiking-music-series.jpg"
          alt="Sunset Series"
          fill
          className="object-cover"
          priority
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* About the Series */}
        <section className="mb-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-light-blue to-secondary/20 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Experience music in nature
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Sunset Series brings live chamber music to stunning outdoor locations throughout
                Utah County. Join us for an unforgettable evening as we perform at
                carefully selected hiking destinations, where beautiful music meets breathtaking views.
              </p>
              <p>
                Each concert is an intimate experience, combining the joy of live performance with
                the serenity of nature. Enjoy the sunset and immerse yourself in
                the magic of acoustic music under the open sky.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Upcoming events
          </h2>

          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">
                No upcoming events at this time. Check back soon!
              </p>
              <p className="text-sm text-gray-500">
                Subscribe to our concert updates to be notified when new events are announced.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingEvents.map((event) => {
                const formattedTime = formatSunsetRange(event.event_time, event.sunset_end_time);
                const isCancelled = event.status === 'cancelled';
                const isCompleted = event.status === 'completed';

                // Parse rain date as local date to avoid timezone issues
                let rainDateFormatted = null;
                if (event.rain_date) {
                  const [year, month, day] = event.rain_date.split('-');
                  const rainDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  rainDateFormatted = rainDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  });
                }

                return (
                <div key={event.id} className={`bg-white border-2 rounded-lg p-8 ${isCancelled ? 'border-red-700' : 'border-primary'}`}>
                  {isCancelled && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
                      <p className="text-red-900 font-semibold text-center">
                        ⚠️ This event has been cancelled
                      </p>
                      <p className="text-red-800 text-sm text-center mt-1">
                        If you have tickets, you will be contacted regarding refunds.
                      </p>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="bg-light-blue/30 border border-primary rounded-lg p-4 mb-6">
                      <p className="text-primary font-semibold text-center">
                        ✓ This event has been completed
                      </p>
                      <p className="text-gray-700 text-sm text-center mt-1">
                        Thank you to everyone who attended!
                      </p>
                    </div>
                  )}

                  {/* Event Image */}
                  {event.image_url && (
                    <div className={`mb-6 w-full ${event.image_orientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/9]'}`}>
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-secondary mb-2">{event.title}</h3>
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
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
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
                    {rainDateFormatted && (
                      <p className="text-gray-600 text-sm ml-7">
                        Rain Date: {rainDateFormatted}
                      </p>
                    )}
                  </div>

                  <div className="mb-8">
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>

                  <div className="bg-light-blue/20 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                      <div className="text-center md:text-left">
                        <p className="font-semibold text-primary mb-2">Ticket price</p>
                        <p className="text-2xl font-bold text-secondary mb-1">
                          ${(event.ticket_price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="font-semibold text-primary mb-2">Location</p>
                        <p className="mb-1">
                          {event.location_city}, {event.location_state}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          Exact location revealed after purchase
                        </p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="font-semibold text-primary mb-2">Difficulty</p>
                        <p className="capitalize mb-1">
                          {event.difficulty || 'Easy'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.difficulty === 'easy' && 'Suitable for all fitness levels'}
                          {event.difficulty === 'moderate' && 'Some inclines, moderate fitness required'}
                          {event.difficulty === 'difficult' && 'Steep terrain, good fitness needed'}
                          {!event.difficulty && 'Suitable for all fitness levels'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {event.rain_date && (
                    <p className="text-sm text-gray-600 italic mb-6 text-center">
                      *If weather conditions require rescheduling, ticket holders will be notified
                      by email and the event will move to the rain date.
                    </p>
                  )}

                  {/* Ticket Purchase Form */}
                  {!isCancelled && !isCompleted && (
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-xl font-semibold text-primary mb-4">
                        Purchase tickets
                      </h4>
                      <TicketPurchaseForm
                        eventId={event.id}
                        eventTitle={event.title}
                        ticketPrice={event.ticket_price}
                        maxTickets={event.max_tickets}
                        ticketsSold={event.tickets_sold}
                      />
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </section>

        {/* What to Bring */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            What to bring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Essentials</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Flashlight or headlamp</li>
                <li>Water bottle</li>
                <li>Sun protection</li>
                <li>Layers for changing temperatures</li>
              </ul>
            </div>
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Optional</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Blanket or low-back chair</li>
                <li>Picnic snacks</li>
                <li>Camera</li>
                <li>Bug spray</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto pb-16">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-2">
                Why isn't the exact location shown?
              </h3>
              <p className="text-gray-700">
                To preserve the intimate nature of our concerts and protect the natural environment,
                we reveal the exact location only to ticket holders via email confirmation.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-2">
                What if I can't attend the rain date?
              </h3>
              <p className="text-gray-700">
                Please contact us at allantestringquartet@gmail.com and we'll work with you on options.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-2">
                Is the hike difficult?
              </h3>
              <p className="text-gray-700">
                Each event has a description of difficulty. Detailed hiking instructions
                are provided in your ticket confirmation email.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
