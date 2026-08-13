'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger in ms, per the 60-80ms cadence in the spec. */
  delay?: number;
  id?: string;
}

/**
 * Fades and lifts content in once, on first entry.
 *
 * The reference polled every element on a 700ms interval plus every scroll
 * event; an IntersectionObserver does the same job without touching layout on
 * the scroll thread and stops observing once fired.
 *
 * Content is always in the DOM — only opacity and transform change — so this
 * costs nothing for crawlers. Reduced motion is handled in CSS.
 */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      { rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${shown ? 'rise' : 'opacity-0'} ${className}`}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
