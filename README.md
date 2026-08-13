# manojkumawat.com

Solution-architect portfolio for Manoj Kumawat. Next.js App Router, TypeScript,
CSS Modules. Deployed on Vercel; DNS at GoDaddy.

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
| `npm run format` | Prettier over `src/` |
| `npm run verify` | typecheck → lint → build. Run this before pushing |

Node 20.9 or newer.

## Layout

```
src/
  app/            routes, layout, global CSS
    api/health/   worked example of a route handler
  components/
    layout/       header, footer
    sections/     one component per page section
    ui/           Reveal, DiagramViewer
  content/        all copy and figures, typed, no JSX
  hooks/          useInterval, usePrefersReducedMotion, useScrollSpine
  styles/         tokens.css — the design system
public/           portrait, architecture diagram, icons
```

Two rules keep this tidy:

1. **Copy lives in `src/content`**, never inside a component. Changing a
   project write-up or a job title means editing one typed object.
2. **Colours, type steps and spacing live in `src/styles/tokens.css`.** A
   component stylesheet should reference `var(--c-accent)`, never `#9C4A1E`.

## Adding backend functionality

Route handlers run on Node at request time. `src/app/api/health/route.ts` is the
reference. A contact form would be `src/app/api/contact/route.ts` exporting
`POST`; read secrets from `process.env` and add them in the Vercel dashboard
under the project's environment variables.

Most sections are server components. Only `TenantSchematic`, `SelectedWork`,
`PlatformInOperation`, `Approach` and `About` are `'use client'`, because they
need timers or scroll position. Keep new work on the server unless it needs
browser state — that is what keeps the content in the served HTML.

## Design

High fidelity: colours, typography, spacing, animation and copy are final.
Reproduce exactly; do not "improve" the design when changing code.

**Colour** — ground `#FBF8F4`, band `#EFE9E3`, ink `#1A1614`, body `#544C46`,
muted `#635A52`, faint `#A2968C`, accent `#9C4A1E`, accent-deep `#7A360F`,
hairline `#E2D8CE`, rail `#DCD0C5`. On dark: `#FBF8F4`, `#C8BCB0`, `#E0A97E`.
No pure black anywhere.

**Type** — Instrument Serif for headings, Inter Tight for body, JetBrains Mono
for labels and eyebrows (9.5–11px, uppercase, wide tracking). Self-hosted by
`next/font`; there is no font CDN request at runtime.

**Motion** — reveal on scroll, two scroll-filled spines, and five timers (trace
1.9s, tenant cycle 1.15s, RAG 0.82s, checklist 1.5s, bar pulse 2.2s). All of it
stops under `prefers-reduced-motion`.

## Responsive

Breakpoints at 1080 / 900 / 700 / 560 / 380px. Two rules that are easy to
regress:

- Grid tracks use `minmax(min(Npx, 100%), 1fr)`. Plain `minmax(Npx, 1fr)` does
  not collapse below `N` — it overflows the viewport.
- A child with `grid-column: span 2` must be reset to `auto` at the breakpoint
  where its grid collapses to one track, or it forces an implicit column.

Verified with Playwright from 320px to 1440px.

## Deployment

Pushes to `main` deploy to production automatically; branches get preview URLs.
Domain is at GoDaddy with an apex `A` record and a project-specific `www`
CNAME; `www` 301s to the apex. See the deployment runbook for the exact values.

## Before wider circulation

- Projects 02, 03 and 05 carry **estimated** figures. 01 and 04 are real.
  Confirm or replace them.
- `hello@manojkumawat.com` needs a mail forwarder to exist.
