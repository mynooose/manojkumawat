/** Identity, navigation and the copy that is not tied to one section. */

export const SITE = {
  name: 'Manoj Kumawat',
  role: 'Solution architect',
  url: 'https://manojkumawat.com',
  email: 'hello@manojkumawat.com',
  linkedin: {
    href: 'https://www.linkedin.com/in/manojkumawat2022/',
    handle: 'in/manojkumawat2022',
  },
  title: 'Manoj Kumawat — Solution Architect',
  description:
    'Solution architect building multi-tenant AI platforms — architecture through to production, and everything that has to keep running afterwards.',
} as const;

export const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#approach', label: 'Approach' },
  { href: '#about', label: 'About' },
] as const;

export const HERO = {
  eyebrow: 'Solution architect · Platform engineering',
  heading: 'I design and build multi-tenant AI platforms.',
  lede: 'Multi-tenant AI platforms — architecture through to production, and everything that has to keep running afterwards.',
  primaryCta: { href: '#contact', label: 'Get in touch' },
  secondaryCta: { href: '#approach', label: 'See how I work' },
} as const;

export interface Stat {
  readonly value: string;
  /** Rendered with an explicit line break at the pipe. */
  readonly label: readonly [string, string];
  readonly suffix?: string;
}

export const STATS: readonly Stat[] = [
  { value: '12', label: ['Engineers led across', 'backend and frontend'] },
  { value: '50+', label: ['Enterprise tenants on', 'platforms I architected'] },
  { value: '99.9', suffix: '%', label: ['Uptime across the', 'platforms I run'] },
  { value: '9', label: ['Years across backend,', 'platform and security'] },
];

export const OPERATION = {
  eyebrow: 'A platform in operation',
  heading: 'Fifty-plus organisations, one platform, no shared state.',
  body: 'Isolation sits at the namespace and data-store boundary rather than in application code — which is why tenant count grows without the blast radius growing with it.',
} as const;

export const CONTACT = {
  eyebrow: 'Contact',
  heading: "Let's talk about what you are building.",
  body: [
    'If you are building a platform, I can take it from architecture to production — or step in wherever it currently stands. Either way it starts with understanding the system properly before anything gets committed to.',
    'A first call is usually thirty minutes: what you are building, where the hard parts are, and whether I am the right person for it.',
  ],
} as const;

export const FOOTER = {
  tagline: 'Architecture first. Then everything else.',
  copyright: '© 2026',
} as const;
