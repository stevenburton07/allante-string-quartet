import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import TicketPurchaseForm from '@/components/forms/TicketPurchaseForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sunset Series | Allante String Quartet',
  description: 'Join us for intimate outdoor concerts at beautiful hiking destinations. The Sunset Series combines chamber music with nature.',
};

export default async function SunsetSeriesPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch upcoming published events only
  const { data: upcomingEvents } = await supabase
    .from('sunset_events')
    .select('*')
    .eq('published', true)
    .gte('event_date', now)
    .order('event_date', { ascending: true });
  return (
    <div>
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
                Subscribe to our newsletter to be notified when new events are announced.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingEvents.map((event) => {
                // Convert 24-hour time to 12-hour format
                const [hours, minutes] = event.event_time.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                const formattedTime = `${displayHour}:${minutes} ${ampm}`;

                return (
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
                      at {formattedTime}
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
