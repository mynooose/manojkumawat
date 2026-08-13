'use client';

import { useState } from 'react';
import type { SkillDomain } from '@/lib/content';
import { useInterval } from '@/hooks/useInterval';
import { useInView } from '@/hooks/useInView';
import { useCoarsePointer } from '@/hooks/useCoarsePointer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Slide cadence: quicker on touch, where the card runs by itself. */
const SLIDE_MS_HOVER = 1800;
const SLIDE_MS_TOUCH = 1000;

/**
 * Skill domain card.
 *
 * On a hover-capable device it flips to the light treatment on hover or
 * keyboard focus and cycles its technologies.
 *
 * On touch there is no hover, so the card that is centred in the viewport
 * activates itself and cycles faster; tapping any card activates it
 * immediately and pins it. Without this the whole interaction was invisible
 * on a phone.
 *
 * The card holds a fixed min-height so flipping never resizes it and shifts
 * the grid.
 */
export function SkillCard({ domain, index }: { domain: SkillDomain; index: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const { ref, inView } = useInView<HTMLDivElement>('-35% 0px -35% 0px');

  const [pointerActive, setPointerActive] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [slide, setSlide] = useState(0);

  const count = domain.technologies.length;
  // On touch: whichever card is centred, or one the reader has tapped.
  const active = coarse ? tapped || inView : pointerActive;

  useInterval(
    () => setSlide((s) => (s + 1) % count),
    active && !reducedMotion ? (coarse ? SLIDE_MS_TOUCH : SLIDE_MS_HOVER) : null,
  );

  const open = () => {
    setSlide(0);
    setPointerActive(true);
  };
  const close = () => setPointerActive(false);

  const onTap = () => {
    if (!coarse) return;
    setSlide(0);
    setTapped(true);
  };

  const tech = domain.technologies[slide] ?? domain.technologies[0]!;

  return (
    <div
      ref={ref}
      onMouseEnter={coarse ? undefined : open}
      onMouseLeave={coarse ? undefined : close}
      onFocus={coarse ? undefined : open}
      onBlur={coarse ? undefined : close}
      onPointerDown={onTap}
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
