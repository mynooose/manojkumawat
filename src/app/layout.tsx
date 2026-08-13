import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { SITE } from '@/content/site';
import '@/styles/tokens.css';
import './globals.css';

/**
 * Fonts are self-hosted by next/font at build time. The previous build pulled
 * these from the Google Fonts CDN on every visit, which cost a render-blocking
 * round trip and left the page in a fallback face if the CDN was slow.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: SITE.title,
    description: SITE.description,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#9C4A1E',
  width: 'device-width',
  initialScale: 1,
};

/**
 * JSON-LD so search engines and assistants can read the identity directly
 * rather than inferring it from the copy.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: 'Solution Architect',
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  sameAs: [SITE.linkedin.href],
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body>
        <script
          type="application/ld+json"
          // Serialised from a literal above; no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
