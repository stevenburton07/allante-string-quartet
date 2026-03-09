import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Allante String Quartet',
  description: 'Get in touch with the Allante String Quartet. We\'d love to hear from you!',
};

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Send Us a Message
            </h2>

            <div className="bg-gradient-to-br from-light-blue/20 to-secondary/10 p-8 rounded-lg border-2 border-dashed border-primary/30">
              <p className="text-gray-700 mb-4 font-semibold text-center">
                Contact form will be available here in Phase 2
              </p>
              <p className="text-gray-600 text-sm text-center">
                Fields: Name, Email, Subject, Message
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Get in Touch
            </h2>

            <div className="space-y-8">
              {/* Email */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </h3>
                <p className="text-gray-700">
                  <a href="mailto:info@allantequartet.com" className="hover:text-primary transition-colors">
                    info@allantequartet.com
                  </a>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  We typically respond within 1-2 business days
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Follow Us
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Stay updated on concerts and events
                </p>
                <div className="flex gap-3">
                  <span className="text-gray-500 text-sm">[Social media links to be added]</span>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-light-gray p-6 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Response Time
                </h3>
                <p className="text-gray-700 text-sm">
                  Monday - Friday: 9am - 5pm PST
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Messages received outside business hours will be responded to on the next business day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-light-blue text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">Book an Event</h3>
                <p className="text-sm mb-3 text-gray-200">
                  Interested in hiring us for your special occasion?
                </p>
                <a
                  href="/hire"
                  className="inline-block bg-white text-primary px-4 py-2 rounded text-sm font-semibold hover:bg-light-gray transition-colors"
                >
                  Request Quote
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sunset Series</h3>
                <p className="text-sm mb-3 text-gray-200">
                  Learn about our outdoor concert series
                </p>
                <a
                  href="/sunset-series"
                  className="inline-block bg-white text-primary px-4 py-2 rounded text-sm font-semibold hover:bg-light-gray transition-colors"
                >
                  View Details
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support Us</h3>
                <p className="text-sm mb-3 text-gray-200">
                  Help us continue bringing music to the community
                </p>
                <a
                  href="/donate"
                  className="inline-block bg-secondary text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Donate Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
