import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sunset Series | Allante String Quartet',
  description: 'Join us for intimate outdoor concerts at beautiful hiking destinations. The Sunset Series combines chamber music with nature.',
};

export default function SunsetSeriesPage() {
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

        {/* 2026 Event Information */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            2026 Season
          </h2>

          <div className="bg-white border-2 border-primary rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-secondary mb-2">
                Thursday, June 18, 2026
              </h3>
              <p className="text-gray-600">
                Rain Date: Tuesday, June 23, 2026
              </p>
            </div>

            <div className="space-y-4 text-gray-700 mb-8">
              <p>
                <strong>Tickets:</strong> $20 per person
              </p>
              <p>
                <strong>Location:</strong> North County San Diego (exact location revealed after purchase)
              </p>
              <p className="text-sm text-gray-600 italic">
                *If weather conditions require rescheduling, ticket holders will be notified by email
                and the event will move to the rain date.
              </p>
            </div>

            {/* Ticket Widget Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-light-gray">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Ticket Purchase
              </h3>
              <p className="text-gray-600 mb-6">
                Ticketing system will be available here in Phase 5
              </p>
              <p className="text-sm text-gray-500">
                Secure payment • QR code tickets • Email confirmation
              </p>
            </div>
          </div>
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
