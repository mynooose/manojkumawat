'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { CAREER, META, SKILLS } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useScrollFill } from '@/hooks/useScrollFill';
import { useNearestToCentre } from '@/hooks/useNearestToCentre';
import { useCoarsePointer } from '@/hooks/useCoarsePointer';
import { SkillCard } from '@/components/ui/SkillCard';

export function About() {
  /**
   * Exactly one skill card is active at a time on touch: whichever is nearest
   * the viewport centre, unless the reader has tapped one, which wins until
   * they scroll again.
   */
  const skillsRef = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const nearest = useNearestToCentre(skillsRef, coarse);
  // A tap wins over the scroll position, but only until the reader scrolls far
  // enough for a different card to become the nearest one — then it is
  // naturally superseded, with no effect needed to clear it.
  const [tap, setTap] = useState<{ index: number; whileNearest: number } | null>(null);
  const activeSkill = tap && tap.whileNearest === nearest ? tap.index : nearest;

  const { containerRef, lastMarkerRef, filled, trackHeight } = useScrollFill({
    steps: CAREER.length,
    anchor: 0.62,
    gain: 5.4,
    measureToLastMarker: true,
    tailOffset: 6,
  });

  const fillHeight = Math.round((filled / CAREER.length) * trackHeight);

  return (
    <Section id="about">
      <SectionHeading eyebrow="05 — about" title="Nine years, one direction" />

      <div className="grid grid-cols-1 gap-[clamp(18px,2.2vw,32px)] min-[1000px]:grid-cols-[0.8fr_1.2fr]">
        <Reveal delay={60}>
          <div className="surface-depth overflow-hidden rounded-container border border-line bg-surface">
            <Image
              src="/portrait-manoj.png"
              alt={META.name}
              width={1000}
              height={1250}
              sizes="(max-width: 1000px) 100vw, 33vw"
              className="block aspect-[4/5] w-full object-cover object-[50%_12%]"
            />
            <div className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3 font-mono text-[10px] tracking-[0.14em] uppercase">
              <span className="text-text-2">{META.name}</span>
              <span className="text-accent">{META.location}</span>
            </div>
          </div>
        </Reveal>

        {/* Career spine */}
        <Reveal delay={120}>
          <div
            ref={containerRef}
            className="relative [--rail:84px] min-[760px]:[--rail:126px]"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-[var(--rail)] w-px bg-line"
              style={{ height: `${trackHeight}px` }}
            />
            <div
              aria-hidden="true"
              className="absolute top-0 left-[var(--rail)] w-px bg-accent transition-[height] duration-500"
              style={{ height: `${fillHeight}px` }}
            />

            {CAREER.map((entry, i) => {
              const reached = i < filled;
              const isLast = i === CAREER.length - 1;
              const isNow = isLast && reached;
              return (
                <div
                  key={entry.y}
                  className={`grid grid-cols-[74px_20px_1fr] gap-x-0 py-4 min-[760px]:grid-cols-[114px_24px_1fr] min-[1000px]:py-[clamp(20px,2.6vw,34px)] ${
                    isNow ? 'bg-[rgba(255,92,43,0.05)]' : ''
                  }`}
                >
                  <span
                    className={`pt-1 pr-4 font-mono text-[11px] tracking-[0.08em] ${
                      reached ? 'text-accent' : 'text-text-4'
                    }`}
                  >
                    {entry.y}
                  </span>
                  <span aria-hidden="true" className="flex justify-center pt-[7px]">
                    <span
                      ref={isLast ? (el) => void (lastMarkerRef.current = el) : undefined}
                      className={`h-[11px] w-[11px] rounded-full border transition duration-500 ${
                        reached ? 'border-accent bg-accent' : 'border-line-2 bg-surface'
                      } ${isNow ? 'shadow-[0_0_0_4px_rgba(255,92,43,0.16)]' : ''}`}
                    />
                  </span>
                  <span className="block">
                    <span className="block text-[16px] leading-[1.3] font-medium text-text min-[1000px]:text-[17px]">
                      {entry.t}
                    </span>
                    <span className="mt-1 block text-[14px] leading-[1.6] text-text-3 text-pretty min-[1000px]:text-[15px]">
                      {entry.d}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* What I work with */}
      <div className="mt-[clamp(36px,4vw,64px)]">
        <Reveal as="p" className="m-0 mb-5 font-mono text-[11.5px] tracking-[0.14em] text-accent uppercase">
          What I work with
        </Reveal>
        <div
          ref={skillsRef}
          className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2 min-[1000px]:grid-cols-3"
        >
          {SKILLS.map((domain, i) => (
            <SkillCard
              key={domain.title}
              domain={domain}
              index={i}
              coarse={coarse}
              autoActive={activeSkill === i}
              onActivate={(i) => setTap({ index: i, whileNearest: nearest })}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
