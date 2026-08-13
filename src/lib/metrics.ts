/**
 * Deterministic demo data for the operator console.
 *
 * `lcg`, `series` and `path` are copied verbatim from the approved reference
 * so the rendered numbers and chart geometry are identical. They must stay
 * deterministic per (tenant, range): the console re-renders on hover, resize
 * and refresh, and anything random would make the chart flicker.
 *
 * Nothing here is real client data. The console is labelled as representative.
 */

/** Linear congruential generator — same constants as the reference. */
export function lcg(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** A smooth-ish pseudo-random series in roughly 0.06..1. */
export function series(tenantIndex: number, rangeIndex: number, n: number): number[] {
  const rand = lcg((tenantIndex + 1) * 97 + (rangeIndex + 1) * 13);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wave = Math.sin((i / n) * Math.PI * 2 - 0.6) * 0.32 + Math.sin((i / n) * Math.PI * 6) * 0.09;
    out.push(Math.max(0.06, 0.55 + wave + (rand() - 0.5) * 0.2));
  }
  return out;
}

/**
 * SVG path across a `0 0 100 34` viewBox.
 * `close` returns a closed shape for the area fill.
 */
export function path(vals: readonly number[], close: boolean): string {
  let d = '';
  for (let i = 0; i < vals.length; i++) {
    const x = (i / (vals.length - 1)) * 100;
    const y = 34 - (vals[i] ?? 0) * 32;
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
  }
  if (close) d += 'L100 34 L0 34 Z';
  return d.trim();
}

/** Number of samples plotted. */
export const SAMPLES = 26;

export interface Kpi {
  readonly k: string;
  readonly v: string;
  readonly u: string;
  readonly d: string;
  /** Delta colour: accent for movement, muted for a static reference. */
  readonly accent: boolean;
}

export interface ConsoleSnapshot {
  readonly kpis: readonly Kpi[];
  readonly areaPath: string;
  readonly linePath: string;
  readonly errPath: string;
  readonly rows: readonly { readonly n: string; readonly w: string; readonly v: string }[];
}

const fmt = (n: number) => n.toLocaleString('en-US');

/**
 * Everything the console renders for one (tenant, range) pair.
 * Pure: same inputs always produce the same output.
 */
export function snapshot(
  tenantIndex: number,
  rangeIndex: number,
  base: number,
  mult: number,
  intents: readonly { readonly name: string; readonly weight: number }[],
): ConsoleSnapshot {
  const vals = series(tenantIndex, rangeIndex, SAMPLES);
  const lat = series(tenantIndex, rangeIndex + 4, SAMPLES).map((v) => 0.34 + v * 0.28);

  const total = Math.round(base * mult * (0.9 + (vals[12] ?? 0) * 0.3));
  const p95 = 96 + Math.round((lat[13] ?? 0) * 120);
  const err = (0.02 + (lat[7] ?? 0) * 0.16).toFixed(2);
  const users = Math.round(base * 1.3 + (vals[4] ?? 0) * 400);

  return {
    kpis: [
      { k: 'requests', v: fmt(total), u: '', d: '+12.4% vs previous', accent: true },
      { k: 'p95 latency', v: String(p95), u: ' ms', d: 'SLO 250 ms', accent: false },
      { k: 'error rate', v: err, u: ' %', d: 'budget 0.5%', accent: true },
      { k: 'active users', v: fmt(users), u: '', d: 'unique in window', accent: false },
    ],
    areaPath: path(vals, true),
    linePath: path(vals, false),
    errPath: path(lat, false),
    rows: intents.map((r) => ({
      n: r.name,
      w: Math.round(r.weight * 100) + '%',
      v: fmt(Math.round(total * r.weight * 0.21)),
    })),
  };
}
