'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SpineState {
  /** How many steps have been passed, 0..steps. */
  readonly filled: number;
  /** Pixel height of the rail, measured to the last marker. */
  readonly trackHeight: number;
}

export interface UseScrollSpineOptions {
  /** Number of discrete steps on the spine. */
  readonly steps: number;
  /**
   * Fraction of the viewport height used as the read line. The original tuned
   * these separately per spine, so they stay configurable.
   */
  readonly anchor: number;
  /**
   * Multiplier applied to the progress ratio before rounding. Slightly above
   * `steps` so the final step lights before the container fully exits.
   */
  readonly gain: number;
  /** Distance below the last marker where the rail should stop. */
  readonly tailOffset: number;
}

/**
 * Drives a scroll-filled vertical spine.
 *
 * Measures the container against a read line at `anchor` of the viewport and
 * reports how many steps are behind it. Reads are batched into a single
 * requestAnimationFrame so a fast scroll cannot queue up layout thrash.
 *
 * Returns a ref for the container and a ref for the last marker; the rail is
 * measured to the marker rather than the container so the line stops at the
 * final dot instead of overshooting into the padding.
 */
export function useScrollSpine({ steps, anchor, gain, tailOffset }: UseScrollSpineOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMarkerRef = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);
  const [state, setState] = useState<SpineState>({ filled: 0, trackHeight: 0 });

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const readLine = window.innerHeight * anchor;
    const ratio = (readLine - rect.top) / Math.max(1, rect.height);
    const filled = Math.max(0, Math.min(steps, Math.round(ratio * gain)));

    const marker = lastMarkerRef.current;
    const trackHeight = marker
      ? Math.round(marker.getBoundingClientRect().top - rect.top + tailOffset)
      : Math.round(rect.height);

    setState((prev) =>
      prev.filled === filled && prev.trackHeight === trackHeight ? prev : { filled, trackHeight },
    );
  }, [anchor, gain, steps, tailOffset]);

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

  return { containerRef, lastMarkerRef, ...state };
}
