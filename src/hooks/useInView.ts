'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether the element is currently on screen.
 *
 * Used to gate the stepper's auto-advance so it only runs while the section is
 * actually being looked at. Unlike useReveal this does not latch — it tracks
 * entry and exit.
 */
export function useInView<T extends HTMLElement>(rootMargin = '-15% 0px -15% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
