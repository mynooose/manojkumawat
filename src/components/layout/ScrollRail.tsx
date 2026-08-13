'use client';

import { useEffect, useRef, useState } from 'react';
import { NAV_IDS, RAIL_SECTIONS } from '@/lib/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';

/** How long after the last scroll event the rail fades away. */
const IDLE_MS = 900;

/**
 * Section rail pinned to the right edge, for phones and tablets.
 *
 * The pill nav hides its links below 760px, which leaves a reader with no
 * sense of where they are in the page. This shows one marker per section with
 * the current one expanded and labelled — and only while the page is actually
 * moving, fading out quietly once scrolling stops so it never sits on top of
 * the content.
 *
 * Marked aria-hidden: it duplicates the primary navigation and exists to
 * report scroll position, so exposing it again to assistive technology would
 * just be noise.
 */
export function ScrollRail() {
  const active = useScrollSpy(NAV_IDS);
  const [visible, setVisible] = useState(false);
  const idle = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(true);
      if (idle.current) window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setVisible(false), IDLE_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (idle.current) window.clearTimeout(idle.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 right-2 z-[105] hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-300 max-[759px]:flex ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {RAIL_SECTIONS.map((section) => {
        const on = active === section.id;
        return (
          <span key={section.id} className="flex items-center gap-2">
            <span
              className={`rounded-pill bg-[rgba(12,12,13,0.82)] font-mono text-[9.5px] tracking-[0.14em] whitespace-nowrap text-text uppercase backdrop-blur-[6px] transition-all duration-300 ${
                on ? 'max-w-[140px] px-2 py-1 opacity-100' : 'max-w-0 overflow-hidden px-0 py-0 opacity-0'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`h-[2px] rounded-full transition-all duration-300 ${
                on ? 'w-5 bg-accent' : 'w-2.5 bg-line-hover'
              }`}
            />
          </span>
        );
      })}
    </div>
  );
}
