'use client';

import { useState } from 'react';
import type { SkillDomain } from '@/lib/content';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SLIDE_MS = 1800;

/**
 * Skill domain card. On hover (or keyboard focus) it flips to the light
 * treatment and cycles its technologies one at a time.
 *
 * The card holds a fixed min-height so flipping never resizes it and shifts
 * the grid. Focus is handled alongside hover so the behaviour is reachable
 * without a pointer.
 */
export function SkillCard({ domain, index }: { domain: SkillDomain; index: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [slide, setSlide] = useState(0);

  const count = domain.technologies.length;

  useInterval(
    () => setSlide((s) => (s + 1) % count),
    active && !reducedMotion ? SLIDE_MS : null,
  );

  const open = () => {
    setSlide(0);
    setActive(true);
  };
  const close = () => setActive(false);

  const tech = domain.technologies[slide] ?? domain.technologies[0]!;

  return (
    <div
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      tabIndex={0}
      role="group"
      aria-label={domain.title}
      className={`flex min-h-[210px] flex-col rounded-card border p-[18px] transition duration-300 ${
        active
          ? '-translate-y-[3px] border-text bg-text'
          : 'border-line bg-surface hover:border-line-hover'
      }`}
    >
      <div
        className={`mb-4 flex items-baseline justify-between gap-3 border-b pb-3 ${
          active ? 'border-[rgba(12,12,13,0.14)]' : 'border-line'
        }`}
      >
        <h3
          className={`m-0 text-[17px] leading-[1.25] font-semibold ${
            active ? 'text-bg' : 'text-text'
          }`}
        >
          {domain.title}
        </h3>
        <span className="flex-none font-mono text-[10px] tracking-[0.14em] text-accent">
          0{index + 1}
        </span>
      </div>

      {active ? (
        <div className="flex flex-1 flex-col justify-between">
          {/* Alternating animation names force a restart on index change. */}
          <div key={slide} className={slide % 2 === 0 ? 'slide-a' : 'slide-b'}>
            <p className="m-0 mb-2 font-mono text-[10px] tracking-[0.14em] text-[#4A463E] uppercase">
              0{slide + 1} / 0{count}
            </p>
            <p className="m-0 mb-2 text-[18px] leading-[1.25] font-semibold text-bg">{tech.name}</p>
            <p className="m-0 text-[13.5px] leading-[1.55] text-[#4A463E] text-pretty">
              {tech.detail}
            </p>
          </div>

          <div aria-hidden="true" className="mt-4 flex gap-[6px]">
            {domain.technologies.map((t, i) => (
              <span
                key={t.name}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  i === slide ? 'bg-bg' : 'bg-[rgba(12,12,13,0.16)]'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap content-start gap-2">
          {domain.technologies.map((t) => (
            <span
              key={t.name}
              className="rounded-pill border border-line-2 px-[10px] py-[5px] font-mono text-[11px] text-text-3"
            >
              {t.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
