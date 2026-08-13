import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="section-x flex min-h-[70vh] flex-col items-start justify-center">
      <p className="m-0 mb-4 font-mono text-[11.5px] tracking-[0.14em] text-accent uppercase">
        404
      </p>
      <h1 className="m-0 mb-4 text-h2 leading-[0.92] font-bold tracking-[-0.045em]">
        That page does not exist.
      </h1>
      <p className="m-0 mb-8 max-w-[520px] text-[16px] leading-[1.7] text-text-2">
        The link may be out of date, or the address slightly off.
      </p>
      <Link
        href="/"
        className="rounded-pill bg-text px-5 py-3 text-[14px] font-medium text-bg transition hover:bg-accent"
      >
        Back to the start →
      </Link>
    </main>
  );
}
