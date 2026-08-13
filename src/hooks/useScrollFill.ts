'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  /** Number of discrete steps on the rail. */
  steps: number;
  /** Read line as a fraction of viewport height. */
  anchor: number;
  /** Multiplier on the progress ratio before rounding. */
  gain: number;
  /** Measure the rail to the last marker instead of the container. */
  measureToLastMarker?: boolean;
  /** Pixels below the last marker where the rail stops. */
  tailOffset?: number;
}

/**
 * Drives a scroll-filled rail: reports how many steps sit above the read line,
 * and how tall the rail should be.
 *
 * Reads are batched into one requestAnimationFrame so a fast scroll cannot
 * queue up layout thrash, and state only updates when a value actually
 * changes.
 */
export function useScrollFill({
  steps,
  anchor,
  gain,
  measureToLastMarker = false,
  tailOffset = 6,
}: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMarkerRef = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);
  const [filled, setFilled] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const ratio = (window.innerHeight * anchor - rect.top) / Math.max(1, rect.height);
    const next = Math.max(0, Math.min(steps, Math.round(ratio * gain)));
    setFilled((prev) => (prev === next ? prev : next));

    if (!measureToLastMarker) return;
    const marker = lastMarkerRef.current;
    const height = marker
      ? Math.round(marker.getBoundingClientRect().top - rect.top + tailOffset)
      : Math.round(rect.height);
    setTrackHeight((prev) => (prev === height ? prev : height));
  }, [anchor, gain, measureToLastMarker, steps, tailOffset]);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Fonts and images settle after first paint and shift the measurements.
    const settle = window.setTimeout(measure, 300);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(settle);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  return { containerRef, lastMarkerRef, filled, trackHeight };
}
