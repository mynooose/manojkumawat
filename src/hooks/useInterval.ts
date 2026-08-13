'use client';

import { useEffect, useRef } from 'react';

/**
 * Declarative setInterval. The callback lives in a ref so replacing it does
 * not restart the timer; passing `null` stops it, which is how every animation
 * here is suspended under reduced motion. Always cleared on unmount.
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
