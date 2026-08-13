import { HERO } from '@/content/site';
import { Reveal } from '@/components/ui/Reveal';
import { TenantSchematic } from './TenantSchematic';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.section}>
      <div className={`shell ${styles.shell}`}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <Reveal as="p" className={styles.eyebrow}>
              {HERO.eyebrow}
            </Reveal>

            <Reveal as="h1" className={styles.heading}>
              {HERO.heading}
            </Reveal>

            <Reveal as="p" className={styles.lede}>
              {HERO.lede}
            </Reveal>

            <Reveal className={styles.actions}>
              <a href={HERO.primaryCta.href} className={styles.primary}>
                {HERO.primaryCta.label} <span aria-hidden="true">&#8594;</span>
              </a>
              <a href={HERO.secondaryCta.href} className={styles.secondary}>
                {HERO.secondaryCta.label} <span aria-hidden="true">&#8594;</span>
              </a>
            </Reveal>
          </div>

          <Reveal>
            <TenantSchematic />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
