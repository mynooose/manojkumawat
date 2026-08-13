'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/content';

interface CaseStudyModalProps {
  index: string;
  project: Project;
  onClose: () => void;
}

/**
 * Full-screen case study.
 *
 * Beyond the reference's Esc-to-close, this is a real dialog: focus moves in,
 * Tab is trapped, background scroll is locked, and focus returns to the
 * trigger on close.
 */
export function CaseStudyModal({ index, project, onClose }: CaseStudyModalProps) {
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
      <div
        className="absolute inset-0 bg-[rgba(6,6,7,0.82)] backdrop-blur-[6px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Case study: ${project.title}`}
        tabIndex={-1}
        className="absolute inset-0 overflow-y-auto"
      >
        <div className="mx-auto min-h-full w-full max-w-[900px] px-[clamp(20px,4vw,56px)] py-[clamp(24px,5vw,72px)]">
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="m-0 mb-3 font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
                {index} — case study
              </p>
              <h2 className="m-0 text-[clamp(28px,4.4vw,56px)] leading-[0.98] font-bold tracking-[-0.04em]">
                {project.title}
              </h2>
              <p className="mt-3 mb-0 font-mono text-[11px] tracking-[0.12em] text-text-4 uppercase">
                {project.role}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex-none rounded-pill border border-line-2 px-4 py-[10px] font-mono text-[11px] tracking-[0.1em] text-text uppercase transition hover:border-accent hover:bg-accent hover:text-bg"
            >
              Close ✕
            </button>
          </div>

          <div className="flex flex-col gap-7">
            {project.caseStudy?.map((block) => (
              <div key={block.h}>
                <h3 className="m-0 mb-2 text-[18px] leading-[1.3] font-semibold">{block.h}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-text-2 text-pretty">{block.p}</p>
              </div>
            ))}
          </div>

          {project.diagram ? (
            <div className="mt-9">
              <p className="m-0 mb-3 font-mono text-[10.5px] tracking-[0.14em] text-text-4 uppercase">
                Production architecture
              </p>
              <div className="max-h-[70vh] overflow-auto rounded-panel border border-line bg-white">
                {/* Plain img on purpose: this is a vector diagram in a scroll
                    container, so next/image sizing would fight it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/architecture-chatbot.svg"
                  alt={`Production architecture of the ${project.title}`}
                  className="block w-full min-w-[720px] max-w-none"
                />
              </div>
            </div>
          ) : null}

          <p className="mt-9 mb-0 font-mono text-[10.5px] tracking-[0.12em] text-text-6 uppercase">
            Client names withheld
          </p>
        </div>
      </div>
    </div>
  );
}
