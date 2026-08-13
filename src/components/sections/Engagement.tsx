'use client';

import { useEffect, useRef, useState } from 'react';
import { PROCESS_STAGES } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useInView } from '@/hooks/useInView';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const AUTO_MS = 3200;
const PAUSE_MS = 1500;
const COUNT = PROCESS_STAGES.length;

export function Engagement() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const resume = useRef<number | null>(null);

  useEffect(() => () => { if (resume.current) window.clearTimeout(resume.current); }, []);

  // Advances only while the stepper is actually on screen.
  useInterval(
    () => setStep((s) => (s + 1) % COUNT),
    reducedMotion || !inView || paused ? null : AUTO_MS,
  );

  const pick = (i: number) => {
    setStep(i);
    setPaused(true);
    if (resume.current) window.clearTimeout(resume.current);
    resume.current = window.setTimeout(() => setPaused(false), PAUSE_MS);
  };

  const active = PROCESS_STAGES[step] ?? PROCESS_STAGES[0]!;
  const trackFill = ((step + 0.5) / COUNT) * 100;

  return (
    <Section id="process" className="bg-surface-2">
      <SectionHeading
        eyebrow="04 — engagement"
        title="How the work runs"
        meta={`0${step + 1} / 0${COUNT}`}
      />

      <Reveal>
        <div ref={ref} className="relative mb-8">
          {/* Track behind the nodes, filled to the current step. */}
          <div
            aria-hidden="true"
            className="absolute top-[17px] right-0 left-0 h-px bg-line"
          />
          <div
            aria-hidden="true"
            className="absolute top-[17px] left-0 h-px bg-accent transition-[width] duration-500"
            style={{ width: `${trackFill}%` }}
          />

          <ol className="relative m-0 grid list-none grid-cols-2 gap-y-6 p-0 min-[760px]:grid-cols-3 min-[1000px]:grid-cols-6">
            {PROCESS_STAGES.map((stage, i) => {
              const current = i === step;
              const reached = i < step;
              return (
                <li key={stage.t} className="flex flex-col items-start gap-3">
                  <button
                    type="button"
                    aria-current={current ? 'step' : undefined}
                    onClick={() => pick(i)}
                    className="group flex flex-col items-start gap-3 text-left"
                  >
                    <span
                      className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border font-mono text-[11.5px] transition duration-300 ${
                        current
                          ? 'border-accent bg-accent text-bg shadow-[0_0_0_5px_rgba(255,92,43,0.14)]'
                          : reached
                            ? 'border-accent-dim bg-surface text-accent'
                            : 'border-line bg-surface text-text-4'
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`max-w-[140px] text-[13.5px] leading-[1.35] transition-colors ${
                        current ? 'text-text' : 'text-text-4 group-hover:text-text-2'
                      }`}
                    >
                      {stage.t}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-container border border-line bg-surface p-[clamp(18px,2.4vw,30px)]">
          <p className="m-0 mb-2 font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
            0{step + 1} — {active.t}
          </p>
          <p className="m-0 mb-5 max-w-[720px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-text-2 text-pretty">
            {active.d}
          </p>
          <div className="flex flex-wrap gap-2">
            {active.deliver.map((item) => (
              <span
                key={item}
                className="rounded-pill border border-line-2 px-3 py-[6px] font-mono text-[11px] text-text-3"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
