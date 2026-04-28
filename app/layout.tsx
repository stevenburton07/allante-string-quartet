import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://allantestringquartet.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Allante String Quartet | Utah County Wedding & Event String Quartet',
    template: '%s | Allante String Quartet',
  },
  description:
    'Professional string quartet based in Utah County, serving the Wasatch Front and statewide events. Live chamber music for weddings, corporate events, and private gatherings.',
  keywords: [
    'string quartet',
    'wedding string quartet Utah',
    'Utah County string quartet',
    'wedding music Utah',
    'classical music',
    'chamber music',
    'live wedding music',
    'corporate event musicians',
    'ceremony music',
    'cocktail hour music',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Allante String Quartet',
    title: 'Allante String Quartet | Utah County Wedding & Event String Quartet',
    description:
      'Professional string quartet based in Utah County, serving the Wasatch Front and statewide events. Live chamber music for weddings, corporate events, and private gatherings.',
    images: [
      {
        url: '/images/allante.jpg',
        width: 1200,
        height: 630,
        alt: 'Allante String Quartet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allante String Quartet',
    description:
      'Professional string quartet based in Utah County. Weddings, corporate events, and private gatherings throughout Utah.',
    images: ['/images/allante.jpg'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Allante String Quartet',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.jpg`,
  image: `${SITE_URL}/images/allante.jpg`,
  description:
    'Professional string quartet based in Utah County, performing at weddings, corporate events, private gatherings, and concerts throughout Utah.',
  genre: ['Classical', 'Chamber Music', 'String Quartet'],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Utah County, Utah' },
    { '@type': 'AdministrativeArea', name: 'Salt Lake County, Utah' },
    { '@type': 'State', name: 'Utah' },
  ],
  member: [
    { '@type': 'Person', name: 'Kristi Jenkins', jobTitle: 'Violin' },
    { '@type': 'Person', name: 'Bonnie Whetten', jobTitle: 'Violin' },
    { '@type': 'Person', name: 'Allison Taylor', jobTitle: 'Viola' },
    { '@type': 'Person', name: 'Rachel Burton', jobTitle: 'Cello' },
  ],
  sameAs: [
    'https://www.facebook.com/allantestringquartet/',
    'https://www.instagram.com/allantestringquartet/',
    'https://www.youtube.com/@allantestringquartet',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'booking',
    email: 'allantestringquartet@gmail.com',
    telephone: '+1-801-472-0842',
    availableLanguage: 'English',
    areaServed: 'US-UT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
