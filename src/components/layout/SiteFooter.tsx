import { FOOTER, SITE } from '@/content/site';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <span>{SITE.name}</span>
        <span>{FOOTER.tagline}</span>
        <span>{FOOTER.copyright}</span>
      </div>
    </footer>
  );
}
