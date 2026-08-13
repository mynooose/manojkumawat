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

/** Number of samples plotted on the main chart. */
export const SAMPLES = 26;
/** Last bucket index; the pointer maps into 0..BUCKET_MAX. */
export const BUCKET_MAX = 25;
/** Points in a KPI sparkline. */
export const SPARK_POINTS = 14;
/** Bucket the readouts fall back to when the pointer is away. */
export const DEFAULT_BUCKET = 13;

/**
 * SVG path for a KPI sparkline across a `0 0 60 16` viewBox.
 * Copied from the reference so the trend lines match.
 */
export function spark(v: readonly number[]): string {
  let d = '';
  for (let i = 0; i < v.length; i++) {
    d +=
      (i === 0 ? 'M' : 'L') +
      ((i / (v.length - 1)) * 60).toFixed(2) +
      ' ' +
      (16 - (v[i] ?? 0) * 14).toFixed(2) +
      ' ';
  }
  return d.trim();
}

export interface Kpi {
  readonly k: string;
  readonly v: string;
  readonly u: string;
  readonly d: string;
  /** Delta colour: accent for movement, muted for a static reference. */
  readonly accent: boolean;
  /** Sparkline path, plotted bottom-right of the card. */
  readonly spark: string;
  /** Sparkline stroke colour. */
  readonly sparkColor: string;
}

export interface ConsoleSnapshot {
  readonly kpis: readonly Kpi[];
  readonly areaPath: string;
  readonly linePath: string;
  readonly errPath: string;
  readonly rows: readonly { readonly n: string; readonly w: string; readonly v: string }[];
  /** Raw series, needed to position the crosshair dot and read the tooltip. */
  readonly vals: readonly number[];
  readonly lat: readonly number[];
  readonly total: number;
}

export interface HoverReadout {
  readonly label: string;
  readonly requests: string;
  readonly p95: string;
  /** Percentages, for absolute positioning over the chart. */
  readonly left: string;
  readonly top: string;
}

/** Tooltip and crosshair values for one bucket. */
export function readout(snap: ConsoleSnapshot, bucket: number): HoverReadout {
  const i = Math.max(0, Math.min(BUCKET_MAX, bucket));
  const v = snap.vals[i] ?? 0;
  const mean = snap.vals.reduce((a, b) => a + b, 0) / SAMPLES;
  return {
    label: 'bucket ' + String(i + 1).padStart(2, '0'),
    requests: fmt(Math.round((snap.total * (v / mean)) / SAMPLES)) + ' req',
    p95: 96 + Math.round((snap.lat[i] ?? 0) * 120) + ' ms',
    left: ((i / BUCKET_MAX) * 100).toFixed(2) + '%',
    top: (((34 - v * 32) / 34) * 100).toFixed(2) + '%',
  };
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
      {
        k: 'requests',
        v: fmt(total),
        u: '',
        d: '+12.4% vs previous',
        accent: true,
        spark: spark(vals.slice(0, SPARK_POINTS)),
        sparkColor: '#FF5C2B',
      },
      {
        k: 'p95 latency',
        v: String(p95),
        u: ' ms',
        d: 'SLO 250 ms',
        accent: false,
        spark: spark(lat.slice(0, SPARK_POINTS)),
        sparkColor: '#7858FF',
      },
      {
        k: 'error rate',
        v: err,
        u: ' %',
        d: 'budget 0.5%',
        accent: true,
        spark: spark(series(tenantIndex, rangeIndex + 7, SPARK_POINTS)),
        sparkColor: '#3A3A3E',
      },
      {
        k: 'active users',
        v: fmt(users),
        u: '',
        d: 'unique in window',
        accent: false,
        spark: spark(series(tenantIndex, rangeIndex + 9, SPARK_POINTS)),
        sparkColor: '#3A3A3E',
      },
    ],
    areaPath: path(vals, true),
    linePath: path(vals, false),
    errPath: path(lat, false),
    rows: intents.map((r) => ({
      n: r.name,
      w: Math.round(r.weight * 100) + '%',
      v: fmt(Math.round(total * r.weight * 0.21)),
    })),
    vals,
    lat,
    total,
  };
}
