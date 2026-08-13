import { NAV, SITE } from '@/content/site';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={`shell ${styles.nav}`} aria-label="Primary">
        <a href="#top" className={styles.brand}>
          <span className={styles.brandName}>{SITE.name}</span>
        </a>

        <div className={styles.links}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className={styles.cta}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
