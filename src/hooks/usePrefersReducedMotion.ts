'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * Server snapshot assumes reduced motion, so the markup is produced in its
 * non-animating form and animation is enabled on hydration. A user who asked
 * for less motion never sees a frame of it.
 */
const getServerSnapshot = () => true;

/** Tracks the reduced-motion preference, staying current if it changes. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
