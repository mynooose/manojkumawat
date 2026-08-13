import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { PillNav } from '@/components/layout/PillNav';
import { ScrollRail } from '@/components/layout/ScrollRail';
import { Hero } from '@/components/sections/Hero';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ArchitectureExplorer } from '@/components/sections/ArchitectureExplorer';
import { OperatorConsole } from '@/components/sections/OperatorConsole';
import { Engagement } from '@/components/sections/Engagement';
import { About } from '@/components/sections/About';
import { Contact, SiteFooter } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <PillNav />
      <ScrollRail />
      <main id="top">
        <Hero />
        <SelectedWork />
        <ArchitectureExplorer />
        <OperatorConsole />
        <Engagement />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
