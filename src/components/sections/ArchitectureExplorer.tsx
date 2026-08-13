'use client';

import { useMemo, useState } from 'react';
import { ARCHITECTURE_NODES, type ArchitectureNode } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const DEFAULT_NODE = 'api';

export function ArchitectureExplorer() {
  const [selected, setSelected] = useState(DEFAULT_NODE);

  const byZone = useMemo(() => {
    const group = (z: ArchitectureNode['z']) => ARCHITECTURE_NODES.filter((n) => n.z === z);
    return { edge: group('edge'), app: group('app'), data: group('data'), plat: group('plat') };
  }, []);

  const active =
    ARCHITECTURE_NODES.find((n) => n.k === selected) ?? ARCHITECTURE_NODES[0]!;

  return (
    <Section id="architecture" className="bg-surface-2">
      <SectionHeading
        eyebrow="02 — architecture"
        title="One platform, fifty-two tenants"
        meta="select a node"
      />

      <div className="grid grid-cols-1 gap-[clamp(18px,2.2vw,32px)] min-[1000px]:grid-cols-[1.55fr_1fr]">
        <Reveal className="min-w-0" delay={60}>
          {/* Three zones side by side on desktop, two-up on tablet, stacked on phone. */}
          <div className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2 min-[1000px]:grid-cols-[0.85fr_2fr_0.95fr]">
            <Zone label="Edge · shared">
              {byZone.edge.map((n) => (
                <Node key={n.k} node={n} active={n.k === selected} onSelect={setSelected} />
              ))}
            </Zone>

            {/* Dashed boundary marks the tenant isolation line. */}
            <div className="rounded-panel border border-dashed border-line-hover p-3">
              <p className="m-0 mb-3 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
                Tenant boundary · namespace per organisation
              </p>
              <div className="flex flex-col gap-2">
                {byZone.app.map((n) => (
                  <Node key={n.k} node={n} active={n.k === selected} onSelect={setSelected} />
                ))}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 min-[760px]:grid-cols-3">
                {byZone.data.map((n) => (
                  <Node key={n.k} node={n} active={n.k === selected} onSelect={setSelected} />
                ))}
              </div>
            </div>

            <Zone label="Shared platform">
              {byZone.plat.map((n) => (
                <Node key={n.k} node={n} active={n.k === selected} onSelect={setSelected} />
              ))}
            </Zone>
          </div>
        </Reveal>

        {/* Detail panel — sticky on desktop only. */}
        <Reveal className="min-w-0" delay={120}>
          <div className="static min-[1000px]:sticky min-[1000px]:top-[104px] rounded-container border border-line bg-surface p-[clamp(18px,2.2vw,26px)]">
            <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
              {active.zone}
            </p>
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

function Zone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 mb-1 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
        {label}
      </p>
      {children}
    </div>
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
      className={`rounded-node border p-3 text-left transition duration-200 hover:-translate-y-[2px] ${
        active
          ? 'border-accent bg-[rgba(255,92,43,0.10)] text-text shadow-[0_0_0_1px_rgba(255,92,43,0.35),0_8px_26px_rgba(255,92,43,0.12)]'
          : 'border-line-2 bg-surface text-text-2 hover:border-line-hover'
      }`}
    >
      <span className="block text-[13.5px] leading-[1.3] font-medium">{node.n}</span>
      <span className="mt-[3px] block font-mono text-[10px] text-text-4">{node.sub}</span>
    </button>
  );
}
