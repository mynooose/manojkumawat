'use client';

import { APPROACH_INTRO, APPROACH_STAGES, BUILD_LOOP } from '@/content/approach';
import { TIMING } from '@/content/schematic';
import { Reveal } from '@/components/ui/Reveal';
import { useInterval } from '@/hooks/useInterval';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollSpine } from '@/hooks/useScrollSpine';
import { useState } from 'react';
import styles from './Approach.module.css';

const STAGE_COUNT = APPROACH_STAGES.length;
/** Index of the stage that shows the build → test → review → release loop. */
const LOOP_STAGE = 3;

export function Approach() {
  const reducedMotion = usePrefersReducedMotion();
  const [loopStep, setLoopStep] = useState(0);

  const { containerRef, lastMarkerRef, filled, trackHeight } = useScrollSpine({
    steps: STAGE_COUNT,
    anchor: 0.6,
    gain: 6.6,
    tailOffset: 14,
  });

  useInterval(
    () => setLoopStep((s) => (s + 1) % BUILD_LOOP.length),
    reducedMotion ? null : TIMING.checklist,
  );

  const fillHeight = Math.round(trackHeight * Math.max(0, Math.min(1, filled / STAGE_COUNT)));

  return (
    <section id="approach" className={`shell ${styles.section}`}>
      <div className={styles.intro}>
        <Reveal as="p" className={styles.eyebrow}>
          <span className={styles.introIndex}>{APPROACH_INTRO.index}</span>
          {APPROACH_INTRO.eyebrow}
        </Reveal>
        <Reveal as="h2" className={styles.heading}>
          {APPROACH_INTRO.heading}
        </Reveal>
        <Reveal as="p" className={styles.lede}>
          {APPROACH_INTRO.lede}
        </Reveal>
      </div>

      <div ref={containerRef} className={styles.spineWrap}>
        <span aria-hidden="true" className={styles.rail} style={{ height: `${trackHeight}px` }} />
        <span aria-hidden="true" className={styles.fill} style={{ height: `${fillHeight}px` }} />

        <ol className={styles.list}>
          {APPROACH_STAGES.map((stage, i) => {
            const done = i < filled;
            const current = i === filled - 1;
            const isLast = i === STAGE_COUNT - 1;

            return (
              <Reveal
                as="li"
                key={stage.title}
                className={[
                  styles.item,
                  done ? styles.itemDone : '',
                  current ? styles.itemCurrent : '',
                  isLast ? styles.itemLast : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div>
                  <p
                    className={styles.marker}
                    ref={isLast ? (el) => void (lastMarkerRef.current = el) : undefined}
                  >
                    <span className={styles.badge}>{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className={styles.markerBar} />
                  </p>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                </div>

                <div className={styles.stageBody}>
                  <p className={styles.summary}>{stage.summary}</p>

                  {i === LOOP_STAGE ? (
                    <div className={styles.loop}>
                      <p className={styles.loopLabel}>Inside every build phase</p>
                      <div className={styles.loopRow}>
                        {BUILD_LOOP.map((label, k) => (
                          <span key={label} className={styles.loopItem}>
                            <span
                              className={`${styles.loopChip} ${
                                loopStep === k ? styles.loopChipOn : ''
                              }`}
                            >
                              {label}
                            </span>
                            {k < BUILD_LOOP.length - 1 ? (
                              <span aria-hidden="true" className={styles.loopArrow}>
                                &#8594;
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className={styles.artefacts}>{stage.artefacts}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
