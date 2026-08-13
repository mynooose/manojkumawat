import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/sections/Hero';
import { StatsBand } from '@/components/sections/StatsBand';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { PlatformInOperation } from '@/components/sections/PlatformInOperation';
import { Approach } from '@/components/sections/Approach';
import { About } from '@/components/sections/About';
import { Capabilities } from '@/components/sections/Capabilities';
import { Contact } from '@/components/sections/Contact';

/**
 * The page is a server component. Only the four sections that need browser
 * state — the schematic, the work switcher, the operations panel and the two
 * scroll spines — opt into the client, so the served HTML already contains all
 * of the content.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <StatsBand />
        <SelectedWork />
        <PlatformInOperation />
        <Approach />
        <About />
        <Capabilities />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
