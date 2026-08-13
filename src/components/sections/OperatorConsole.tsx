'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CONSOLE } from '@/lib/content';
import { BUCKET_MAX, DEFAULT_BUCKET, readout, snapshot } from '@/lib/metrics';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Fake round-trip so switching feels like a real fetch. */
const LOAD_MS = 620;
const DISCLAIMER = 'representative data · built for this page · no client data used';

export function OperatorConsole() {
  const reducedMotion = usePrefersReducedMotion();
  const [tenant, setTenant] = useState(0);
  const [range, setRange] = useState(1);
  const [loading, setLoading] = useState(false);
  /** Hovered chart bucket, -1 when the pointer is away. */
  const [hoverPt, setHoverPt] = useState(-1);
  const timer = useRef<number | null>(null);

  // Clear the pending load on unmount so a late timeout cannot setState.
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const load = (apply: () => void) => {
    apply();
    if (reducedMotion) return; // No artificial delay when motion is reduced.
    if (timer.current) window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), LOAD_MS);
  };

  const activeTenant = CONSOLE.tenants[tenant] ?? CONSOLE.tenants[0]!;
  const activeRange = CONSOLE.ranges[range] ?? CONSOLE.ranges[0]!;

  const data = useMemo(
    () => snapshot(tenant, range, activeTenant.base, activeRange.mult, CONSOLE.intents),
    [tenant, range, activeTenant.base, activeRange.mult],
  );

  // Readouts fall back to a fixed bucket when the pointer is away, so nothing
  // jumps as the tooltip appears.
  const hovering = hoverPt >= 0;
  const bucket = hovering ? hoverPt : DEFAULT_BUCKET;
  const tip = readout(data, bucket);

  const onChartMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const i = Math.max(
      0,
      Math.min(
        BUCKET_MAX,
        Math.round(((event.clientX - rect.left) / Math.max(1, rect.width)) * BUCKET_MAX),
      ),
    );
    setHoverPt((prev) => (prev === i ? prev : i));
  };

  const isEmpty = !loading && activeTenant.empty;
  const isReady = !loading && !activeTenant.empty;

  return (
    <Section id="console">
      <SectionHeading
        eyebrow="03 — live console"
        title="What operating it looks like"
        meta={DISCLAIMER}
      />

      <Reveal className="surface-depth rounded-container border border-line bg-surface-2 p-[clamp(16px,2.2vw,26px)]">
        {/* Controls */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line-3b pb-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Tenant">
            {CONSOLE.tenants.map((t, i) => (
              <button
                key={t.n}
                type="button"
                aria-pressed={i === tenant}
                onClick={() => load(() => setTenant(i))}
                className={`rounded-pill border px-[14px] py-2 font-mono text-[11.5px] transition ${
                  i === tenant
                    ? 'border-accent bg-accent text-bg'
                    : 'border-line-2 text-text-2 hover:border-line-hover hover:text-text'
                }`}
              >
                {t.n}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2" role="group" aria-label="Time range">
              {CONSOLE.ranges.map((r, i) => (
                <button
                  key={r.n}
                  type="button"
                  aria-pressed={i === range}
                  onClick={() => load(() => setRange(i))}
                  className={`rounded-pill border px-[14px] py-2 font-mono text-[11.5px] transition ${
                    i === range
                      ? 'border-text bg-text text-bg'
                      : 'border-line-2 text-text-2 hover:border-line-hover hover:text-text'
                  }`}
                >
                  {r.n}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => load(() => {})}
              className="rounded-pill border border-line-2 px-[14px] py-2 font-mono text-[11.5px] text-text-2 transition hover:border-accent hover:text-accent"
            >
              {loading ? 'refreshing…' : 'refresh'}
            </button>
          </div>
        </div>

        <p className="m-0 mb-5 font-mono text-[10.5px] tracking-[0.1em] text-text-4 uppercase">
          {activeTenant.plan} · {activeTenant.region} · {activeRange.label}
        </p>

        {loading ? <ConsoleSkeleton /> : null}

        {isEmpty ? (
          <div className="flex flex-col items-start gap-3 rounded-panel border border-dashed border-line-2 p-[clamp(20px,3vw,40px)]">
            <p className="m-0 font-mono text-[10.5px] tracking-[0.14em] text-accent uppercase">
              No data yet
            </p>
            <p className="m-0 max-w-[420px] text-[15px] leading-[1.6] text-text-2 text-pretty">
              This tenant is still onboarding — the namespace exists and the stores are
              provisioned, but no traffic has been served.
            </p>
          </div>
        ) : null}

        {isReady ? (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3 min-[1000px]:grid-cols-4">
              {data.kpis.map((kpi) => (
                <div
                  key={kpi.k}
                  className="surface-inset rounded-inner border border-line bg-surface p-[14px]"
                >
                  <p className="m-0 mb-2 font-mono text-[9.5px] tracking-[0.16em] text-text-4 uppercase">
                    {kpi.k}
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <p className="m-0 font-mono text-[clamp(20px,2.2vw,28px)] leading-none text-text tabular-nums">
                      {kpi.v}
                      <span className="text-[13px] text-text-4">{kpi.u}</span>
                    </p>
                    <svg
                      viewBox="0 0 60 16"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="h-4 w-[60px] shrink-0 overflow-visible"
                    >
                      <path
                        d={kpi.spark}
                        fill="none"
                        stroke={kpi.sparkColor}
                        strokeWidth="1"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <p
                    className={`mt-2 mb-0 font-mono text-[10px] ${
                      kpi.accent ? 'text-accent' : 'text-text-4'
                    }`}
                  >
                    {kpi.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 min-[1000px]:grid-cols-[2fr_1fr]">
              <div className="min-w-0 rounded-panel border border-line bg-surface p-[16px]">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="m-0 font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                    Requests
                  </p>
                  <p className="m-0 flex items-center gap-3 font-mono text-[9.5px] text-text-4 uppercase">
                    <span className="flex items-center gap-[6px]">
                      <span aria-hidden="true" className="h-[2px] w-3 bg-accent" />
                      requests
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-3 border-t border-dashed border-accent-2"
                      />
                      p95
                    </span>
                  </p>
                </div>

                {/* Pointer-only affordance. The same figures appear in the
                    KPI cards and the intents table, so nothing is exclusive
                    to hover. */}
                <div
                  className="relative cursor-crosshair"
                  onMouseMove={onChartMove}
                  onMouseLeave={() => setHoverPt(-1)}
                >
                  <svg
                    viewBox="0 0 100 34"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label={`Requests over ${activeRange.label} for ${activeTenant.n}`}
                    className="h-[160px] w-full"
                  >
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF5C2B" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#FF5C2B" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path d={data.areaPath} fill="url(#areaFill)" />
                    <path
                      d={data.linePath}
                      fill="none"
                      stroke="#FF5C2B"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={data.errPath}
                      fill="none"
                      stroke="#7858FF"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={(bucket / BUCKET_MAX) * 100}
                      x2={(bucket / BUCKET_MAX) * 100}
                      y1="0"
                      y2="34"
                      stroke="#F2F2F0"
                      strokeWidth="0.4"
                      strokeOpacity={hovering ? 0.55 : 0}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-surface"
                    style={{ left: tip.left, top: tip.top, opacity: hovering ? 1 : 0 }}
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[118%] items-center gap-[10px] rounded-[10px] border border-line-2 bg-surface-3a px-[11px] py-[7px] font-mono text-[10.5px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    style={{ left: tip.left, top: tip.top, display: hovering ? 'flex' : 'none' }}
                  >
                    <span className="text-text-4">{tip.label}</span>
                    <span className="text-accent">{tip.requests}</span>
                    <span className="text-accent-2">{tip.p95}</span>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-panel border border-line bg-surface p-[16px]">
                <p className="m-0 mb-4 font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                  Top intents
                </p>
                <div className="flex flex-col gap-[14px]">
                  {data.rows.map((row) => (
                    <div key={row.n}>
                      <div className="mb-[6px] flex items-baseline justify-between gap-3">
                        <span className="font-mono text-[11.5px] text-text-2">{row.n}</span>
                        <span className="font-mono text-[11px] text-text-4 tabular-nums">
                          {row.v}
                        </span>
                      </div>
                      <div className="h-[3px] w-full bg-line">
                        <div
                          className="h-[3px] bg-accent transition-[width] duration-700"
                          style={{ width: row.w }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Reveal>
    </Section>
  );
}

/** Shimmer placeholders matching the ready-state layout. */
function ConsoleSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-5 grid grid-cols-2 gap-3 min-[1000px]:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer h-[92px] rounded-inner border border-line" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 min-[1000px]:grid-cols-[2fr_1fr]">
        <div className="shimmer h-[204px] rounded-panel border border-line" />
        <div className="shimmer h-[204px] rounded-panel border border-line" />
      </div>
    </div>
  );
}
