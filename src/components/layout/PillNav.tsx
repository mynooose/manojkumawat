'use client';

import { NAV_LINKS, NAV_IDS } from '@/lib/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';

/**
 * Floating pill navigation with scroll-spy.
 *
 * The header is pointer-events:none so its padding gutter does not swallow
 * clicks on the content beneath; the nav itself re-enables them.
 *
 * Below 760px the links move to a second row inside the pill and scroll
 * horizontally — the design brief hides them at that width, but without any
 * indicator a phone reader has no idea which section they are in. This is the
 * "simple anchor menu" the brief permits, not a drawer.
 */
export function PillNav() {
  const active = useScrollSpy(NAV_IDS);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex justify-center px-[clamp(14px,3vw,28px)] py-[14px]">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-[18px] gap-y-[10px] rounded-pill border border-line bg-[rgba(12,12,13,0.72)] py-2 pr-2 pl-[14px] backdrop-blur-[16px] min-[760px]:pl-[18px]"
      >
          <a
            href="#top"
            className="flex flex-none items-center gap-[10px] text-[14px] font-bold tracking-[-0.02em] text-text min-[400px]:text-[15px]"
          >
            <span aria-hidden="true" className="h-[22px] w-[22px] flex-none rounded-[7px] bg-accent" />
            <span className="whitespace-nowrap">Manoj Kumawat</span>
          </a>

          {/* Desktop links */}
          <div className="hidden flex-wrap items-center gap-[2px] font-mono text-[11.5px] min-[760px]:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} link={link} on={active === link.id} />
            ))}
          </div>

          <a
            href="#contact"
            className="flex-none rounded-pill bg-text px-4 py-[9px] text-[13px] font-medium whitespace-nowrap text-bg transition duration-200 hover:-translate-y-px hover:bg-accent hover:text-bg active:translate-y-0 active:scale-[0.98] active:duration-[180ms] min-[760px]:px-5 min-[760px]:py-[11px] min-[760px]:text-[13.5px]"
          >
            Let&apos;s talk
          </a>
      </nav>
    </header>
  );
}

function NavLink({ link, on }: { link: (typeof NAV_LINKS)[number]; on: boolean }) {
  return (
    <a
      href={link.href}
      aria-current={on ? 'true' : undefined}
      className={`flex flex-none items-center gap-[6px] rounded-pill px-[13px] py-2 transition-colors duration-[180ms] ${
        on ? 'bg-line-3 text-text' : 'text-text-2 hover:bg-line-3 hover:text-text'
      }`}
    >
      <span
        aria-hidden="true"
        className="h-[4px] w-[4px] flex-none rounded-full bg-accent transition-transform duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: on ? 'scale(1)' : 'scale(0)' }}
      />
      {link.label}
    </a>
  );
}
