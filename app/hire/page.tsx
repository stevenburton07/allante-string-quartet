import type { Metadata } from 'next';
import HireQuoteForm from '@/components/forms/HireQuoteForm';

export const metadata: Metadata = {
  title: 'Hire Us | Allante String Quartet',
  description: 'Book the Allante String Quartet for your wedding, corporate event, or private gathering. Professional live music for any occasion.',
};

export default function HirePage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Hire the Allante Quartet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elevate your special event with live chamber music
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-16 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 text-center">
            The Allante String Quartet is available for weddings, corporate events, private parties,
            and special occasions throughout San Diego County. We offer flexible ensemble options
            and a diverse repertoire to perfectly complement your event.
          </p>
        </section>

        {/* Performance Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Performance Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-light-gray p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Solo Violin
              </h3>
              <p className="text-gray-700 text-sm">
                Perfect for intimate gatherings and cocktail hours
              </p>
            </div>
            <div className="bg-light-gray p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Solo Viola
              </h3>
              <p className="text-gray-700 text-sm">
                Warm, rich tones for sophisticated ambiance
              </p>
            </div>
            <div className="bg-light-gray p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Solo Cello
              </h3>
              <p className="text-gray-700 text-sm">
                Deep, resonant sound for elegant occasions
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary to-primary text-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-3">
                Full Quartet
              </h3>
              <p className="text-sm">
                The complete experience for weddings and galas
              </p>
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-primary/20 p-6 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Weddings</h3>
              <p className="text-gray-700 text-sm">
                Ceremony music, cocktail hour, dinner reception - we'll work with you to create
                the perfect soundtrack for your special day.
              </p>
            </div>
            <div className="bg-white border-2 border-primary/20 p-6 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Corporate Events</h3>
              <p className="text-gray-700 text-sm">
                Add sophistication to product launches, galas, conferences, and company celebrations.
              </p>
            </div>
            <div className="bg-white border-2 border-primary/20 p-6 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Private Parties</h3>
              <p className="text-gray-700 text-sm">
                Milestone birthdays, anniversaries, garden parties, and intimate celebrations.
              </p>
            </div>
            <div className="bg-white border-2 border-primary/20 p-6 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Other Events</h3>
              <p className="text-gray-700 text-sm">
                Fundraisers, memorial services, holiday gatherings, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Quote Request Form */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Request a Quote
          </h2>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <HireQuoteForm />
          </div>
        </section>

        {/* What to Expect */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            What to Expect
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Submit Your Request</h3>
                <p className="text-gray-700 text-sm">
                  Fill out our quote request form with your event details
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Receive Your Quote</h3>
                <p className="text-gray-700 text-sm">
                  We'll respond within 48 hours with pricing and availability
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Plan the Details</h3>
                <p className="text-gray-700 text-sm">
                  We'll work together on repertoire, timing, and logistics
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Enjoy Your Event</h3>
                <p className="text-gray-700 text-sm">
                  Relax and let us provide beautiful music for your special occasion
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
