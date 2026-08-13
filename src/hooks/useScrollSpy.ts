'use client';

import { useEffect, useState } from 'react';

/**
 * Reports which section is currently in view, for the pill nav.
 *
 * A section becomes active once its top passes 35% of viewport height, which
 * is what the spec asks for. That is a threshold on the section's position
 * rather than on intersection ratio, so a plain scroll handler expresses it
 * more directly than an IntersectionObserver would — reads are batched into
 * one rAF, and the listener is passive.
 *
 * Returns `'top'` while the hero is in view, which highlights nothing.
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState('top');

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const line = window.innerHeight * 0.35;
      let current = 'top';

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}
