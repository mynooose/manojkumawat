import { Reveal } from './Reveal';

interface SectionHeadingProps {
  /** e.g. "01 — selected work" */
  eyebrow: string;
  title: string;
  /** Optional right-aligned meta, e.g. "01 / 05 · names withheld". */
  meta?: string;
}

/** The shared section header: orange mono eyebrow, oversized display title. */
export function SectionHeading({ eyebrow, title, meta }: SectionHeadingProps) {
  return (
    <Reveal className="mb-[clamp(28px,3.4vw,52px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <p className="m-0 mb-[14px] font-mono text-[11.5px] tracking-[0.14em] text-accent uppercase">
          {eyebrow}
        </p>
        <h2 className="m-0 text-h2 leading-[0.92] font-bold tracking-[-0.045em]">{title}</h2>
      </div>
      {meta ? (
        <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-text-4 uppercase">{meta}</p>
      ) : null}
    </Reveal>
  );
}
