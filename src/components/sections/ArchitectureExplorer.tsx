'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ARCHITECTURE_NODES,
  ARCHITECTURE_TOUR,
  type ArchitectureNode,
  type ArchitectureZone,
} from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useInView } from '@/hooks/useInView';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Ambient tour cadence, and how long a click holds it. */
const TOUR_MS = 2600;
const HOLD_MS = 9000;

/** The query path drawn under the RAG service, straight from the diagram. */
const QUERY_PATH = ['message', 'embed', 'retrieve', 'prompt', 'response'];

/**
 * Interactive version of the shipped architecture diagram.
 *
 * It walks itself: while the section is on screen the tour steps through the
 * path a request actually takes, so the story reads without anyone clicking.
 * Clicking a node pins it and holds the tour long enough to read the panel.
 */
export function ArchitectureExplorer() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>('-10% 0px -10% 0px');

  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState<string | null>(null);
  const hold = useRef<number | null>(null);

  useInterval(
    () => setStep((s) => (s + 1) % ARCHITECTURE_TOUR.length),
    reducedMotion || !inView || pinned ? null : TOUR_MS,
  );

  const selected = pinned ?? ARCHITECTURE_TOUR[step] ?? ARCHITECTURE_NODES[0]!.k;

  const pick = useCallback((k: string) => {
    setPinned(k);
    if (hold.current) window.clearTimeout(hold.current);
    hold.current = window.setTimeout(() => setPinned(null), HOLD_MS);

    if (typeof window === 'undefined' || window.innerWidth >= 1000) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() =>
      document.getElementById('architecture-detail')?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      }),
    );
  }, []);

  const byZone = useMemo(() => {
    const group = (z: ArchitectureZone) => ARCHITECTURE_NODES.filter((n) => n.z === z);
    return {
      client: group('client'),
      edge: group('edge'),
      control: group('control'),
      app: group('app'),
      data: group('data'),
      plat: group('plat'),
      build: group('build'),
    };
  }, []);

  const active = ARCHITECTURE_NODES.find((n) => n.k === selected) ?? ARCHITECTURE_NODES[0]!;
  const touring = !pinned && !reducedMotion && inView;

  const node = (n: ArchitectureNode) => (
    <Node key={n.k} node={n} active={n.k === selected} onSelect={pick} />
  );

  return (
    <Section id="architecture" className="bg-surface-2">
      <SectionHeading
        eyebrow="02 — architecture"
        title="One platform, fifty-two tenants"
        meta={touring ? 'following a request · click to hold' : 'click any node'}
      />

      <div className="grid grid-cols-1 gap-[clamp(18px,2.2vw,32px)] min-[1000px]:grid-cols-[1.6fr_1fr]">
        <Reveal className="min-w-0" delay={60}>
          <div ref={ref} className="flex flex-col">
            <Region label="Client and infrastructure">
              <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
                {byZone.client.map(node)}
              </div>
            </Region>

            <FlowV active={touring} />

            <Region label="Edge and network">
              <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-2">
                {byZone.edge.map(node)}
              </div>
            </Region>

            <FlowV active={touring} />

            <div className="grid grid-cols-1 items-start gap-3 min-[1000px]:grid-cols-[0.68fr_auto_1.9fr] min-[1000px]:gap-0">
              <Region label="Build and release">
                <div className="flex flex-col gap-2">{byZone.build.map(node)}</div>
              </Region>

              {/* Releases flow sideways into the cluster; only meaningful once
                  the two sit side by side. */}
              <div className="hidden self-center px-2 min-[1000px]:block">
                <FlowH active={touring} />
              </div>

              <div className="min-w-0 rounded-panel border border-line bg-surface-3b p-3 min-[1000px]:ml-0">
                <p className="m-0 mb-3 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
                  Production GKE cluster · one namespace per tenant
                </p>

                <div className="rounded-inner border border-line-2 bg-surface-2 p-[10px]">
                  <p className="m-0 mb-2 font-mono text-[9px] tracking-[0.16em] text-text-4 uppercase">
                    Master namespace · shared control plane
                  </p>
                  <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
                    {byZone.control.map(node)}
                  </div>
                </div>

                <FlowV active={touring} short />

                {/* Dashed boundary: the isolation line the whole design turns on. */}
                <div className="rounded-inner border border-dashed border-line-hover bg-surface-2 p-[10px]">
                  <p className="m-0 mb-2 font-mono text-[9px] tracking-[0.16em] text-text-4 uppercase">
                    Tenant boundary · fully isolated stack per client
                  </p>

                  <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
                    {byZone.app.map(node)}
                  </div>

                  <FlowV active={touring} short />
                  <QueryPath lit={selected === 'rag'} />
                  <FlowV active={touring} short />

                  <div className="grid grid-cols-1 gap-2 min-[560px]:grid-cols-3">
                    {byZone.data.map(node)}
                  </div>
                </div>
              </div>
            </div>

            <FlowV active={touring} />

            <Region label="Shared platform · managed and third party">
              <div className="grid grid-cols-2 gap-2 min-[760px]:grid-cols-4">
                {byZone.plat.map(node)}
              </div>
            </Region>
          </div>
        </Reveal>

        <Reveal className="min-w-0" delay={120}>
          <div
            id="architecture-detail"
            className="surface-depth static scroll-mt-[96px] rounded-container border border-line bg-surface p-[clamp(18px,2.2vw,26px)] min-[1000px]:sticky min-[1000px]:top-[104px]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="m-0 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                {active.zone}
              </p>
              {touring ? (
                <span className="flex flex-none items-center gap-[6px] font-mono text-[9px] tracking-[0.14em] text-text-4 uppercase">
                  <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                  {String(step + 1).padStart(2, '0')} / {ARCHITECTURE_TOUR.length}
                </span>
              ) : null}
            </div>

            <h3 className="m-0 mb-1 text-[22px] leading-[1.2] font-semibold">{active.n}</h3>
            <p className="m-0 mb-5 font-mono text-[11.5px] text-text-4">{active.sub}</p>

            <dl className="m-0 flex flex-col gap-4">
              {active.meta.map(([label, value]) => (
                <div key={label}>
                  <dt className="m-0 mb-1 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
                    {label}
                  </dt>
                  <dd className="m-0 text-[14px] leading-[1.6] text-text-2 text-pretty">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** A bordered region, so each stage reads as one thing rather than loose cards. */
function Region({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-panel border border-line bg-surface-3b p-3">
      <p className="m-0 mb-2 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * Vertical connector between two regions, with a pulse travelling down it
 * while the tour is running. The rail stays put; only the highlight moves.
 */
function FlowV({ active, short = false }: { active: boolean; short?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex justify-center ${short ? 'py-[6px]' : 'py-[10px]'}`}>
      <span
        className={`flow-v w-px ${short ? 'h-4' : 'h-6'} ${active ? '' : 'flow-off'}`}
      />
    </div>
  );
}

/** Horizontal connector, used where the build column feeds the cluster. */
function FlowH({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className={`flow-h block h-px w-8 ${active ? '' : 'flow-off'}`} />
  );
}

function Node({
  node,
  active,
  onSelect,
}: {
  node: ArchitectureNode;
  active: boolean;
  onSelect: (k: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(node.k)}
      className={`min-w-0 rounded-node border p-[10px] text-left transition duration-300 hover:-translate-y-[2px] ${
        active
          ? 'border-accent bg-[rgba(255,92,43,0.10)] text-text shadow-[0_0_0_1px_rgba(255,92,43,0.35),0_8px_26px_rgba(255,92,43,0.12)]'
          : 'border-line-2 bg-surface text-text-2 hover:border-line-hover'
      }`}
    >
      {/* The name wraps: these are real component names and clipping them
          ("Client and plan re…") costs more than a second line. */}
      <span className="block text-[13px] leading-[1.25] font-medium text-balance">{node.n}</span>
      <span className="mt-[3px] block truncate font-mono text-[9.5px] text-text-4">{node.sub}</span>
    </button>
  );
}

/** The retrieval path, drawn as a strip. Lights up while the RAG node is active. */
function QueryPath({ lit }: { lit: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-inner border px-[10px] py-2 transition-colors duration-300 ${
        lit ? 'border-accent bg-[rgba(255,92,43,0.06)]' : 'border-line-3b bg-surface-2'
      }`}
    >
      {QUERY_PATH.map((stepLabel, i) => (
        <span key={stepLabel} className="flex items-center gap-2">
          <span
            className={`font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-300 ${
              lit ? 'text-accent' : 'text-text-4'
            }`}
          >
            {stepLabel}
          </span>
          {i < QUERY_PATH.length - 1 ? (
            <span className={lit ? 'text-accent' : 'text-line-hover'}>→</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
