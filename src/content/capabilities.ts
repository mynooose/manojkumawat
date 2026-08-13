/** The six capability domains, all represented in production work. */

export interface Capability {
  readonly title: string;
  readonly tags: readonly string[];
}

export const CAPABILITIES_INTRO = {
  index: '04',
  heading: 'What I work with',
  counter: 'Six domains · all in production',
} as const;

export const CAPABILITIES: readonly Capability[] = [
  {
    title: 'Architecture and platform',
    tags: [
      'Multi-tenant SaaS',
      'Distributed system design',
      'Config-driven development',
      'Spec-driven SDLC',
      'Technical assessment',
      'Estimation',
    ],
  },
  {
    title: 'AI and data',
    tags: [
      'RAG systems',
      'Agentic workflows',
      'LLM integration',
      'Semantic modelling layers',
      'MLOps',
      'Vector search',
    ],
  },
  {
    title: 'Backend',
    tags: [
      'Node.js',
      'Python',
      'REST and service APIs',
      'SQL, NoSQL, time-series',
      'Database design',
    ],
  },
  {
    title: 'Frontend',
    tags: ['React', 'Component systems', 'Design-system implementation'],
  },
  {
    title: 'Cloud and infrastructure',
    tags: [
      'GCP',
      'AWS',
      'Kubernetes and GKE',
      'Docker',
      'CI/CD',
      'Autoscaling',
      'Cost optimisation',
    ],
  },
  {
    title: 'Security and networking',
    tags: ['SSL/TLS', 'IPSec', 'Cryptography', 'VAPT', 'SSO and identity', 'Access control'],
  },
];
