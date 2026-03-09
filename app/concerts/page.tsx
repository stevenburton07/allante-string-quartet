import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concerts | Allante String Quartet',
  description: 'View upcoming concerts and performances by the Allante String Quartet.',
};

export default function ConcertsPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Upcoming Concerts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for an evening of beautiful chamber music
          </p>
        </div>

        {/* Concerts List - Will be populated from CMS in Phase 3 */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center py-12 bg-light-gray rounded-lg">
            <p className="text-gray-600 text-lg mb-4">
              Concert schedule coming soon
            </p>
            <p className="text-gray-500">
              Check back soon for our upcoming performance schedule
            </p>
          </div>
        </section>

        {/* Past Concerts Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Past Performances
          </h2>
          <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-lg">
            <p className="text-gray-600">
              Past concert archive coming soon
            </p>
          </div>
        </section>

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
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}
