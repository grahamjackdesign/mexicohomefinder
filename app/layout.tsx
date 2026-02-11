import type { Metadata } from 'next';
import './globals.css';
import { TranslationProvider } from '@/components/TranslationProvider';
import LeadCapturePopup from '@/components/LeadCapturePopup';

export const metadata: Metadata = {
  title: {
    default: 'MexicoHomeFinder | Find Your Dream Home in Mexico',
    template: '%s | MexicoHomeFinder',
  },
  description:
    'Discover beautiful properties across Mexico. From colonial gems in San Miguel de Allende to beachfront villas in Puerto Vallarta. Find your perfect home in Mexico.',
  keywords: [
    'Mexico real estate',
    'homes for sale in Mexico',
    'San Miguel de Allende real estate',
    'buy property in Mexico',
    'Mexico homes',
    'expat living Mexico',
    'retire in Mexico',
  ],
  openGraph: {
    title: 'MexicoHomeFinder | Find Your Dream Home in Mexico',
    description:
      'Discover beautiful properties across Mexico. From colonial gems to beachfront villas.',
    url: 'https://mexicohomefinder.com',
    siteName: 'MexicoHomeFinder',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MexicoHomeFinder | Find Your Dream Home in Mexico',
    description:
      'Discover beautiful properties across Mexico. From colonial gems to beachfront villas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900">
        <TranslationProvider>
          {children}
          <LeadCapturePopup />
        </TranslationProvider>
      </body>
    </html>
  );
}
