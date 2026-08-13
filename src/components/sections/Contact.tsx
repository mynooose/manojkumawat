import { CONTACT, FOOTER, META } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden section-x pt-[clamp(60px,7vw,124px)] pb-[clamp(52px,6vw,100px)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-[40%] left-1/2 h-[min(60vw,900px)] w-[min(60vw,900px)] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,92,43,0.20),transparent_62%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px]">
        <Reveal as="p" className="m-0 mb-[14px] font-mono text-[11.5px] tracking-[0.14em] text-accent uppercase">
          06 — contact
        </Reveal>

        <Reveal
          as="h2"
          className="m-0 mb-[clamp(26px,3.4vw,44px)] max-w-[15ch] text-h2-contact leading-[0.88] font-bold tracking-[-0.045em]"
          delay={60}
        >
          {CONTACT.headline}
        </Reveal>

        <div className="grid grid-cols-1 gap-[clamp(18px,2.2vw,32px)] min-[1000px]:grid-cols-2">
          <Reveal delay={120}>
            {CONTACT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="m-0 mb-4 max-w-[540px] text-[16px] leading-[1.7] text-text-2 text-pretty last:mb-0">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal className="flex flex-col gap-3" delay={180}>
            <a
              href={`mailto:${META.email}`}
              className="group flex items-baseline justify-between gap-4 rounded-card border border-line bg-surface p-[18px] transition duration-200 hover:-translate-y-[2px] hover:border-accent"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                Email
              </span>
              <span className="text-[15px] font-medium text-text group-hover:text-accent">
                {META.email}
              </span>
            </a>

            <a
              href={META.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-4 rounded-card border border-line bg-surface p-[18px] transition duration-200 hover:-translate-y-[2px] hover:border-accent"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-text-4 uppercase">
                LinkedIn
              </span>
              <span className="text-[15px] font-medium text-text group-hover:text-accent">
                in/manojkumawat2022
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="section-x flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line-3 py-[22px] font-mono text-[10.5px] tracking-[0.12em] text-text-6 uppercase">
      {FOOTER.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </footer>
  );
}
