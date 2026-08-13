import type { Metadata } from 'next';
import Link from 'next/link';
import { ArchitectureViewer } from '@/components/ui/ArchitectureViewer';
import { DIAGRAM_SRC } from '@/lib/content';

const TITLE = 'Multi-tenant chatbot SaaS — production architecture';
const DESCRIPTION =
  'Production architecture of a multi-tenant chatbot platform on Google Kubernetes Engine: one namespace per tenant, isolated MongoDB, Redis and Qdrant per organisation, wildcard TLS at the ingress, and a shared control plane.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/architecture' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/architecture',
    type: 'article',
  },
};

/**
 * Standalone, shareable view of the architecture diagram.
 *
 * Deliberately separate from the case-study modal on the home page: this is a
 * link you can send to someone who should see the diagram and nothing else.
 */
export default function ArchitecturePage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-[clamp(16px,3vw,28px)] py-3">
        <Link href="/" className="flex items-center gap-[10px] text-[15px] font-bold tracking-[-0.02em] text-text">
          <span aria-hidden="true" className="h-[18px] w-[18px] rounded-[6px] bg-accent" />
          Manoj Kumawat
        </Link>
        <p className="m-0 font-mono text-[10px] tracking-[0.14em] text-text-4 uppercase">
          Client names withheld · representative of production
        </p>
      </header>

      <main className="min-h-0 flex-1">
        <ArchitectureViewer
          src={DIAGRAM_SRC}
          alt="Production architecture of a multi-tenant chatbot SaaS on Google Kubernetes Engine"
        />
      </main>
    </div>
  );
}
