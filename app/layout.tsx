import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const headingFont = localFont({
  src: '../public/fonts/Bamboo.otf',
  variable: '--font-heading',
  display: 'swap',
  // Bamboo has a small x-height and reads small at a given px size.
  // size-adjust scales every heading up uniformly while keeping the
  // existing responsive type scale (text-2xl/3xl/...) intact.
  declarations: [{ prop: 'size-adjust', value: '125%' }],
});

// Dashboard/admin headings use smaller type sizes (stat labels, section
// headers) than the public site, so Bamboo reads even smaller there.
// Same size-adjust trick, scoped to the admin area via .admin-scope.
const headingFontAdmin = localFont({
  src: '../public/fonts/Bamboo.otf',
  variable: '--font-heading-admin',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '175%' }],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://allantestringquartet.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Allante String Quartet | Professional String Quartet of Utah County',
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
    title: 'Allante String Quartet | Professional String Quartet of Utah County',
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
    <html lang="en" className={`${headingFont.variable} ${headingFontAdmin.variable}`}>
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
