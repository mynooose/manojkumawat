'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ArchitectureEdge } from '@/lib/content';

interface EdgeLayerProps {
  /** The element the nodes are laid out inside; paths are drawn relative to it. */
  containerRef: React.RefObject<HTMLElement | null>;
  edges: readonly ArchitectureEdge[];
  /** Node currently in focus, or null. */
  selected: string | null;
}

interface Drawn {
  key: string;
  d: string;
  kind: ArchitectureEdge['kind'];
  active: boolean;
}

/** Stroke per edge kind, matching the diagram's own legend. */
const STROKE: Record<ArchitectureEdge['kind'], string> = {
  flow: '#94A3B8',
  integration: '#22C55E',
  release: '#F59E0B',
};

const DASH: Record<ArchitectureEdge['kind'], string | undefined> = {
  flow: undefined,
  integration: '5 4',
  release: '5 4',
};

/**
 * Draws the real connections between nodes.
 *
 * Node positions come from the DOM rather than a hardcoded layout, so the
 * graph survives reflow: the whole thing is remeasured on resize and whenever
 * the container changes size. Every edge is drawn faintly at rest so the shape
 * of the system is always visible; selecting a node lifts its own edges.
 */
export function EdgeLayer({ containerRef, edges, selected }: EdgeLayerProps) {
  const [paths, setPaths] = useState<Drawn[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const base = root.getBoundingClientRect();
    if (base.width === 0) return;

    const box = (key: string) => {
      const el = root.querySelector<HTMLElement>(`[data-node="${key}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - base.left,
        y: r.top - base.top,
        w: r.width,
        h: r.height,
        cx: r.left - base.left + r.width / 2,
        cy: r.top - base.top + r.height / 2,
      };
    };

    const next: Drawn[] = [];
    for (const edge of edges) {
      const a = box(edge.from);
      const b = box(edge.to);
      if (!a || !b) continue;

      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      let d: string;

      if (Math.abs(dy) >= Math.abs(dx)) {
        // Mostly vertical: leave the bottom edge, arrive at the top.
        const y1 = dy >= 0 ? a.y + a.h : a.y;
        const y2 = dy >= 0 ? b.y : b.y + b.h;
        const bend = Math.abs(y2 - y1) * 0.45;
        d = `M${a.cx} ${y1} C${a.cx} ${y1 + (dy >= 0 ? bend : -bend)}, ${b.cx} ${y2 - (dy >= 0 ? bend : -bend)}, ${b.cx} ${y2}`;
      } else {
        const x1 = dx >= 0 ? a.x + a.w : a.x;
        const x2 = dx >= 0 ? b.x : b.x + b.w;
        const bend = Math.abs(x2 - x1) * 0.45;
        d = `M${x1} ${a.cy} C${x1 + (dx >= 0 ? bend : -bend)} ${a.cy}, ${x2 - (dx >= 0 ? bend : -bend)} ${b.cy}, ${x2} ${b.cy}`;
      }

      next.push({
        key: `${edge.from}->${edge.to}`,
        d,
        kind: edge.kind,
        active: selected === edge.from || selected === edge.to,
      });
    }

    setPaths(next);
    setSize({ w: base.width, h: base.height });
  }, [containerRef, edges, selected]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Defer past layout so the first measure sees final positions.
    const raf = requestAnimationFrame(measure);
    const settle = window.setTimeout(measure, 350);

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, measure]);

  if (size.w === 0) return null;

  return (
    <svg
      aria-hidden="true"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      className="pointer-events-none absolute inset-0 z-0 hidden min-[760px]:block"
    >
      {paths.map((p) => (
        <path
          key={p.key}
          d={p.d}
          fill="none"
          stroke={p.active ? '#FF5C2B' : STROKE[p.kind]}
          strokeWidth={p.active ? 2 : 1}
          strokeDasharray={DASH[p.kind]}
          strokeOpacity={p.active ? 0.95 : selected ? 0.12 : 0.26}
          className="transition-[stroke-opacity,stroke-width] duration-300"
        />
      ))}
    </svg>
  );
}
