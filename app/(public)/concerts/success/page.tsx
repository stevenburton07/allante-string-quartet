import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registration Successful | Concerts',
  description: 'Your concert registration has been confirmed',
};

export default function ConcertSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; concert_id?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white border-2 border-primary rounded-lg shadow-xl p-8 md:p-12 text-center">
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
            Registration Confirmed!
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            Your concert registration has been confirmed successfully. We're excited to have you
            join us for an evening of beautiful chamber music.
          </p>

          {/* What's Next */}
          <div className="bg-light-blue/20 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-primary mb-3">What happens next?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5"
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
                  <strong>Check your email</strong> for your confirmation with QR code
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5"
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
                  <strong>Concert details</strong> including venue and time are in your confirmation email
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5"
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
                  <strong>Bring your QR code</strong> (printed or on your phone) to check in at
                  the concert
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5"
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
                  <strong>Arrival time:</strong> Please arrive 15 minutes early for check-in
                </span>
              </li>
            </ul>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-yellow-900 mb-2">📧 Didn't receive your email?</h3>
            <p className="text-sm text-yellow-800 mb-2">
              Check your spam folder, or contact us at{' '}
              <a
                href="mailto:allantestringquartet@gmail.com"
                className="font-semibold hover:underline"
              >
                allantestringquartet@gmail.com
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/concerts"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
            >
              View all concerts
            </Link>
            <Link
              href="/"
              className="inline-block border-2 border-primary text-primary bg-transparent px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-all"
            >
              Return home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Questions about your registration?</p>
            <a
              href="mailto:allantestringquartet@gmail.com"
              className="text-primary hover:text-secondary font-semibold"
            >
              allantestringquartet@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
