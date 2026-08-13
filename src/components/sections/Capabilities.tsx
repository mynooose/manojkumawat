import { CAPABILITIES, CAPABILITIES_INTRO } from '@/content/capabilities';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Capabilities.module.css';

export function Capabilities() {
  return (
    <section className={`shell ${styles.section}`}>
      <div className={styles.header}>
        <Reveal as="h2" className={styles.heading}>
          <span className={styles.index}>{CAPABILITIES_INTRO.index}</span>
          {CAPABILITIES_INTRO.heading}
        </Reveal>
        <Reveal as="p" className={styles.counter}>
          {CAPABILITIES_INTRO.counter}
        </Reveal>
      </div>

      <div className={styles.grid}>
        {CAPABILITIES.map((capability, i) => (
          <Reveal key={capability.title} className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>{capability.title}</h3>
              <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className={styles.tags}>
              {capability.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
