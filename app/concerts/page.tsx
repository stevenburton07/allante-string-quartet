import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import ConcertCard from '@/components/concerts/ConcertCard';

export const metadata: Metadata = {
  title: 'Concerts | Allante String Quartet',
  description: 'View upcoming concerts and performances by the Allante String Quartet.',
};

export const dynamic = 'force-dynamic';

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
    <div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/allante.jpg"
            alt="Allante String Quartet"
            fill
            className="object-cover opacity-25"
            style={{ objectPosition: '50% 47.5%' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Upcoming concerts
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-900">
            Join us for an evening of beautiful chamber music
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
        </div>
      </div>
    </div>
  );
}
