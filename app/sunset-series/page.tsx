import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import TicketPurchaseForm from '@/components/forms/TicketPurchaseForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sunset Series | Allante String Quartet',
  description: 'Join us for intimate outdoor concerts at beautiful hiking destinations. The Sunset Series combines chamber music with nature.',
};

export default async function SunsetSeriesPage() {
  const supabase = await createClient();

  // Fetch published events
  const { data: events, error } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('published', true)
    .order('event_date', { ascending: true });

  const upcomingEvents = events?.filter(
    (event) => new Date(event.event_date) >= new Date()
  ) || [];
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Sunset Series
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chamber music meets nature in breathtaking outdoor settings
          </p>
        </div>

        {/* About the Series */}
        <section className="mb-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-light-blue to-secondary/20 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Experience Music in Nature
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Sunset Series brings live chamber music to stunning outdoor locations throughout
                North County San Diego. Join us for an unforgettable evening as we perform at
                carefully selected hiking destinations, where beautiful music meets breathtaking views.
              </p>
              <p>
                Each concert is an intimate experience, combining the joy of live performance with
                the serenity of nature. Bring a blanket, enjoy the sunset, and immerse yourself in
                the magic of acoustic music under the open sky.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Upcoming Events
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">
                No upcoming events at this time. Check back soon!
              </p>
              <p className="text-sm text-gray-500">
                Subscribe to our newsletter to be notified when new events are announced.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white border-2 border-primary rounded-lg p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-secondary mb-2">
                      {event.title}
                    </h3>
                    <p className="text-lg text-gray-700 mb-1">
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at {event.event_time}
                    </p>
                    {event.rain_date && (
                      <p className="text-gray-600 text-sm">
                        Rain Date:{' '}
                        {new Date(event.rain_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  <div className="mb-8">
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>

                  <div className="bg-light-blue/20 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div>
                        <p className="font-semibold text-primary mb-1">Ticket Price</p>
                        <p className="text-2xl font-bold text-secondary">
                          ${(event.ticket_price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary mb-1">Location</p>
                        <p>
                          {event.location_city}, {event.location_state}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          Exact location revealed after purchase
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
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-xl font-semibold text-primary mb-4">
                      Purchase Tickets
                    </h4>
                    <TicketPurchaseForm
                      eventId={event.id}
                      eventTitle={event.title}
                      ticketPrice={event.ticket_price}
                      maxTickets={event.max_tickets}
                      ticketsSold={event.tickets_sold}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* What to Bring */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            What to Bring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Essentials</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Blanket or low-back chair</li>
                <li>Water bottle</li>
                <li>Sun protection</li>
                <li>Layers for changing temperatures</li>
              </ul>
            </div>
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Optional</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Picnic snacks</li>
                <li>Flashlight or headlamp</li>
                <li>Camera</li>
                <li>Bug spray</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Frequently Asked Questions
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
                Please contact us at info@allantequartet.com and we'll work with you on options.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-2">
                Is the hike difficult?
              </h3>
              <p className="text-gray-700">
                The location is accessible for most fitness levels. Detailed hiking instructions
                and difficulty information are provided in your ticket confirmation email.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
