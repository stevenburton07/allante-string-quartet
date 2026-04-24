import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allante String Quartet',
  description: 'Professional string quartet bringing beautiful chamber music to Utah County and beyond',
  keywords: ['string quartet', 'classical music', 'Utah County', 'chamber music', 'wedding music', 'private events'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
