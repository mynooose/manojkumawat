'use client';

import { useState } from 'react';
import { HERO } from '@/lib/content';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Live stat bounds, copied from the reference so the numbers stay plausible. */
const RPS = { min: 240, max: 420, swing: 34 };
const P95 = { min: 96, max: 148, swing: 12 };
const TICK_MS = 2400;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [rps, setRps] = useState(312);
  const [p95, setP95] = useState(118);

  useInterval(() => {
    setRps((v) => clamp(v + Math.round((Math.random() - 0.5) * RPS.swing), RPS.min, RPS.max));
    setP95((v) => clamp(v + Math.round((Math.random() - 0.5) * P95.swing), P95.min, P95.max));
  }, reducedMotion ? null : TICK_MS);

  return (
    <section className="relative flex min-h-screen flex-col">
      {/* Two drifting glows. No CSS blur filter — large blurred layers blank
          the page in some browsers (see DESIGN-SPEC). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[22%] left-[6%] h-[min(60vw,900px)] w-[min(60vw,900px)] bg-[radial-gradient(circle,rgba(255,92,43,0.20),transparent_62%)]" />
        <div className="absolute -right-[6%] -bottom-[28%] h-[min(52vw,820px)] w-[min(52vw,820px)] bg-[radial-gradient(circle,rgba(120,88,255,0.18),transparent_64%)]" />
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-[clamp(20px,4vw,56px)] pt-[clamp(96px,10vw,132px)] pb-[clamp(26px,3vw,40px)]">
        <span className="rise mb-[clamp(22px,3vw,34px)] inline-flex self-start items-center gap-[10px] rounded-pill border border-line-2 bg-white/[0.03] px-4 py-2 font-mono text-[12px] tracking-[0.08em] text-[#B9B7B1] uppercase [animation-delay:100ms]">
          <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-accent" />
          {HERO.pill}
        </span>

        <h1 className="m-0 mb-[clamp(26px,3.4vw,40px)] text-h1 leading-[0.86] font-bold tracking-[-0.05em]">
          <span className="rise block [animation-delay:160ms]">{HERO.headline[0]}</span>
          <span className="rise block text-text-5 [animation-delay:240ms]">
            {/* The final word carries the accent; the rest of the line is muted. */}
            that don&apos;t <span className="text-accent">break</span>.
          </span>
        </h1>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-x-[50px] gap-y-[26px]">
          <p className="rise m-0 max-w-[540px] text-[clamp(16px,1.4vw,19px)] leading-[1.55] text-text-2 text-pretty [animation-delay:340ms]">
            {HERO.lede}
          </p>

          <div className="rise flex flex-wrap gap-x-[26px] gap-y-[22px] justify-self-start md:justify-self-end [animation-delay:420ms]">
            <Stat value={rps} label="req / sec now" accent />
            <Stat value={p95} label="p95 ms" />
            <Stat value="50+" label="tenants" />
          </div>
        </div>
      </div>

      <Marquee items={HERO.marquee} />
    </section>
  );
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className={`border-l-2 pl-[14px] ${accent ? 'border-accent' : 'border-line-2'}`}>
      <p className="m-0 font-mono text-[clamp(24px,2.6vw,36px)] leading-none tracking-[-0.02em] text-text tabular-nums">
        {value}
      </p>
      <p className="mt-[5px] mb-0 font-mono text-[11px] tracking-[0.08em] text-text-4 uppercase">
        {label}
      </p>
    </div>
  );
}

/**
 * Infinite marquee. The track holds the list twice and translates by -50%, so
 * the second copy is exactly where the first started when the loop repeats.
 */
function Marquee({ items }: { items: readonly string[] }) {
  const row = (
    <div className="flex items-center gap-10 px-5 py-[13px] font-mono text-[11.5px] tracking-[0.1em] whitespace-nowrap text-text-6 uppercase">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-line-3"
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
