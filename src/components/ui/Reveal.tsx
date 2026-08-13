'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
  id?: string;
}

/**
 * Fades and lifts its children into place once, the first time they come near
 * the viewport.
 *
 * The original polled every element on a 600ms interval plus every scroll
 * event; an IntersectionObserver does the same job without touching layout on
 * the scroll thread, and stops observing each element once it has fired.
 *
 * Reduced motion is handled entirely in CSS, so there is no JS branch for it
 * and no risk of the server and client disagreeing on the initial markup.
 *
 * Content is always present in the DOM — only opacity and transform change — so
 * this costs nothing for crawlers or for users without JavaScript.
 */
export function Reveal({ children, as: Tag = 'div', className, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Very old browsers: reveal on the next frame rather than never.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [styles.reveal, shown ? styles.shown : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} id={id} className={classes}>
      {children}
    </Tag>
  );
}
