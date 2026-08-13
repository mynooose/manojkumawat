# Architecture

How the code is organised and why. For background and history, see
[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

## Shape

A single-route Next.js App Router application. Node 20.9+, TypeScript strict,
Tailwind CSS v4, React 19.

```
src/
  app/
    layout.tsx          fonts, metadata, JSON-LD
    page.tsx            composes the sections in order
    globals.css         design tokens (@theme) + keyframes + base layer
    not-found.tsx
    api/health/route.ts
  components/
    layout/             PillNav, ScrollProgress
    sections/           one per numbered section
    ui/                 Reveal, Section, SectionHeading, SkillCard, CaseStudyModal
  hooks/                useInterval, useInView, useScrollFill, useScrollSpy,
                        usePrefersReducedMotion
  lib/
    content.json        every piece of copy and data
    content.ts          types over content.json
    metrics.ts          the console's deterministic maths
    nav.ts              nav links and the ids the scroll-spy watches
public/                 portrait, architecture SVG, icons
docs/DESIGN-SPEC.md     the design contract
```

## The three layers

**Content** is data, not markup. `content.json` holds all copy; `content.ts`
gives it types. No user-facing string is hardcoded in a component, so editing
the site is editing one JSON file, and a shape change is a build error rather
than `undefined` on the page.

**Tokens** are CSS custom properties in the `@theme` block of `globals.css`,
taken verbatim from `docs/DESIGN-SPEC.md`. They generate the Tailwind
utilities used everywhere (`bg-surface`, `text-text-2`, `rounded-pill`). *A raw
hex in a component is a bug* — the one exception is SVG stroke attributes,
which cannot read CSS variables in this context and are commented as such.

**Components** compose the two. Sections are dumb about where content came
from.

## Rendering model

The page shell and static sections are **server components**. Only five
components opt into the client, each because it needs browser state:

| Client component | Why |
| --- | --- |
| `PillNav` | scroll-spy |
| `ScrollProgress` | scroll position |
| `Hero` | live stat timer |
| `SelectedWork`, `ArchitectureExplorer`, `OperatorConsole`, `Engagement`, `About` | selection state, timers, scroll measurement |

The result is that the served HTML contains the full text of the page. Keep new
work on the server unless it genuinely needs the browser — that property is the
main reason this rebuild exists.

## Mechanisms worth understanding

### Deterministic console data

`lib/metrics.ts` seeds a small linear congruential generator per
`(tenant, range)`. `lcg`, `series` and `path` are copied verbatim from the
approved reference so the rendered figures match it exactly.

This must stay pure. The console re-renders on hover, resize and refresh —
anything random would make the chart flicker between frames. `snapshot()`
returns everything the section draws, including the raw series, so the
crosshair can position itself without recomputing.

### Scroll-driven fills

`useScrollFill` powers the career spine. It measures the container against a
read line at a fraction of viewport height and reports how many steps sit above
it, plus how tall the rail should be. The rail is measured **to the last
marker**, not the container, so it stops at the final dot instead of running
into the padding.

`useScrollSpy` marks a nav section active once its top passes 35% of viewport
height. That is a position threshold rather than an intersection ratio, so a
scroll handler expresses it more directly than an IntersectionObserver would.

Both batch their reads into a single `requestAnimationFrame`, and both only
call `setState` when a value actually changes — a fast scroll must not queue up
layout thrash.

### Reveal on entry

`Reveal` uses an IntersectionObserver and unobserves each element once it has
fired. The original design polled every element on an interval *and* on every
scroll event. Content is always present in the DOM; only opacity and transform
change, so this costs nothing for crawlers or for users without JavaScript.

### Motion discipline

Every timer goes through `useInterval`, which takes `null` as its delay to stop
— that is how `usePrefersReducedMotion` suspends animation. The CSS also kills
animation and transition outright under the same query, so a new animation
needs handling in both places. All intervals and listeners clear on unmount.

`usePrefersReducedMotion` is built on `useSyncExternalStore` rather than
`useState` + `useEffect`. A media query is an external store; subscribing this
way avoids the cascading render that setState-inside-an-effect causes, and its
server snapshot reports *reduced*, so a user who asked for less motion never
sees a frame of it.

### Dialogs

`CaseStudyModal` traps focus, restores it to the trigger on close, locks
background scroll and carries `role="dialog"` with a label. The reference only
handled Esc; a modal that keyboard users can tab out of behind is not finished.

## Responsive

Breakpoints at 1000px and 760px, expressed as Tailwind arbitrary variants
(`min-[1000px]:`). The reference computed layout in JavaScript from
`window.innerWidth`; this is pure CSS.

Two rules that are easy to regress:

- Grid tracks use `minmax(min(Npx, 100%), 1fr)`. Plain `minmax(Npx, 1fr)` does
  not collapse below `N` — it overflows.
- `html, body` set `overflow-x: hidden`, which hides the symptom rather than
  the cause. Verify with a real measurement, not by eye.

## Backend

Route handlers run on Node at request time. `app/api/health/route.ts` is the
worked example and the liveness probe; it reports the deployed commit.

A contact form would be `app/api/contact/route.ts` exporting `POST`, reading
secrets from `process.env` and set in the Vercel dashboard. Nothing else about
the app needs to change to add one.

## Verification

`npm run verify` chains typecheck → lint → build. Next 16 no longer runs ESLint
during `next build`, so the build alone is not sufficient.

Beyond that, the things worth checking in a browser are: no horizontal overflow
between 320px and 1440px, no console errors, and the interactive behaviours —
project switching, case-study modal, architecture node selection, console
tenant/range/refresh with its loading and empty states, the auto-advancing
stepper, and the skill-card slideshow.
