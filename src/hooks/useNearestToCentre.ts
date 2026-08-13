'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reports which child of `containerRef` is nearest the vertical centre of the
 * viewport, or -1 when none of them is on screen.
 *
 * A single controller is the only way to guarantee that exactly one card is
 * active: letting each card decide from its own IntersectionObserver means
 * two neighbours can both satisfy the test at the same time, which is what
 * happened when the band was wide enough to span a gap.
 *
 * Pass `enabled: false` on hover-capable devices, where hover decides instead.
 */
export function useNearestToCentre(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
): number {
  const [index, setIndex] = useState(-1);
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    frame.current = null;
    const el = containerRef.current;
    if (!el) return;

    const centre = window.innerHeight / 2;
    let best = -1;
    let bestDistance = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const rect = child.getBoundingClientRect();
      // Ignore anything fully off screen.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const distance = Math.abs(rect.top + rect.height / 2 - centre);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });

    setIndex((prev) => (prev === best ? prev : best));
  }, [containerRef]);

  useEffect(() => {
    // Nothing to track on hover-capable devices; the disabled result is
    // derived below rather than written back into state, which would be a
    // cascading render.
    if (!enabled) return;

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [enabled, measure]);

  return enabled ? index : -1;
}
