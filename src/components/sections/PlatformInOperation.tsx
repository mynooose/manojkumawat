'use client';

import { useState } from 'react';
import { BAR_SEED, TIMING } from '@/content/schematic';
import { OPERATION } from '@/content/site';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './PlatformInOperation.module.css';

const TABS = ['Load', 'Namespaces', 'Billing'] as const;

const NAMESPACE_ROWS = [
  { name: 'ns/tenant-a', stores: 'mongo · redis · qdrant' },
  { name: 'ns/tenant-b', stores: 'mongo · redis · qdrant' },
  { name: 'ns/tenant-c', stores: 'mongo · redis · qdrant' },
];

const PLAN_ROWS = [
  { name: 'Enterprise', detail: 'seats · SSO · SLA' },
  { name: 'Business', detail: 'usage caps · overage' },
  { name: 'Team', detail: 'metered, self-serve' },
];

const BAR_FLOOR = 26;
const BAR_CEILING = 96;

export function PlatformInOperation() {
  const reducedMotion = usePrefersReducedMotion();
  const [tab, setTab] = useState(0);
  const [bars, setBars] = useState<readonly number[]>(BAR_SEED);
  const [rps, setRps] = useState(312);

  // Only the Load tab shows the chart, so idle elsewhere.
  useInterval(
    () => {
      setBars((prev) => {
        const next = prev.map((value) => {
          const delta = Math.round((Math.random() - 0.5) * 26);
          return Math.min(BAR_CEILING, Math.max(BAR_FLOOR, value + delta));
        });
        setRps(Math.round(Math.max(...next) * 3.7));
        return next;
      });
    },
    reducedMotion || tab !== 0 ? null : TIMING.barPulse,
  );

  const peak = Math.max(...bars);

  return (
    <section className={styles.section}>
      <div className={`shell ${styles.grid}`}>
        <div>
          <p className={styles.eyebrow}>{OPERATION.eyebrow}</p>
          <p className={styles.heading}>{OPERATION.heading}</p>
          <p className={styles.body}>{OPERATION.body}</p>
        </div>

        <div className={styles.panel}>
          <div className={styles.tabs} role="tablist" aria-label="Platform metrics">
            {TABS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                tabIndex={tab === i ? 0 : -1}
                className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
                onClick={() => setTab(i)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.panelBody}>
            {tab === 0 ? (
              <div>
                <div className={styles.loadHead}>
                  <div>
                    <p className={styles.big}>
                      {rps}
                      <span className={styles.bigUnit}> rps</span>
                    </p>
                    <p className={styles.smallLabel}>Peak sustained</p>
                  </div>
                  <p className={styles.badge}>autoscaled</p>
                </div>

                <div aria-hidden="true" className={styles.chart}>
                  {bars.map((height, i) => (
                    <span
                      key={i}
                      className={`${styles.bar} ${height === peak ? styles.barPeak : ''}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <p className={styles.metricValue}>52</p>
                    <p className={styles.smallLabel}>Tenants</p>
                  </div>
                  <div className={`${styles.metric} ${styles.metricLast}`}>
                    <p className={styles.metricValue}>
                      99.9<span className={styles.metricSuffix}>%</span>
                    </p>
                    <p className={styles.smallLabel}>Uptime</p>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === 1 ? (
              <div>
                <p className={styles.big}>
                  52<span className={styles.bigUnit}> namespaces</span>
                </p>
                <div className={styles.rows}>
                  {NAMESPACE_ROWS.map((row) => (
                    <div key={row.name} className={styles.row}>
                      <span className={styles.rowName}>{row.name}</span>
                      <span className={styles.rowDetail}>{row.stores}</span>
                    </div>
                  ))}
                  <div className={styles.rowNote}>+ 49 more, one per organisation</div>
                </div>
              </div>
            ) : null}

            {tab === 2 ? (
              <div>
                <p className={styles.big}>
                  3<span className={styles.bigUnit}> plan tiers</span>
                </p>
                <div className={styles.rows}>
                  {PLAN_ROWS.map((row) => (
                    <div key={row.name} className={styles.row}>
                      <span className={styles.rowName}>{row.name}</span>
                      <span className={styles.rowDetail}>{row.detail}</span>
                    </div>
                  ))}
                  <p className={styles.note}>
                    Entitlements are enforced in the platform, not the billing provider — a
                    downgrade takes effect the moment it is signed.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
