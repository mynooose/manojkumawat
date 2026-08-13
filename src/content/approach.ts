/** The six delivery stages, always run in this order. */

export interface ApproachStage {
  readonly title: string;
  readonly summary: string;
  /** Slash-separated deliverables shown beneath the summary. */
  readonly artefacts: string;
}

export const APPROACH_INTRO = {
  index: '02',
  eyebrow: 'How I work',
  heading: 'How an engagement runs',
  lede: 'Six stages, always in this order. Testing, review and deployment happen inside each build phase rather than being saved for the end.',
} as const;

export const APPROACH_STAGES: readonly ApproachStage[] = [
  {
    title: 'Assessment',
    summary:
      'Designs and requirements read in full. Scope, effort and risk fixed before anything is quoted.',
    artefacts: 'Scope matrix / effort model / risk register / assumption log',
  },
  {
    title: 'Discovery and architecture',
    summary:
      'The system defined end to end: data, service boundaries, tenancy, failure modes, performance targets.',
    artefacts:
      'Architecture diagrams / data model / API contracts / auth & tenancy / NFR targets',
  },
  {
    title: 'Setup and foundation',
    summary:
      'Environments as code, pipelines and observability first — then the foundation every feature leans on.',
    artefacts: 'IaC environments / CI-CD / secrets / observability / RBAC / billing / notifications',
  },
  {
    title: 'Phased build',
    summary:
      'Capability phases in agreed order. Each one closes with a reviewed, tested, deployed release.',
    artefacts: '',
  },
  {
    title: 'Launch',
    summary:
      'UAT, independent penetration test, load test to target, cutover with a rollback path, full handover.',
    artefacts: 'UAT sign-off / VAPT report / load-test results / runbooks / credentials',
  },
  {
    title: 'Operate and evolve',
    summary:
      'SLO monitoring, defined escalation, patch cadence, cost review — and the next phases when you need them.',
    artefacts: 'SLO dashboards / alerting & escalation / patch cadence / cost reviews',
  },
];

/** The build → test → review → release loop shown inside stage 04. */
export const BUILD_LOOP = ['Build', 'Test', 'Review', 'Release'] as const;
