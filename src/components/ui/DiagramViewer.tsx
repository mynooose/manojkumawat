'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DiagramViewer.module.css';

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

interface DiagramViewerProps {
  /** Path to the diagram under /public. */
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Modal viewer for a full architecture diagram, with stepped zoom and pan by
 * scrolling.
 *
 * Beyond the original behaviour this also traps focus, restores focus to the
 * trigger on close, and locks background scroll — the things a dialog has to do
 * to be usable with a keyboard or a screen reader.
 */
export function DiagramViewer({ src, alt, onClose }: DiagramViewerProps) {
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100)),
    [],
  );
  const zoomReset = useCallback(() => setZoom(ZOOM_MIN), []);

  useEffect(() => {
    restoreFocusTo.current = document.activeElement;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      // Keep Tab inside the dialog.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      if (restoreFocusTo.current instanceof HTMLElement) restoreFocusTo.current.focus();
    };
  }, [onClose]);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        tabIndex={-1}
      >
        <div className={styles.bar}>
          <span className={styles.title}>
            Multi-tenant chatbot SaaS · production architecture
          </span>

          <div className={styles.controls}>
            <button type="button" className={styles.control} onClick={zoomOut} aria-label="Zoom out">
              &#8722;
            </button>
            <span className={styles.level} aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
            <button type="button" className={styles.control} onClick={zoomIn} aria-label="Zoom in">
              +
            </button>
            <button type="button" className={styles.control} onClick={zoomReset}>
              Fit
            </button>
            <button type="button" className={styles.close} onClick={onClose}>
              Close &#10005;
            </button>
          </div>
        </div>

        <div className={styles.canvas}>
          {/* Not next/image: this is a vector diagram that must scale past
              100% for the zoom control to mean anything. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={styles.diagram}
            style={{ width: `${Math.round(zoom * 100)}%` }}
          />
        </div>

        <p className={styles.hint}>Scroll to pan · Esc or click outside to close</p>
      </div>
    </>
  );
}
