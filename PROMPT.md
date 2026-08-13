# Build: Manoj Kumawat — Solution Architect portfolio (Next.js + React)

You are rebuilding an approved, pixel-specified single-page portfolio as a **Next.js (App Router) + TypeScript + React** site, deployed to Vercel. The design is final — implement it faithfully, do not redesign.

> **Already built the first version?** Read `CHANGES-v2.md` — it lists exactly what changed in this revision, so you can apply a diff instead of rebuilding.

## What you are given
- `reference/Portfolio.dc.html` + `reference/support.js` — the approved design, runnable in a browser (open the HTML directly). This is the visual source of truth: read its inline styles for exact values.
- `DESIGN-SPEC.md` — tokens, layout, interaction and responsive rules written out.
- `CHANGES-v2.md` — the UI craft pass added after the first handoff (scroll-spy nav, chart crosshair + tooltip, KPI sparklines, surface depth, press states, modal entrance).
- `content.json` — all copy and data (projects, architecture nodes, process stages, CV, skills, demo dashboard data).
- `assets/portrait-manoj.png`, `assets/architecture-chatbot.svg`.

## Stack and constraints
- Next.js App Router, TypeScript, React 18+. Single route `/`.
- **Tailwind CSS** for styling (map the tokens in DESIGN-SPEC.md into `tailwind.config.ts`). If you prefer CSS Modules, that is acceptable — but no UI kit, no component library, no shadcn. The look must not drift.
- Fonts via `next/font/google`: **Bricolage Grotesque** (400/500/700/800) for display and UI, **Geist Mono** (400/500) for labels, data and micro-copy. No other fonts.
- Images via `next/image` where sensible; the architecture SVG can be a plain `<img>` inside its scroll container.
- No CMS, no database, no API routes. Content comes from `content.json` typed as a module (`lib/content.ts`).
- Client components only where interaction requires it; the page shell and static sections should stay server components.
- Accessibility: every interactive element is a real `<button>` with a visible focus ring (1px solid #FF5C2B, offset 2–4px), keyboard operable, and `prefers-reduced-motion` disables all animation and auto-advance.

## Page structure (in order)
1. **Sticky pill nav** — floating rounded-full bar, blurred translucent background, logo mark + "Manoj", section links (work / architecture / live console / method / about), "Let's talk" CTA. A 2px orange scroll-progress bar is fixed at the very top of the viewport.
2. **Hero** — full viewport height. Status pill, two-line display headline ("AI platforms" / "that don't break."), supporting paragraph, and three live stats (requests/sec and p95 tick every 2.4s within bounds; tenants static). Two soft radial glows drift behind it. An infinite tech marquee closes the section.
3. **01 — Selected work** — left rail of five selectable project cards plus an "Also delivered" dashed card; right panel shows the selected project (role, title, problem, what I built, architecture layers, stack chips, outcome) and an "Open case study" button that opens a **full-screen modal** with the long-form case study and, for project 01, the architecture SVG in a scrollable frame. Esc closes.
4. **02 — Architecture explorer** — an interactive diagram of the multi-tenant chatbot platform: edge column, a dashed "tenant boundary" box containing app nodes and three isolated stores, and a shared-platform column. Selecting a node updates a detail panel (tenancy / data / failure mode / scaling). The panel is sticky on desktop.
5. **03 — Operator console** — a working dashboard slice: tenant switcher (3 tenants), time-range switcher (1h / 24h / 7d), refresh. Switching triggers a ~620ms **loading state** with shimmer skeletons; the third tenant renders a designed **empty state**. Ready state shows four KPI cards, an SVG area+line chart (requests) with a dashed p95 series, and a "Top intents" list with animated bars. All numbers are deterministically generated from a seeded PRNG — copy the functions from the reference so values match.
6. **04 — Engagement** — a horizontal six-stage stepper on a track. It **auto-advances every 3.2s while in view**; clicking a stage pauses auto-advance for 1.5s. Below it, a detail panel shows the selected stage's description and deliverable chips.
7. **05 — About** — portrait card, career spine (five entries) whose orange rail fills as you scroll and whose current role highlights, then a three-up "What I work with" grid. **Hovering a skill card flips it to white** and replaces its chips with a slideshow: one technology at a time (counter, name, one-line detail) sliding in from the right every 1.8s, with a segmented progress bar. Cards hold a fixed 210px min-height so hover never resizes them.
8. **06 — Contact** — oversized headline, two paragraphs, and email / LinkedIn cards. Footer with three items.

## Behaviour details that matter
- Scroll reveals: sections fade up 20px on entry, once, via IntersectionObserver (the reference polls — use an observer instead).
- The career spine and stepper track fill proportionally to scroll position.
- Nothing may cause horizontal overflow at any width; the root has `overflow-x: hidden`.
- All intervals must be cleared on unmount.

## Responsive
Implement with Tailwind breakpoints (the reference does it in JS — convert to CSS):
- **≥1000px**: as designed — work rail + detail 1:2, architecture 3 zones + sticky panel, console chart 2:1.
- **<1000px (tablet)**: two-column panels stack to one column, sticky detail panel becomes static, architecture zones go two-up.
- **<760px (phone)**: everything single column, isolated stores stack, CV rail narrows (74px year column, rail at 84px), nav links hide (logo + "Let's talk" remain — add a simple anchor menu if you want, but do not add a hamburger drawer unless asked). Body text never below 15px; tap targets ≥44px.

## Definition of done
- Visually matches `reference/Portfolio.dc.html` at 1440px, 1024px and 390px.
- All five interactive behaviours work: project switching, case-study modal, architecture node selection, console tenant/range/refresh with loading + empty states, auto-advancing stepper, skill-card hover slideshow.
- Lighthouse: performance ≥95, accessibility ≥95 on desktop.
- `npm run build` clean, no TypeScript errors, no console warnings.
- Deployed to Vercel; `README.md` documents local dev and where to edit content.

Ask me before changing any copy, colour, spacing or interaction.
