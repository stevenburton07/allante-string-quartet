import type { Metadata } from 'next';
import Image from 'next/image';
import HireQuoteForm from '@/components/forms/HireQuoteForm';
import { buildFaqJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Hire a Wedding & Event String Quartet in Utah',
  description:
    'Book the Allante String Quartet for weddings, ceremonies, cocktail hours, corporate events, and private gatherings. Based in Utah County, serving the Wasatch Front and statewide events.',
};

const hireFaqs = [
  {
    question: 'How far in advance should we book?',
    answer:
      'For weddings and large events, we recommend booking 3–6 months in advance to secure your preferred date. We do our best to accommodate shorter timelines when our schedule allows, so it is always worth reaching out.',
  },
  {
    question: 'Do you travel outside Utah County?',
    answer:
      'Yes. We are based in Utah County and regularly perform throughout the Wasatch Front — including Salt Lake County, Park City, and Heber — and travel statewide for events. Travel beyond Utah County may include a travel fee depending on the location.',
  },
  {
    question: 'Can you learn a custom song for our ceremony?',
    answer:
      'Absolutely. Custom arrangements are one of our favorite parts of wedding work. Once we have your event details, we can talk through processional, ceremony, and recessional song choices and arrange music that may not already exist for string quartet.',
  },
  {
    question: 'Quartet, trio, duo, or solo — which is right for our event?',
    answer:
      'A full string quartet (two violins, viola, cello) provides the fullest sound and is ideal for weddings, galas, and larger events. Trios, duos, and solo configurations work well for smaller gatherings, intimate ceremonies, and cocktail hours, and are typically more budget-friendly. We can help you choose based on your venue size, guest count, and budget.',
  },
  {
    question: 'Can you perform outdoors?',
    answer:
      'Yes — outdoor performances are common, especially for weddings. We do ask for shade for the musicians and instruments, a backup indoor option in case of weather, and that the temperature is reasonable for string instruments. We will walk through these details with you when planning the event.',
  },
  {
    question: 'What does pricing depend on?',
    answer:
      'Pricing is based on ensemble size (solo, duo, trio, or quartet), performance length, event type, custom arrangements, travel distance, and date. After you submit a quote request, one of the musicians will follow up within 48 hours with pricing tailored to your event.',
  },
];

const hireFaqJsonLd = buildFaqJsonLd(hireFaqs);

export default function HirePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hireFaqJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/allante.jpg"
            alt="Allante String Quartet"
            fill
            className="object-cover opacity-25"
            style={{ objectPosition: '50% 45%' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Hire the Allante String Quartet
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-900">
            Elevate your special event with live chamber music
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Introduction */}
        <section className="mb-16 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            Allante String Quartet provides superb tone quality and blend. This sound is created from seven years of weekly rehearsals with the same musicians. We believe in consistently creating an art form on stage during a concert, and while playing background music.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Based in Utah County, we serve the Wasatch Front and statewide events.
          </p>
          <p className="text-lg text-gray-700">
            After we receive your information, one of the musicians will meet with you directly to discuss all the details to make your event exactly what you envision.
          </p>
        </section>

        {/* Event Types */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Perfect for
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

        {/* Locations */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            In locations like
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Alpine',
              'American Fork',
              'Bluffdale',
              'Bountiful',
              'Cedar City',
              'Cedar Hills',
              'Coalville',
              'Cottonwood Heights',
              'Draper',
              'Eagle Mountain',
              'Heber',
              'Herriman',
              'Highland',
              'Lehi',
              'Lindon',
              'Logan',
              'Ogden',
              'Orem',
              'Park City',
              'Payson',
              'Pleasant Grove',
              'Provo',
              'Riverton',
              'Salt Lake',
              'Sandy',
              'Saratoga Springs',
              'Springville',
              'St. George',
              'Taylorsville',
              'Vineyard',
              'West Jordan',
              'West Valley',
            ].map((city) => (
              <span
                key={city}
                className="bg-light-gray text-gray-700 px-4 py-2 rounded-full text-sm"
              >
                {city}
              </span>
            ))}
            <span className="bg-light-gray text-gray-700 px-4 py-2 rounded-full text-sm">
              and more!
            </span>
          </div>
        </section>

        {/* Performance Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Performance options
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

        {/* Quote Request Form */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Request a quote
          </h2>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <HireQuoteForm />
          </div>
          <div className="mt-6 bg-light-gray rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-8 text-sm text-gray-700">
            <span className="text-gray-600 text-center sm:text-left">Prefer to reach out directly?</span>
            <a
              href="tel:+18014720842"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(801) 472-0842</span>
            </a>
            <a
              href="mailto:allantestringquartet@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition-colors break-all"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>allantestringquartet@gmail.com</span>
            </a>
          </div>
        </section>

        {/* What to Expect */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            What to expect
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Submit your request</h3>
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
                <h3 className="font-semibold text-primary mb-1">Receive your quote</h3>
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
                <h3 className="font-semibold text-primary mb-1">Plan the details</h3>
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
                <h3 className="font-semibold text-primary mb-1">Enjoy your event</h3>
                <p className="text-gray-700 text-sm">
                  Relax and let us provide beautiful music for your special occasion
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Booking FAQs
          </h2>
          <div className="space-y-6">
            {hireFaqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
