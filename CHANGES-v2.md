# Change request v2 — UI craft pass (apply on top of the build you already have)

The design has been refined since the first handoff. `reference/Portfolio.dc.html` in this package is the **new** source of truth — re-diff against it. Six changes; nothing else about the layout, palette or copy has moved.

## 1. Scroll-spy navigation
The pill nav now reflects the section in view.
- Track the active section with an IntersectionObserver (or scroll handler) over `#work, #architecture, #console, #process, #about, #contact`. A section becomes active once its top passes **35% of viewport height**; the hero state is `top` (nothing highlighted).
- Active link: background `#1A1A1D`, colour `#F2F2F0`, and a 4px orange (`#FF5C2B`) dot before the label that scales `0 → 1` over .25s `cubic-bezier(.16,1,.3,1)`. Inactive: transparent background, `#A8A6A1`, dot at `scale(0)`.
- Nav links are hidden below 760px, as before.

## 2. Requests chart — crosshair, tooltip, gradient
The console chart is now interactive.
- Wrap the SVG in a `position: relative` container with `cursor: crosshair`, `onMouseMove` / `onMouseLeave`.
- Map the pointer to a bucket: `round(((clientX - rect.left) / rect.width) * 25)`, clamped 0–25 (26 buckets). Store as `hoverPt`, `-1` when out.
- Draw a vertical line at that bucket, `stroke #F2F2F0`, width .4, `stroke-opacity 0.55` when hovering and `0` when not, `vector-effect: non-scaling-stroke`.
- An absolutely-positioned 9px orange dot with a 2px `#131315` ring sits on the curve: `left = (i/25)*100%`, `top = ((34 - value*32) / 34) * 100%`.
- Tooltip above the dot: `translate(-50%, -118%)`, border `#2A2A2C`, background `#17171A`, radius 10px, shadow `0 10px 30px rgba(0,0,0,0.45)`, padding 7px 11px, mono 10.5px, `pointer-events: none`. Three items in a row: bucket label `#78766F` (`bucket 07`, 2-digit padded), requests `#FF5C2B`, p95 `#7858FF` (`96 + round(lat[i] * 120)` ms).
- Area fill changes from a flat `rgba(255,92,43,0.12)` to a vertical linear gradient: `#FF5C2B` at 0.28 opacity → 0.02.
- When not hovering, all derived readouts fall back to bucket 13 so nothing jumps.

## 3. KPI sparklines
Each of the four KPI cards gains a trend line, bottom-right, beside the delta text.
- `viewBox="0 0 60 16"`, `preserveAspectRatio="none"`, 60×16px, `overflow: visible`, stroke-width 1, `vector-effect: non-scaling-stroke`.
- Path helper: `x = (i / (n-1)) * 60`, `y = 16 - value * 14`, 14 points.
- Series and colours: requests → the main series, `#FF5C2B`; p95 → the latency series, `#7858FF`; error rate and active users → seeded series (`ri + 7`, `ri + 9`), `#3A3A3E`.
- The value row becomes `display:flex; align-items:flex-end; justify-content:space-between` so the number stays left and the sparkline right.

## 4. Layered surface depth
Add to the five large surfaces — featured work card, architecture explorer panel, console shell, method container, portrait card:
`box-shadow: inset 0 1px 0 rgba(255,255,255,0.035), 0 18px 44px rgba(0,0,0,0.42);`
KPI cards get the inset highlight only: `inset 0 1px 0 rgba(255,255,255,0.03)`.

## 5. Button press states
Primary buttons ("Let's talk", "Open case study") gain an `:active` state — `transform: translateY(0) scale(.98–.985)`, transition .18s ease — so clicks feel physical rather than instant.

## 6. Case-study modal entrance
The full-screen modal animates in instead of appearing:
`@keyframes modalIn { from { opacity: 0; transform: translateY(14px) scale(.995) } to { opacity: 1; transform: none } }`
applied as `modalIn .4s cubic-bezier(.16,1,.3,1) backwards`. Use fill-mode **backwards**, not `both`.

## Notes
- Everything above must be disabled or made static under `prefers-reduced-motion: reduce` (no auto-advance, no transitions, tooltip still functional).
- The chart tooltip and crosshair are pointer-only; do not add hover-dependent content that keyboard or touch users cannot reach — the KPI cards and table already carry the same numbers.
- Clear any new intervals or listeners on unmount.

## Acceptance
At 1440px: hovering the chart shows a tracking dot and tooltip; scrolling highlights one nav pill at a time; each KPI card shows a sparkline; opening a case study animates in; clicking a primary button visibly presses. At 390px: nav links hidden, no horizontal overflow, chart still renders (tooltip optional).
