import { STATS } from '@/content/site';
import styles from './StatsBand.module.css';

export function StatsBand() {
  return (
    <section className={styles.section}>
      <dl className={`shell ${styles.grid}`}>
        {STATS.map((stat) => (
          <div key={stat.value + stat.label[0]}>
            <dt className={styles.value}>
              {stat.value}
              {stat.suffix ? <span className={styles.suffix}>{stat.suffix}</span> : null}
            </dt>
            <dd className={styles.label}>
              {stat.label[0]}
              <br />
              {stat.label[1]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
