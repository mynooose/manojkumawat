# manojkumawat.com

Solution-architect portfolio. Next.js App Router, TypeScript, Tailwind CSS v4.
Deployed on Vercel; DNS at GoDaddy.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck → lint → build. Run before pushing |

Node 20.9 or newer.

## Where to edit content

**All copy and figures live in `src/lib/content.json`.** Nothing user-facing is
hardcoded in a component. `src/lib/content.ts` types that file — change the
shape there and a mismatch becomes a build error rather than `undefined` on the
page.

```
src/
  app/            routes, root layout, global CSS + design tokens
    api/health/   worked example of a route handler
  components/
    layout/       pill nav, scroll-progress bar
    sections/     one component per numbered section
    ui/           Reveal, SkillCard, CaseStudyModal, Section, SectionHeading
  hooks/          useInterval, useInView, useScrollFill, usePrefersReducedMotion
  lib/            content.json + its types, and the console's metric maths
public/           portrait, architecture diagram, icons
docs/            DESIGN-SPEC.md — the design contract
```

See also [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for background and
decisions, and [ARCHITECTURE.md](./ARCHITECTURE.md) for how the code fits
together.

## Design tokens

Tailwind v4 is CSS-first, so the tokens from `docs/DESIGN-SPEC.md` are
mapped in the `@theme` block at the top of `src/app/globals.css` rather than a
`tailwind.config.ts`. That block generates the utilities used throughout
(`bg-surface`, `text-text-2`, `border-line`, `rounded-pill`, …).

Use a token. A raw hex in a component is a bug.

## Things that are easy to break

- **Console data must stay deterministic.** `src/lib/metrics.ts` seeds a small
  LCG per (tenant, range), copied verbatim from the approved reference. Anything
  random would make the chart flicker on every re-render.
- **Optical sizing.** Bricolage Grotesque is loaded as a variable font with the
  `opsz` axis. Drop that axis and every display heading renders noticeably
  wider than the design.
- **Reduced motion.** Every timer takes `null` as its delay under
  `prefers-reduced-motion`, and the CSS kills animation and transition
  outright. Adding a new animation means handling both.
- **No horizontal overflow at any width.** `html, body` set `overflow-x: hidden`,
  but that hides the symptom — grid tracks still need `minmax(min(Npx,100%),1fr)`
  so they collapse rather than overflow.

## Backend

Route handlers run on Node at request time; `src/app/api/health/route.ts` is
the reference. A contact form would be `src/app/api/contact/route.ts` exporting
`POST`, reading secrets from `process.env` (set them in the Vercel dashboard).

## Deployment

Pushes to `main` deploy to production; branches get preview URLs. The Vercel
project's framework preset must stay **Next.js** — if it is set to "Other" the
build is skipped and the site 404s.

## Before wider circulation

- The operator console is labelled representative data. Keep that label.
- Client names are withheld throughout. Keep that too.
