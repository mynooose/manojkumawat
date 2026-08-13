/** Section links shown in the pill nav, in page order. */
export const NAV_LINKS = [
  { id: 'work', href: '#work', label: 'work' },
  { id: 'architecture', href: '#architecture', label: 'architecture' },
  { id: 'console', href: '#console', label: 'live console' },
  { id: 'process', href: '#process', label: 'method' },
  { id: 'about', href: '#about', label: 'about' },
] as const;

/** Sections the scroll-spy watches. Contact is included so the nav clears
 *  once the reader is past `about`, even though it has no pill of its own. */
export const NAV_IDS = [
  'work',
  'architecture',
  'console',
  'process',
  'about',
  'contact',
] as const;
