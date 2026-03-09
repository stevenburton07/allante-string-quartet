import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Allante String Quartet',
  description: 'Learn about the Allante String Quartet members, our history, and our mission to bring exceptional chamber music to audiences.',
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the musicians behind the Allante String Quartet
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Our Mission
          </h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-700 space-y-4">
            <p>
              The Allante String Quartet is dedicated to performing exceptional chamber music
              for audiences throughout San Diego County and beyond. We believe in the power of
              live music to inspire, connect, and enrich communities.
            </p>
            <p>
              Our repertoire spans from beloved classical masterworks to contemporary compositions,
              ensuring each performance offers something special for every listener.
            </p>
          </div>
        </section>

        {/* Quartet Members */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            Meet the Quartet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Member 1 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  First Violin
                </h3>
                <p className="text-gray-700">
                  [Musician name and bio to be added]
                </p>
              </div>
            </div>

            {/* Member 2 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Second Violin
                </h3>
                <p className="text-gray-700">
                  [Musician name and bio to be added]
                </p>
              </div>
            </div>

            {/* Member 3 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Viola
                </h3>
                <p className="text-gray-700">
                  [Musician name and bio to be added]
                </p>
              </div>
            </div>

            {/* Member 4 */}
            <div className="bg-light-gray p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Cello
                </h3>
                <p className="text-gray-700">
                  [Musician name and bio to be added]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-primary to-light-blue text-white py-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            Experience Our Music
          </h2>
          <p className="text-lg mb-8">
            Join us at our next performance or hire us for your special event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/concerts"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-light-gray transition-colors"
            >
              View Concerts
            </a>
            <a
              href="/hire"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Hire Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
