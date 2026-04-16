import type { Metadata } from 'next';
import NewsletterSignupForm from '@/components/forms/NewsletterSignupForm';

export const metadata: Metadata = {
  title: 'Newsletter | Allante String Quartet',
  description: 'Subscribe to the Allante String Quartet newsletter for concert updates, exclusive content, and more.',
};

export default function NewsletterPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Stay in the loop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Subscribe to our newsletter for updates on upcoming concerts, special events, and exclusive content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Newsletter Form */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Subscribe to our newsletter
            </h2>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <NewsletterSignupForm />
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              What to expect
            </h2>

            <div className="space-y-8">
              {/* News */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  News & announcements
                </h3>
                <p className="text-gray-700 text-sm">
                  Stay informed about special collaborations, recordings, and more
                </p>
              </div>

              {/* Concert Updates */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Concert announcements
                </h3>
                <p className="text-gray-700 text-sm">
                  Be the first to know about upcoming performances and special events
                </p>
              </div>

              {/* Sunset Series */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Sunset Series updates
                </h3>
                <p className="text-gray-700 text-sm">
                  Get early access to our exclusive outdoor chamber music experiences
                </p>
              </div>

              {/* Behind the Scenes */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Behind-the-scenes content
                </h3>
                <p className="text-gray-700 text-sm">
                  Enjoy exclusive stories, rehearsal insights, and musician spotlights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
