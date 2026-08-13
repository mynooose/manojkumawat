import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist_Mono } from 'next/font/google';
import { META } from '@/lib/content';
import './globals.css';

/** Display and UI. Weights per DESIGN-SPEC: 400 body, 500 emphasis, 700-800 headings. */
/**
 * Loaded as a variable font across the full weight range, which the spec's
 * 400/500/700/800 all fall inside.
 *
 * The optical-size axis matters: browsers apply font-optical-sizing by default,
 * and without opsz the display sizes render noticeably wider than the
 * reference. next/font only allows `axes` when the weight is variable, so the
 * fixed weight list is intentionally omitted.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
});

/** Labels, numbers, chips and micro-copy. */
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const TITLE = `${META.name} — Solution Architect`;
const DESCRIPTION =
  'I design the system, build it with the team, and own the part where it has to survive production — 50+ enterprise tenants on one platform, fully isolated, 99.9% uptime.';
const SITE_URL = 'https://manojkumawat.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: META.name,
  authors: [{ name: META.name, url: SITE_URL }],
  creator: META.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: META.name,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_GB',
  },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
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
  themeColor: '#0C0C0D',
  width: 'device-width',
  initialScale: 1,
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: META.name,
  jobTitle: 'Solution Architect',
  url: SITE_URL,
  email: `mailto:${META.email}`,
  sameAs: [META.linkedin],
  description: DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${geistMono.variable}`}>
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
