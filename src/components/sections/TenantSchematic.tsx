'use client';

import { useState } from 'react';
import {
  BUILD_NODES,
  PLATFORM_NODES,
  TENANT_NAMES,
  TIMING,
  TRACE,
  VISIBLE_TENANTS,
  latencyForStep,
  type SchematicNode,
} from '@/content/schematic';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './TenantSchematic.module.css';

/**
 * The live hero card: traces one tenant's lifecycle through the platform.
 *
 * Two independent counters drive it — the trace step, and which of the six
 * tenants is currently highlighted. Both stop under reduced motion, leaving
 * step 0 rendered statically.
 */
export function TenantSchematic() {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [tenantIndex, setTenantIndex] = useState(0);

  useInterval(() => {
    setStep((prev) => {
      const next = (prev + 1) % TRACE.length;
      // The original advanced the tenant every third trace step.
      if (prev % 3 === 2) setTenantIndex((t) => (t + 1) % TENANT_NAMES.length);
      return next;
    });
  }, reducedMotion ? null : TIMING.trace);

  const current = TRACE[step] ?? TRACE[0]!;
  const lit = (node: SchematicNode) => current.nodes.includes(node);
  const activeTenant = tenantIndex % VISIBLE_TENANTS.length;
  const progress = ((step + 1) / TRACE.length) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.headTitle}>From signup to serving · one tenant&rsquo;s journey</span>
        <span className={styles.phase}>
          <span aria-hidden="true" className={styles.dot} />
          {current.phase}
        </span>
      </div>

      <div className={styles.grid}>
        <div>
          <p className={styles.colLabel}>Build</p>
          <div className={styles.stack}>
            {BUILD_NODES.map((node) => (
              <div
                key={node.id}
                className={`${styles.chip} ${lit(node.id) ? styles.chipOn : ''}`}
              >
                <p className={styles.chipText}>{node.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cluster}>
          <p className={styles.colLabel}>GKE cluster</p>

          <div className={`${styles.bar} ${lit('ig') ? styles.barOn : ''}`}>
            <p className={styles.barText}>ingress · TLS · routing</p>
          </div>

          <div className={styles.namespaces}>
            {VISIBLE_TENANTS.map((name, i) => {
              const on = lit('tenant') && activeTenant === i;
              return (
                <div key={name} className={`${styles.ns} ${on ? styles.nsOn : ''}`}>
                  <p className={styles.nsName}>{name}</p>
                  <p className={styles.nsParts}>
                    app
                    <br />
                    workers
                    <br />
                    data
                  </p>
                </div>
              );
            })}
          </div>

          <div className={`${styles.bar} ${lit('da') ? styles.barOn : ''}`}>
            <p className={styles.barText}>MongoDB · Qdrant · Redis</p>
          </div>
          <p className={styles.more}>+49 more namespaces · nothing shared</p>
        </div>

        <div>
          <p className={styles.colLabel}>Platform</p>
          <div className={styles.stack}>
            {PLATFORM_NODES.map((node) => (
              <div
                key={node.id}
                className={`${styles.chip} ${lit(node.id) ? styles.chipOn : ''}`}
              >
                <p className={styles.chipText}>{node.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.footRow}>
          <p className={styles.trace}>
            <span className={styles.act}>{current.act}</span>
            {current.text}
          </p>
          <p className={styles.counter}>
            {step + 1} / {TRACE.length}
          </p>
        </div>

        <div aria-hidden="true" className={styles.progressTrack}>
          <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.metrics}>
          <span className={styles.metricMuted}>{latencyForStep(step)} ms p95</span>
          <span className={styles.metricStrong}>312 rps</span>
          <span className={styles.metricMuted}>99.9% uptime</span>
        </div>
      </div>
    </div>
  );
}
