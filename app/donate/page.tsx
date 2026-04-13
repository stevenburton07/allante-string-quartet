import type { Metadata } from 'next';
import DonationForm from '@/components/forms/DonationForm';

export const metadata: Metadata = {
  title: 'Donate | Allante String Quartet',
  description: 'Support the Allante String Quartet and help us continue bringing live chamber music to the community.',
};

export default function DonatePage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Support our music
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your generosity helps us continue bringing live chamber music to the community
          </p>
        </div>

        {/* Impact Statement */}
        <section className="mb-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-secondary/20 to-light-blue/30 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              Your impact
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              As a nonprofit ensemble, the Allante String Quartet relies on the support of music
              lovers like you to continue our mission of making live chamber music accessible to all.
            </p>
            <p className="text-lg text-gray-700">
              Your donations help us cover the costs of rehearsal space, music purchases, instrument
              maintenance, and the production of free and low-cost community concerts.
            </p>
          </div>
        </section>

        {/* Donation Form */}
        <section className="mb-16 max-w-2xl mx-auto">
          <div className="bg-white border-2 border-primary rounded-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              Make a donation
            </h2>
            <DonationForm />
          </div>
        </section>

        {/* Ways to Give */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Other ways to give
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Check by Mail
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Send a check made out to "Allante String Quartet" to:
              </p>
              <p className="text-gray-600 text-sm italic">
                [Mailing address to be added]
              </p>
            </div>
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Matching Gifts
              </h3>
              <p className="text-gray-700 text-sm">
                Many employers match charitable donations. Check if your company participates
                to double your impact!
              </p>
            </div>
            <div className="bg-light-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Planned Giving
              </h3>
              <p className="text-gray-700 text-sm">
                Consider including the Allante String Quartet in your estate planning.
                Contact us to learn more.
              </p>
            </div>
          </div>
        </section>

        {/* Donor Recognition */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Donor recognition
          </h2>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 text-center mb-6">
              We gratefully acknowledge our generous supporters who make our work possible.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-secondary mb-2 text-center">
                  Patron ($1,000+)
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Recognition in concert programs and on website
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2 text-center">
                  Sponsor ($500-$999)
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Recognition in concert programs
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2 text-center">
                  Supporter ($100-$499)
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Our heartfelt thanks and email updates
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2 text-center">
                  Friend (Up to $99)
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Every gift matters and is deeply appreciated
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Information */}
        <section className="max-w-3xl mx-auto text-center">
          <div className="bg-light-blue/20 p-6 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Tax-Deductible:</strong> The Allante String Quartet is a 501(c)(3) nonprofit organization.
              Your donation is tax-deductible to the fullest extent allowed by law.
              Tax ID: [To be added]
            </p>
          </div>
        </section>

        {/* Thank You */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Thank you!
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your support enables us to share the transformative power of live music with our community.
            We are deeply grateful for your generosity.
          </p>
        </section>
      </div>
    </div>
  );
}
