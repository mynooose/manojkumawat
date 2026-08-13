'use client';

import Image from 'next/image';
import { ABOUT_INTRO, TIMELINE } from '@/content/timeline';
import { SITE } from '@/content/site';
import { Reveal } from '@/components/ui/Reveal';
import { useScrollSpine } from '@/hooks/useScrollSpine';
import styles from './About.module.css';

const ENTRY_COUNT = TIMELINE.length;

export function About() {
  const { containerRef, lastMarkerRef, filled, trackHeight } = useScrollSpine({
    steps: ENTRY_COUNT,
    anchor: 0.62,
    gain: 5.4,
    tailOffset: 6,
  });

  const fillHeight = Math.round(trackHeight * Math.max(0, Math.min(1, filled / ENTRY_COUNT)));

  return (
    <section id="about" className={styles.section}>
      <div className={`shell ${styles.grid}`}>
        <Reveal>
          <div className={styles.portraitFrame}>
            <Image
              src="/portrait-manoj.png"
              alt={SITE.name}
              width={1000}
              height={1250}
              priority={false}
              sizes="(max-width: 900px) 100vw, 33vw"
              className={styles.portrait}
            />
          </div>
          <div className={styles.caption}>
            <span>{SITE.name}</span>
            <span>{SITE.role}</span>
          </div>
        </Reveal>

        <div>
          <Reveal as="p" className={styles.eyebrow}>
            <span className={styles.introIndex}>{ABOUT_INTRO.index}</span>
            {ABOUT_INTRO.eyebrow}
          </Reveal>
          <Reveal as="h2" className={styles.heading}>
            {ABOUT_INTRO.heading}
          </Reveal>
          <Reveal as="p" className={styles.lede}>
            {ABOUT_INTRO.lede}
          </Reveal>

          <Reveal>
            <div ref={containerRef} className={styles.timeline}>
              <span
                aria-hidden="true"
                className={styles.rail}
                style={{ height: `${trackHeight}px` }}
              />
              <span
                aria-hidden="true"
                className={styles.fill}
                style={{ height: `${fillHeight}px` }}
              />

              {TIMELINE.map((entry, i) => {
                const reached = i < filled;
                const current = i === filled - 1;
                const isNow = i === ENTRY_COUNT - 1 && reached;
                const isLast = i === ENTRY_COUNT - 1;

                return (
                  <div
                    key={entry.years}
                    className={[
                      styles.row,
                      reached ? styles.rowReached : '',
                      current ? styles.rowCurrent : '',
                      isNow ? styles.rowNow : '',
                      isLast ? styles.rowLast : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className={styles.years}>{entry.years}</span>
                    <span aria-hidden="true" className={styles.dotCell}>
                      <span
                        className={styles.dot}
                        ref={isLast ? (el) => void (lastMarkerRef.current = el) : undefined}
                      />
                    </span>
                    <span className={styles.entry}>
                      <span className={styles.entryTitle}>{entry.title}</span>
                      <span className={styles.entryDetail}>{entry.detail}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
