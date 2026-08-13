'use client';

import { useEffect, useRef } from 'react';
import { ArchitectureViewer } from './ArchitectureViewer';

interface DiagramModalProps {
  title: string;
  role: string;
  src: string;
  onClose: () => void;
}

/**
 * Architecture diagram in a centred panel.
 *
 * Deliberately not full-bleed: the page stays visible around the edges, so
 * the way back is obvious and clicking anywhere outside dismisses it. The
 * panel still takes nearly the whole viewport, since the diagram needs room.
 *
 * A real dialog: focus moves in, Tab is trapped, background scroll is locked,
 * Esc closes, and focus returns to the trigger afterwards.
 */
export function DiagramModal({ title, role, src, onClose }: DiagramModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<Element | null>(null);

  useEffect(() => {
    restoreTo.current = document.activeElement;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

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
      body.style.overflow = prevOverflow;
      if (restoreTo.current instanceof HTMLElement) restoreTo.current.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Click anywhere outside the panel to go back to the page. */}
      <button
        type="button"
        aria-label="Close diagram"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(6,6,7,0.78)] backdrop-blur-[6px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Architecture diagram: ${title}`}
        tabIndex={-1}
        className="modal-in absolute top-1/2 left-1/2 flex focus:outline-none focus-visible:outline-none h-[min(880px,calc(100dvh-28px))] w-[calc(100vw-16px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-panel border border-line bg-bg shadow-[0_30px_90px_rgba(0,0,0,0.55)] min-[760px]:h-[min(880px,calc(100dvh-72px))] min-[760px]:w-[min(1280px,calc(100vw-72px))] min-[760px]:rounded-container"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-[clamp(14px,2.4vw,24px)] py-3">
          <div className="min-w-0">
            <p className="m-0 font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
              Architecture diagram
            </p>
            <p className="m-0 truncate text-[15px] font-medium text-text">{title}</p>
            <p className="m-0 hidden font-mono text-[10px] tracking-[0.12em] text-text-4 uppercase min-[560px]:block">
              {role}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex-none rounded-pill border border-line-2 px-4 py-[10px] font-mono text-[11px] tracking-[0.1em] text-text uppercase transition hover:border-accent hover:bg-accent hover:text-bg active:scale-[0.98]"
          >
            Close ✕
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {/* The panel header already names the project, so the viewer's own
              caption would just repeat it. */}
          <ArchitectureViewer
            src={src}
            alt={`Production architecture of the ${title}`}
            heading={null}
          />
        </div>
      </div>
    </div>
  );
}
