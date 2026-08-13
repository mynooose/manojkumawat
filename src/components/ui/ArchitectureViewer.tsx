'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_SCALE = 0.1;
const MAX_SCALE = 8;
const STEP = 1.25;
/** Natural size of the diagram, from its viewBox. */
const NATURAL = { w: 1800, h: 1500 };

interface Point {
  x: number;
  y: number;
}

const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

interface ArchitectureViewerProps {
  src: string;
  alt: string;
}

/**
 * Pan-and-zoom viewer for a large SVG diagram.
 *
 * The image is rendered at its natural size inside a clipping frame and moved
 * with a single CSS transform, so zooming stays crisp at any scale — an SVG
 * scaled by transform is re-rasterised by the browser rather than resampled.
 *
 * Supports wheel zoom toward the cursor, drag to pan, two-finger pinch, and
 * keyboard shortcuts. Pointer Events cover mouse, trackpad and touch with one
 * code path.
 */
export function ArchitectureViewer({ src, alt }: ArchitectureViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  // Active pointers, so pinch can be distinguished from drag.
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const dragFrom = useRef<{ pointer: Point; offset: Point } | null>(null);

  /** Scale that fits the whole diagram inside the frame, with a small margin. */
  const fitScale = useCallback(() => {
    const el = frameRef.current;
    if (!el) return 1;
    const { width, height } = el.getBoundingClientRect();
    return clampScale(Math.min(width / NATURAL.w, height / NATURAL.h) * 0.96);
  }, []);

  const centreAt = useCallback(
    (next: number) => {
      const el = frameRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      setScale(next);
      setOffset({
        x: (width - NATURAL.w * next) / 2,
        y: (height - NATURAL.h * next) / 2,
      });
    },
    [],
  );

  const fit = useCallback(() => centreAt(fitScale()), [centreAt, fitScale]);
  const actualSize = useCallback(() => centreAt(1), [centreAt]);

  /** Zoom keeping the given frame-relative point stationary. */
  const zoomAt = useCallback((factor: number, at?: Point) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const focus = at ?? { x: rect.width / 2, y: rect.height / 2 };

    setScale((prev) => {
      const next = clampScale(prev * factor);
      const ratio = next / prev;
      setOffset((o) => ({
        x: focus.x - (focus.x - o.x) * ratio,
        y: focus.y - (focus.y - o.y) * ratio,
      }));
      return next;
    });
  }, []);

  // Fit once the frame has been laid out. Deferred to a frame so this does not
  // call setState synchronously inside the effect body.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      fit();
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [fit]);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) return;
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomAt(STEP);
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        zoomAt(1 / STEP);
      } else if (event.key === '0') {
        event.preventDefault();
        fit();
      } else if (event.key === '1') {
        event.preventDefault();
        actualSize();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomAt, fit, actualSize]);

  // Wheel zoom. Registered manually because React's onWheel is passive and
  // cannot preventDefault, which would let the page scroll behind the diagram.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = event.deltaY < 0 ? STEP : 1 / STEP;
      zoomAt(factor, { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    const rect = el.getBoundingClientRect();
    const p = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    pointers.current.set(event.pointerId, p);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: distance(a!, b!), scale };
      dragFrom.current = null;
    } else {
      dragFrom.current = { pointer: p, offset };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el || !pointers.current.has(event.pointerId)) return;
    const rect = el.getBoundingClientRect();
    const p = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    pointers.current.set(event.pointerId, p);

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const next = clampScale(
        pinchStart.current.scale * (distance(a!, b!) / Math.max(1, pinchStart.current.dist)),
      );
      const mid = { x: (a!.x + b!.x) / 2, y: (a!.y + b!.y) / 2 };
      setScale((prev) => {
        const ratio = next / prev;
        setOffset((o) => ({
          x: mid.x - (mid.x - o.x) * ratio,
          y: mid.y - (mid.y - o.y) * ratio,
        }));
        return next;
      });
      return;
    }

    if (dragFrom.current) {
      const from = dragFrom.current;
      setOffset({
        x: from.offset.x + (p.x - from.pointer.x),
        y: from.offset.y + (p.y - from.pointer.y),
      });
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragFrom.current = null;
  };

  const pct = Math.round(scale * 100);

  return (
    <div className="flex h-full flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-line px-[clamp(16px,3vw,28px)] py-3">
        <p className="m-0 font-mono text-[10.5px] tracking-[0.14em] text-text-4 uppercase">
          Multi-tenant chatbot SaaS · production architecture
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => zoomAt(1 / STEP)}
            aria-label="Zoom out"
            className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[13px] leading-none text-text transition hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            &minus;
          </button>
          <span
            aria-live="polite"
            className="min-w-[56px] text-center font-mono text-[11.5px] text-text-2 tabular-nums"
          >
            {pct}%
          </span>
          <button
            type="button"
            onClick={() => zoomAt(STEP)}
            aria-label="Zoom in"
            className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[13px] leading-none text-text transition hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            +
          </button>
          <button
            type="button"
            onClick={fit}
            className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[11.5px] text-text-2 transition hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            fit
          </button>
          <button
            type="button"
            onClick={actualSize}
            className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[11.5px] text-text-2 transition hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            100%
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[11.5px] text-text-2 transition hover:border-accent hover:text-accent"
          >
            open svg ↗
          </a>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        className="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden bg-white active:cursor-grabbing"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={NATURAL.w}
          height={NATURAL.h}
          draggable={false}
          className="max-w-none origin-top-left select-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            visibility: ready ? 'visible' : 'hidden',
          }}
        />
      </div>

      <p className="m-0 border-t border-line px-[clamp(16px,3vw,28px)] py-3 font-mono text-[10px] tracking-[0.12em] text-text-6 uppercase">
        Drag to pan · scroll or pinch to zoom · + − to zoom, 0 to fit, 1 for actual size
      </p>
    </div>
  );
}
