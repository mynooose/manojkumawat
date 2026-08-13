import { CONTACT, SITE } from '@/content/site';
import { Reveal } from '@/components/ui/Reveal';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={`shell ${styles.shell}`}>
        <Reveal as="p" className={styles.eyebrow}>
          {CONTACT.eyebrow}
        </Reveal>
        <Reveal as="h2" className={styles.heading}>
          {CONTACT.heading}
        </Reveal>

        <div className={styles.grid}>
          <div>
            {CONTACT.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.body}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.links}>
            <a href={`mailto:${SITE.email}`} className={styles.link}>
              <span className={styles.linkLabel}>Email</span>
              <span className={styles.linkValue}>{SITE.email}</span>
            </a>
            <a
              href={SITE.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <span className={styles.linkLabel}>LinkedIn</span>
              <span className={styles.linkValue}>{SITE.linkedin.handle}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
