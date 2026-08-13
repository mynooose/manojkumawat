import type { ReactNode } from 'react';

/** Standard section rhythm from DESIGN-SPEC: clamped vertical and horizontal padding. */
export function Section({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`section-x section-y ${className}`}>
      <div className="mx-auto w-full max-w-[1180px]">{children}</div>
    </section>
  );
}
