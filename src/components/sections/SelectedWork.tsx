'use client';

import { useState } from 'react';
import { ALSO_DELIVERED, PROJECTS } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { CaseStudyModal } from '@/components/ui/CaseStudyModal';

const pad = (n: number) => '0' + (n + 1);

export function SelectedWork() {
  const [selected, setSelected] = useState(0);
  const [caseOpen, setCaseOpen] = useState(false);

  const project = PROJECTS[selected] ?? PROJECTS[0]!;

  return (
    <Section id="work">
      <SectionHeading
        eyebrow="01 — selected work"
        title="Platforms in production"
        meta={`${pad(selected)} / 0${PROJECTS.length} · names withheld`}
      />

      <div className="grid grid-cols-1 gap-[clamp(18px,2.2vw,32px)] min-[1000px]:grid-cols-3">
        {/* Rail */}
        <Reveal className="flex flex-col gap-3" delay={60}>
          <div role="tablist" aria-label="Selected work" className="flex flex-col gap-3">
            {PROJECTS.map((item, i) => {
              const active = i === selected;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="work-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(i)}
                  className={`rounded-card border p-[18px] text-left transition duration-200 hover:-translate-y-[2px] ${
                    active
                      ? 'border-accent bg-[rgba(255,92,43,0.07)]'
                      : 'border-line bg-surface hover:border-line-hover'
                  }`}
                >
                  <span className="mb-[10px] flex items-center justify-between font-mono text-[10.5px] tracking-[0.14em] uppercase">
                    <span className={active ? 'text-accent' : 'text-text-4'}>{pad(i)}</span>
                    <span className={active ? 'text-accent' : 'text-text-4'}>
                      {active ? 'reading' : item.tag}
                    </span>
                  </span>
                  <span
                    className={`block text-[16.5px] leading-[1.3] font-medium ${
                      active ? 'text-text' : 'text-[#B9B7B1]'
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-card border border-dashed border-line p-[18px]">
            <p className="m-0 mb-2 font-mono text-[10.5px] tracking-[0.14em] text-text-4 uppercase">
              Also delivered
            </p>
            <p className="m-0 text-[13.5px] leading-[1.6] text-text-3 text-pretty">
              {ALSO_DELIVERED}
            </p>
          </div>
        </Reveal>

        {/* Detail panel */}
        <Reveal
          id="work-panel"
          className="surface-depth min-w-0 rounded-container border border-line bg-[linear-gradient(155deg,var(--color-surface-3a),var(--color-surface-3b))] p-[clamp(20px,2.6vw,34px)] min-[1000px]:col-span-2"
          delay={120}
        >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="m-0 mb-[10px] font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
                {project.role}
              </p>
              <h3 className="m-0 text-h3-feature leading-[1.04] font-bold tracking-[-0.03em]">
                {project.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setCaseOpen(true)}
              className="flex-none rounded-pill border border-line-2 px-5 py-3 font-mono text-[11.5px] tracking-[0.08em] text-text uppercase transition duration-200 hover:-translate-y-[2px] hover:border-accent hover:bg-accent hover:text-bg active:translate-y-0 active:scale-[0.985] active:duration-[180ms]"
            >
              Open case study <span aria-hidden="true">&#8599;</span>
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-x-[32px] gap-y-5 min-[760px]:grid-cols-2">
            <div>
              <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                The problem
              </p>
              <p className="m-0 text-[15px] leading-[1.65] text-text-2 text-pretty">
                {project.problem}
              </p>
            </div>
            <div>
              <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                What I built
              </p>
              <p className="m-0 text-[15px] leading-[1.65] text-text-2 text-pretty">
                {project.built}
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 min-[760px]:grid-cols-2">
            {project.layers.map((layer) => (
              <div key={layer.t} className="rounded-inner border border-line bg-surface p-[14px]">
                <p className="m-0 mb-1 font-mono text-[9.5px] tracking-[0.16em] text-accent uppercase">
                  {layer.t}
                </p>
                <p className="m-0 font-mono text-[12.5px] leading-[1.5] text-text-2">
                  {layer.line}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-pill border border-line-2 px-3 py-[6px] font-mono text-[11px] text-text-3"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="rounded-panel border border-line-2 bg-surface p-[clamp(16px,2vw,22px)]">
            <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
              Outcome
            </p>
            <p className="m-0 text-[clamp(16px,1.6vw,20px)] leading-[1.45] font-medium text-text text-pretty">
              {project.outcome}
            </p>
          </div>
        </Reveal>
      </div>

      {caseOpen ? (
        <CaseStudyModal
          index={pad(selected)}
          project={project}
          onClose={() => setCaseOpen(false)}
        />
      ) : null}
    </Section>
  );
}
