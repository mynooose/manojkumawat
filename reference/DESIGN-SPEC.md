# Design spec — Manoj Kumawat portfolio (dark "Bold" theme)

## Colour tokens
| Token | Hex | Use |
|---|---|---|
| bg | #0C0C0D | page background |
| surface | #131315 | cards, panels |
| surface-2 | #101012 | large section containers |
| surface-3 | #17171A → #0F0F11 | gradient on the featured work card (155deg) |
| skeleton | #141417 / #1D1D21 | shimmer gradient stops |
| line | #232326 | default border |
| line-2 | #2A2A2C | chip border |
| line-3 | #1A1A1D / #1C1C1F | faint dividers |
| line-hover | #3A3A3E | hovered border |
| text | #F2F2F0 | primary |
| text-2 | #A8A6A1 | body |
| text-3 | #8E8C86 | secondary body |
| text-4 | #78766F | labels |
| text-5 | #6C6A66 | de-emphasised headline half |
| text-6 | #4A4945 | marquee, footnotes |
| accent | #FF5C2B | brand orange |
| accent-2 | #7858FF | violet (second chart series, glows) |

Glows: `radial-gradient(circle, rgba(255,92,43,0.20), transparent 62%)` and `rgba(120,88,255,0.18)`, sized `min(60vw,900px)` / `min(52vw,820px)`. Never apply CSS `filter: blur()` to these — large blurred layers blank the page in some browsers.

## Typography
- Display / UI: **Bricolage Grotesque**. Weights 700–800 for headings, 500 for emphasis, 400 body.
- Mono: **Geist Mono** 400/500 — every uppercase label, number, chip and micro-caption.
- Scale:
  - h1 `clamp(48px, 9.4vw, 164px)`, line-height .86, letter-spacing -.05em
  - h2 `clamp(32px, 5.4vw, 76px)`, line-height .92, letter-spacing -.045em
  - contact h2 `clamp(38px, 7.2vw, 120px)`, line-height .88
  - card h3 `clamp(24px, 3vw, 42px)` (featured) / 16.5–19px (small cards)
  - body 15–16.5px, line-height 1.6–1.7, `text-wrap: pretty`
  - section eyebrow: mono 11.5px, letter-spacing .14em, uppercase, orange, format `01 — selected work`
  - micro labels: mono 9.5–10.5px, letter-spacing .14–.16em, uppercase

## Shape and spacing
- Radii: 100px (pills, nav, buttons, chips), 28px (large containers), 24px (panels), 18px (cards), 16px (inner cards), 14px (nodes).
- Section padding: `clamp(52px, 6vw, 100px)` vertical, `clamp(20px, 4vw, 56px)` horizontal. Contact: `clamp(60px, 7vw, 124px)` top.
- Grid gaps: 12–14px inside panels, `clamp(18px, 2.2vw, 32px)` between major columns.
- Borders are always 1px. Dashed 1px #3A3A3E marks the tenant boundary; dashed #232326 marks the "Also delivered" card.

## Motion
- Entry: `translateY(26px) + opacity 0 → 1`, .9s `cubic-bezier(.16,1,.3,1)`, staggered 60–80ms. Fill-mode **backwards**, never `both` (a never-started animation must leave content visible).
- Hover lift: `translateY(-2px/-3px)`, .2–.3s ease. Buttons additionally swap background to orange.
- Marquee: 44s linear infinite, duplicated track, `translateX(0 → -50%)`.
- Shimmer: 1.4s linear, `background-position -200% → 200%` on a 200% gradient.
- Slide-in (skill slideshow): `translateX(34px) + opacity 0 → 1`, .45s `cubic-bezier(.16,1,.3,1)`. Alternate between two identical keyframe names to force a restart on index change.
- Timings: stepper auto-advance 3.2s, pause-after-click 1.5s; skill slideshow 1.8s per technology; live hero stats 2.4s; console fake-load 620ms.
- `prefers-reduced-motion: reduce` → disable all animation, transition, auto-advance and smooth scrolling.

## Interaction states
- Selected project card: orange border, `rgba(255,92,43,0.07)` fill, orange index, tag reads "reading".
- Selected architecture node: orange border, `rgba(255,92,43,0.10)` fill, glow `0 0 0 1px rgba(255,92,43,0.35), 0 8px 26px rgba(255,92,43,0.12)`.
- Stepper: current node is a filled orange circle with dark number and a `0 0 0 5px rgba(255,92,43,0.14)` ring; reached nodes get a muted orange border; the track fills to `(step + 0.5) / 6`.
- Skill card hover: background #F2F2F0, title #0C0C0D, chips replaced by the slideshow (name #0C0C0D, detail #4A463E, dots #0C0C0D on rgba(12,12,13,0.16)).
- Console: active tenant = orange pill with dark text; active range = white pill with dark text.

## Data generation (console)
Deterministic per (tenant, range) so the chart never flickers between renders — copy `lcg()`, `series()` and `path()` verbatim from the reference logic. Chart viewBox is `0 0 100 34`, `preserveAspectRatio="none"`, strokes use `vector-effect: non-scaling-stroke`.

## Content rules
- Client names are withheld everywhere; the console is labelled "representative data · built for this page · no client data used". Keep both.
- Email: manojnkumawat77@gmail.com. LinkedIn: https://www.linkedin.com/in/manojkumawat2022/ (opens in a new tab).
