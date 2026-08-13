import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={`shell ${styles.wrap}`}>
      <p className={styles.code}>404</p>
      <h1 className={styles.heading}>That page does not exist.</h1>
      <p className={styles.body}>
        The link may be out of date, or the address slightly off.
      </p>
      <Link href="/" className={styles.link}>
        Back to the start <span aria-hidden="true">&#8594;</span>
      </Link>
    </main>
  );
}
