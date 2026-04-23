import Link from 'next/link';
import type { Metadata } from 'next';
import ShareButton from '@/components/ui/ShareButton';

export const metadata: Metadata = {
  title: 'Thank You for Your Donation | Allante String Quartet',
  description: 'Thank you for supporting the Allante String Quartet',
};

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Thank You for Your Generosity!
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            Your donation has been successfully processed. We're deeply grateful for your support
            of live chamber music in our community.
          </p>

          {/* What's Next */}
          <div className="bg-light-blue/20 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-primary mb-3">What Happens Next?</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  You'll receive a confirmation email with your receipt for tax purposes
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Your donation will directly support our concerts and community programs</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>We'll keep you updated on how your contribution makes a difference</span>
              </li>
            </ul>
          </div>

          {/* Tax Information */}
          <p className="text-sm text-gray-600 mb-8">
            The Allante String Quartet is a 501(c)(3) nonprofit organization. Your donation is
            tax-deductible to the fullest extent allowed by law.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
            >
              Return Home
            </Link>
            <Link
              href="/concerts"
              className="inline-block bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Concerts
            </Link>
          </div>

          {/* Social Share (Optional) */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Help spread the word about our music!</p>
            <div className="flex justify-center gap-3">
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
