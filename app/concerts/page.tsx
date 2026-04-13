import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ConcertCard from '@/components/concerts/ConcertCard';

export const metadata: Metadata = {
  title: 'Concerts | Allante String Quartet',
  description: 'View upcoming concerts and performances by the Allante String Quartet.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ConcertsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Get upcoming published concerts
  const { data: upcomingConcerts } = await supabase
    .from('concerts')
    .select('*')
    .eq('is_published', true)
    .gte('date', now)
    .order('date', { ascending: true });

  // Get past published concerts
  const { data: pastConcerts } = await supabase
    .from('concerts')
    .select('*')
    .eq('is_published', true)
    .lt('date', now)
    .order('date', { ascending: false })
    .limit(6);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Upcoming concerts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for an evening of beautiful chamber music
          </p>
        </div>

        {/* Upcoming Concerts */}
        <section className="max-w-4xl mx-auto mb-16">
          {!upcomingConcerts || upcomingConcerts.length === 0 ? (
            <div className="text-center py-12 bg-light-gray rounded-lg">
              <p className="text-gray-600 text-lg mb-4">
                No upcoming concerts scheduled at this time
              </p>
              <p className="text-gray-500">
                Check back soon for our upcoming performance schedule
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          )}
        </section>

        {/* Past Concerts */}
        {pastConcerts && pastConcerts.length > 0 && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Past performances
            </h2>
            <div className="space-y-6">
              {pastConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} isPast />
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Want to be notified about upcoming concerts?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us to join our mailing list
          </p>
          <a
            href="/contact"
            className="inline-block bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact us
          </a>
        </section>
      </div>
    </div>
  );
}
