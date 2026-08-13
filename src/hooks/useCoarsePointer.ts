'use client';

import { useSyncExternalStore } from 'react';

/** True on devices where hover is not available — phones and most tablets. */
const QUERY = '(hover: none)';

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * Server snapshot reports false, so the markup rendered on the server is the
 * hover-capable one. Touch behaviour is enabled on hydration rather than
 * guessed during SSR.
 */
const getServerSnapshot = () => false;

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
