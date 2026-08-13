'use client';

import { useEffect, useRef, useState } from 'react';
import { PROCESS_STAGES } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useInView } from '@/hooks/useInView';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Auto-advance cadence. The design spec said 3.2s; 1s was asked for after
 * seeing it running.
 */
const AUTO_MS = 1000;
/** How long a click holds the stepper before auto-advance resumes. */
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
          {/*
            The connector runs along the axis the stages are laid out on:
            horizontal across one row on desktop, vertical down a single
            column below 1000px. Both fill to the current step, so the
            progress reading is the same either way. The earlier version drew
            only the horizontal rule, which floated across a wrapped grid and
            connected nothing.
          */}
          <div
            aria-hidden="true"
            className="absolute top-[17px] bottom-[17px] left-[17px] w-px bg-line min-[1000px]:top-[17px] min-[1000px]:right-0 min-[1000px]:bottom-auto min-[1000px]:left-0 min-[1000px]:h-px min-[1000px]:w-auto"
          />
          <div
            aria-hidden="true"
            className="absolute top-[17px] left-[17px] w-px bg-accent transition-[height,width] duration-500 min-[1000px]:left-0 min-[1000px]:h-px min-[1000px]:w-auto"
            style={{ height: `calc((100% - 34px) * ${trackFill} / 100)` }}
          />
          {/* Desktop fill is a width; kept separate so one element does not
              have to animate both axes. */}
          <div
            aria-hidden="true"
            className="absolute top-[17px] left-0 hidden h-px bg-accent transition-[width] duration-500 min-[1000px]:block"
            style={{ width: `${trackFill}%` }}
          />

          <ol className="relative m-0 grid list-none grid-cols-1 gap-y-4 p-0 min-[1000px]:grid-cols-6 min-[1000px]:gap-y-6">
            {PROCESS_STAGES.map((stage, i) => {
              const current = i === step;
              const reached = i < step;
              return (
                <li key={stage.t} className="flex">
                  <button
                    type="button"
                    aria-current={current ? 'step' : undefined}
                    onClick={() => pick(i)}
                    className="group flex w-full items-center gap-4 text-left min-[1000px]:w-auto min-[1000px]:flex-col min-[1000px]:items-start min-[1000px]:gap-3"
                  >
                    <span
                      className={`z-10 flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full border font-mono text-[11.5px] transition duration-300 ${
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
                      className={`text-[15px] leading-[1.35] transition-colors min-[1000px]:max-w-[140px] min-[1000px]:text-[13.5px] ${
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

        <div className="surface-depth rounded-container border border-line bg-surface p-[clamp(18px,2.4vw,30px)]">
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
