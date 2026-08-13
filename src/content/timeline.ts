/** Career timeline shown on the scroll-filled spine in the About section. */

export interface TimelineEntry {
  readonly years: string;
  readonly title: string;
  readonly detail: string;
}

export const ABOUT_INTRO = {
  index: '03',
  eyebrow: 'About',
  heading: 'Systems, then platforms, then AI',
  lede: 'Nine years moving in one direction — from systems and security engineering into platform architecture and AI.',
} as const;

export const TIMELINE: readonly TimelineEntry[] = [
  {
    years: '2013—17',
    title: 'B.Tech Computer Science · IIT (BHU) Varanasi',
    detail: 'Fundamentals first — systems, networks, security.',
  },
  {
    years: '2017—22',
    title: 'Samsung R&D Institute, Noida',
    detail:
      'Software Engineer, then Lead Engineer from 2020 — where the standard for production software was set early.',
  },
  {
    years: '2022',
    title: 'Senior Software Engineer · Cadence Design Systems',
    detail: 'Multithreaded systems work on EDA tooling.',
  },
  {
    years: '2022—24',
    title: 'CTO and Co-founder · Tynza',
    detail: 'Built and ran the platform end to end on AWS and MongoDB.',
  },
  {
    years: '2024—now',
    title: 'Technical Lead · Algo8 AI',
    detail:
      'Senior Backend Developer, then Technical Lead from Oct 2024 — heading the technical team across GCP, AWS and Kubernetes, taking AI platforms from architecture through to production.',
  },
];
