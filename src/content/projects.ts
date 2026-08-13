/**
 * Selected work. Client names are deliberately withheld.
 *
 * Note on figures: projects 01 and 04 carry real numbers. The remainder are
 * estimates and should be confirmed or replaced before wider circulation.
 */

export interface ArchitectureLayer {
  /** Short layer label shown in the left column. */
  readonly label: string;
  /** The components sitting at that layer. */
  readonly detail: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly role: string;
  readonly problem: string;
  readonly built: string;
  readonly outcome: string;
  readonly stack: readonly string[];
  readonly layers: readonly ArchitectureLayer[];
  /** Path under /public. Only project 01 ships a diagram today. */
  readonly diagram?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'multi-tenant-chatbot',
    title: 'Multi-tenant chatbot training SaaS',
    role: 'Architecture · Platform engineering · Team lead',
    problem:
      'Enterprise customers needed to train and deploy chatbots on their own private data, with strict isolation between organisations and no shared state between tenants.',
    built:
      'A multi-tenant platform on Google Kubernetes Engine, with a dedicated namespace per tenant and isolated data stores — MongoDB StatefulSets, Redis, and Qdrant vector collections per organisation. Horizontal pod autoscaling and an Nginx ingress controller handle concurrent peak load; Chargebee runs subscription billing and plan enforcement.',
    outcome:
      '50+ enterprise clients, each with 1,000+ users — sustained low-hundreds requests per second at peak, with node and pod autoscaling absorbing burst traffic.',
    stack: ['Node.js', 'Python', 'MongoDB', 'Redis', 'Qdrant', 'GKE', 'Docker', 'Chargebee'],
    diagram: '/architecture-chatbot.svg',
    layers: [
      { label: 'Edge', detail: 'Nginx ingress · TLS · rate limits' },
      { label: 'Namespace', detail: 'API pods · training workers · HPA' },
      { label: 'Stores', detail: 'MongoDB · Redis · Qdrant — per tenant' },
      { label: 'Platform', detail: 'Chargebee · plan enforcement' },
    ],
  },
  {
    id: 'agentic-analytics',
    title: 'Agentic analytics and dashboarding platform',
    role: 'Platform architecture · GenAI integration',
    problem:
      'Industrial clients held operational data across disconnected systems and could not interrogate it without an analyst in the loop. Every question became a ticket.',
    built:
      'A dashboarding platform with a semantic modelling layer (Cube.js) over the warehouse, so metrics are defined once and consumed consistently. On top of it, a GenAI query interface that translates plain-language questions into governed queries, with agentic workflows generating recurring insight summaries.',
    outcome:
      'Deployed across 6 industrial plants, serving 40+ governed dashboards to 200+ operational users — routine analysis requests down by roughly two thirds.',
    stack: ['Node.js', 'Python', 'Cube.js', 'React', 'SQL & time-series', 'GCP'],
    layers: [
      { label: 'Interface', detail: 'React dashboards · natural-language query' },
      { label: 'Agents', detail: 'Query planner · insight summariser' },
      { label: 'Semantic', detail: 'Cube.js models · metric governance' },
      { label: 'Sources', detail: 'Warehouse · time-series · plant systems' },
    ],
  },
  {
    id: 'ai-interviewer',
    title: 'AI interviewer — automated technical screening',
    role: 'Architecture · Development',
    problem:
      'First-round screening consumed senior engineering time at a rate that did not scale with hiring volume.',
    built:
      "A RAG-based system that conducts structured screening interviews, adapts follow-up questions to the candidate's answers, and evaluates responses against role-specific criteria drawn from a retrieval corpus rather than a fixed rubric. Interview services and the vector store run on AWS, with transcripts and evaluations kept in isolated storage per role.",
    outcome:
      '1,200+ candidates screened in the first year, returning an estimated 400 hours of senior engineering time and cutting first-round turnaround from five days to under 24 hours.',
    stack: ['Python', 'Node.js', 'Vector retrieval', 'LLM APIs', 'React', 'AWS'],
    layers: [
      { label: 'Candidate', detail: 'Interview UI · session state' },
      { label: 'Orchestration', detail: 'Question policy · follow-up adaptation' },
      { label: 'Retrieval', detail: 'Role corpus · vector store · LLM APIs' },
      { label: 'Evaluation', detail: 'Scoring · transcript store' },
    ],
  },
  {
    id: 'consultation-platform',
    title: 'Advisor–advisee consultation platform',
    role: 'Architecture · Delivery lead',
    problem:
      'A two-sided advisory marketplace built domain-agnostic from the start — health practitioners first, educators second — where advisors publish availability and advisees book and pay, and neither side tolerates a double-booked slot.',
    built:
      'One booking engine with the advisor domain modelled as configuration rather than code, so health and education verticals run on the same availability rules, slot generation, timezone handling and concurrency control — two advisees cannot claim the same slot under load. Payments, refunds and cancellation policy are enforced server-side, with automated notifications across the consultation lifecycle. Deployed on AWS behind managed load balancing, with scheduled jobs handling reminders and no-shows.',
    outcome:
      'Live with 30+ doctors and 400+ advisees onboarded and 90+ confirmed consultations — zero double-booked slots, and the education vertical added by configuration rather than a second codebase.',
    stack: ['Node.js', 'React', 'SQL', 'Razorpay', 'AWS'],
    layers: [
      { label: 'Clients', detail: 'Advisee app · advisor console' },
      { label: 'Booking', detail: 'Availability rules · slot generation · locking' },
      { label: 'Verticals', detail: 'Health and education as configuration' },
      { label: 'Money', detail: 'Razorpay · refunds · notifications' },
      { label: 'Runtime', detail: 'AWS load balancing · scheduled jobs' },
    ],
  },
  {
    id: 'workflow-automation',
    title: 'Industrial workflow automation',
    role: 'Architecture · Development',
    problem:
      'Inventory, supply chain and sales processes ran on spreadsheets and manual handoffs, with no single view of state and no audit trail.',
    built:
      'Workflow automation across inventory, procurement and sales, with configurable process definitions so new workflows could be added without code changes. Every state transition is recorded, giving the audit trail the spreadsheets never had. Workloads run across AWS and GCP, following where each client already kept their data.',
    outcome:
      '18 processes automated across three departments, saving an estimated 160 hours of manual handling a month and eliminating spreadsheet reconciliation errors.',
    stack: ['Node.js', 'React', 'SQL', 'AWS', 'GCP'],
    layers: [
      { label: 'Operators', detail: 'Task console · approvals' },
      { label: 'Engine', detail: 'Config-driven definitions · state machine' },
      { label: 'Records', detail: 'Transition log · audit trail' },
      { label: 'Domains', detail: 'Inventory · procurement · sales' },
    ],
  },
];

export const ALSO_DELIVERED =
  'Digital twins of industrial plants · multi-plant single sign-on architecture using CyberArk · IPSec tunnel connectivity into client environments · an AIOps tool extending HolmesGPT to monitor and remediate services across GCP VMs and Kubernetes · MLOps and CI/CD pipelines · a spec-driven development workflow adopted across the engineering team.';
