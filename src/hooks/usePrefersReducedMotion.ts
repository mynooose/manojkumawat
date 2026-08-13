'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Server snapshot: assume reduced motion.
 *
 * The preference cannot be known during server rendering, so the markup is
 * produced in its non-animating form and animation is enabled on hydration.
 * Erring this way means a user who wants less motion never sees a frame of it.
 */
function getServerSnapshot(): boolean {
  return true;
}

/**
 * Tracks the user's reduced-motion preference, staying current if they change
 * it mid-session.
 *
 * Implemented with useSyncExternalStore rather than useState + useEffect: a
 * media query is an external store, and subscribing to it this way avoids the
 * cascading render that setState-inside-an-effect causes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
