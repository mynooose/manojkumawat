'use client';

import { useEffect, useRef } from 'react';

/**
 * Declarative setInterval.
 *
 * The callback is held in a ref so that changing it does not restart the
 * timer — only a change of `delay` does. Passing `null` stops the timer, which
 * is how every animation on this page is suspended under reduced motion.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}
