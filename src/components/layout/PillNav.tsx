'use client';

import { NAV_LINKS, NAV_IDS } from '@/lib/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';

/**
 * Floating pill navigation with scroll-spy.
 *
 * The header is pointer-events:none so its padding gutter does not swallow
 * clicks on the content beneath; the nav itself re-enables them.
 */
export function PillNav() {
  const active = useScrollSpy(NAV_IDS);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex justify-center px-[clamp(14px,3vw,28px)] py-[14px]">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-[18px] gap-y-[10px] rounded-pill border border-line bg-[rgba(12,12,13,0.72)] py-2 pr-2 pl-[18px] backdrop-blur-[16px]"
      >
        <a
          href="#top"
          className="flex flex-none items-center gap-[10px] text-[15px] font-bold tracking-[-0.02em] text-text"
        >
          <span aria-hidden="true" className="h-[22px] w-[22px] rounded-[7px] bg-accent" />
          Manoj
        </a>

        {/* Spec: links hidden below 760px; logo and CTA remain. */}
        <div className="hidden flex-wrap items-center gap-[2px] font-mono text-[11.5px] min-[760px]:flex">
          {NAV_LINKS.map((link) => {
            const on = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={on ? 'true' : undefined}
                className={`flex items-center gap-[6px] rounded-pill px-[13px] py-2 transition-colors duration-[180ms] ${
                  on ? 'bg-line-3 text-text' : 'text-text-2 hover:bg-line-3 hover:text-text'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-[4px] w-[4px] rounded-full bg-accent transition-transform duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{ transform: on ? 'scale(1)' : 'scale(0)' }}
                />
                {link.label}
              </a>
            );
          })}
        </div>

        <a
          href="#contact"
          className="flex-none rounded-pill bg-text px-5 py-[11px] text-[13.5px] font-medium whitespace-nowrap text-bg transition duration-200 hover:-translate-y-px hover:bg-accent hover:text-bg active:translate-y-0 active:scale-[0.98] active:duration-[180ms]"
        >
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}
