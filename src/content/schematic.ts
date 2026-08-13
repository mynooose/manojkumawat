/**
 * The hero schematic: one tenant's journey through the platform, traced on a
 * timer. Each step lights the nodes it touches.
 */

/** Every addressable node in the schematic. */
export type SchematicNode =
  | 'bu0'
  | 'bu1'
  | 'bu2'
  | 'bu3'
  | 'ig'
  | 'tenant'
  | 'da'
  | 'pl0'
  | 'pl1'
  | 'pl2'
  | 'pl3';

export interface TraceStep {
  /** Lifecycle act, shown as the eyebrow. */
  readonly act: 'Onboarding' | 'Training' | 'Serving' | 'Operating';
  /** Short phase name, shown beside the live dot in the card header. */
  readonly phase: string;
  readonly text: string;
  readonly nodes: readonly SchematicNode[];
}

export const BUILD_NODES = [
  { id: 'bu0', label: 'GitHub' },
  { id: 'bu1', label: 'Actions' },
  { id: 'bu2', label: 'Registry' },
  { id: 'bu3', label: 'Helm' },
] as const satisfies readonly { id: SchematicNode; label: string }[];

export const PLATFORM_NODES = [
  { id: 'pl0', label: 'LLM APIs' },
  { id: 'pl1', label: 'Chargebee' },
  { id: 'pl2', label: 'Monitoring' },
  { id: 'pl3', label: 'Network policy' },
] as const satisfies readonly { id: SchematicNode; label: string }[];

export const TENANT_NAMES = ['acme', 'globex', 'initech', 'vantage', 'orbital', 'kestrel'] as const;

/** The three namespace tiles rendered in the cluster. */
export const VISIBLE_TENANTS = ['acme', 'globex', 'initech'] as const;

export const TRACE: readonly TraceStep[] = [
  {
    act: 'Onboarding',
    phase: 'signup',
    text: 'New customer signs up and picks a plan on the main site',
    nodes: ['pl1'],
  },
  {
    act: 'Onboarding',
    phase: 'provision',
    text: 'Provisioner creates a dedicated namespace for the tenant',
    nodes: ['ig', 'tenant'],
  },
  {
    act: 'Onboarding',
    phase: 'dns',
    text: 'Subdomain mapped: acme.platform.com → namespace tenant-acme',
    nodes: ['ig'],
  },
  {
    act: 'Onboarding',
    phase: 'tls',
    text: 'Wildcard TLS issued and bound to the new host',
    nodes: ['ig'],
  },
  {
    act: 'Onboarding',
    phase: 'resources',
    text: 'Helm release deploys app, workers and retrieval service',
    nodes: ['bu3', 'tenant'],
  },
  {
    act: 'Onboarding',
    phase: 'storage',
    text: 'Own MongoDB, Redis and Qdrant collection provisioned',
    nodes: ['da'],
  },
  {
    act: 'Onboarding',
    phase: 'limits',
    text: 'Plan entitlements, quotas and network policy applied',
    nodes: ['pl1', 'pl3'],
  },
  {
    act: 'Training',
    phase: 'ingest',
    text: 'Customer uploads documents · crawled and chunked',
    nodes: ['tenant'],
  },
  {
    act: 'Training',
    phase: 'embed',
    text: 'Chunks embedded and upserted into their own vector index',
    nodes: ['pl0', 'da'],
  },
  {
    act: 'Serving',
    phase: 'request',
    text: 'End user asks a question · TLS terminated at the ingress',
    nodes: ['ig'],
  },
  {
    act: 'Serving',
    phase: 'routing',
    text: 'Host header routes the request to that one namespace',
    nodes: ['ig', 'tenant'],
  },
  {
    act: 'Serving',
    phase: 'retrieval',
    text: 'Top-k retrieval runs against the tenant collection only',
    nodes: ['tenant', 'da'],
  },
  {
    act: 'Serving',
    phase: 'inference',
    text: 'Prompt assembled · model called · reply streamed back',
    nodes: ['tenant', 'pl0'],
  },
  {
    act: 'Operating',
    phase: 'metering',
    text: 'Usage metered against the plan · overage enforced',
    nodes: ['pl1'],
  },
  {
    act: 'Operating',
    phase: 'telemetry',
    text: 'Metrics, logs and traces land in monitoring and alerting',
    nodes: ['pl2'],
  },
  {
    act: 'Operating',
    phase: 'scaling',
    text: 'HPA scales pods per namespace as load moves',
    nodes: ['tenant'],
  },
  {
    act: 'Operating',
    phase: 'release',
    text: 'New build shipped: source → CI → registry → Helm rollout',
    nodes: ['bu0', 'bu1', 'bu2', 'bu3'],
  },
];

/** Timer periods in milliseconds. All suspended under prefers-reduced-motion. */
export const TIMING = {
  trace: 1900,
  cycle: 1150,
  rag: 820,
  checklist: 1500,
  barPulse: 2200,
} as const;

/** Seed values for the live bar chart on the operations panel. */
export const BAR_SEED = [38, 52, 44, 68, 58, 84, 72, 61, 47, 55] as const;

/** p95 latency is derived from the trace index so it moves with the story. */
export function latencyForStep(stepIndex: number): number {
  return 180 + ((stepIndex * 37) % 90);
}
