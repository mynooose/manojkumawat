# Handoff: manojkumawat.com — portfolio deployment

## Overview
A single-page solution-architect portfolio for Manoj Kumawat. It is finished, hi-fidelity, and content-complete. The task is **deployment, not redesign**: get this page live on Cloudflare Pages at `manojkumawat.com` (domain already purchased on GoDaddy).

## About the design files
`site/` contains the working prototype:

| File | Role |
| --- | --- |
| `index.dc.html` | The whole page — markup + inline styles + a JS logic class at the bottom |
| `support.js` | Runtime the page loads (`<script src="./support.js">`). Required — do not delete |
| `portrait-manoj.png` | About-section photo |
| `architecture-chatbot.svg` | Architecture diagram opened by the "View the architecture diagram" viewer |

The page is a **Design Component**: `index.dc.html` is a real HTML document that opens directly in a browser. Everything is inline-styled, so there is no build step and no CSS bundle. Fonts come from Google Fonts over the network.

**Preferred approach: ship it as-is.** Rename `index.dc.html` → `index.html`, keep the four files together at the site root, and deploy the folder as static assets. Nothing else is needed.

**Only if a rebuild is explicitly wanted:** treat the HTML as a pixel-accurate reference and recreate it in a framework — the colours, type and spacing below are the source of truth. Do not "improve" the design during a port.

## Fidelity
**High fidelity.** Final colours, typography, spacing, animation and copy. Reproduce exactly.

## Deployment — Cloudflare Pages

1. **Repo**: create a git repo containing the four files, with `index.dc.html` renamed to `index.html` at the repo root (or inside a `public/` folder — then set that as the build output directory).
2. **Cloudflare Pages**: Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/` (or `public`)
3. **Custom domain**: Pages project → Custom domains → Set up a custom domain → `manojkumawat.com`, and again for `www.manojkumawat.com`.
4. **DNS (GoDaddy)** — the domain is registered at GoDaddy. Two options:
   - **Recommended — move DNS to Cloudflare**: add the site in Cloudflare (Add a site → `manojkumawat.com` → Free plan), copy the two Cloudflare nameservers, then in GoDaddy → My Products → Domain → Nameservers → Change → "I'll use my own nameservers" → paste both. Propagation is usually under an hour. Cloudflare then creates the Pages DNS records automatically and issues the TLS certificate.
   - **Keep DNS at GoDaddy**: in GoDaddy DNS, add a `CNAME` for `www` → `<project>.pages.dev`, and for the apex use GoDaddy forwarding of `manojkumawat.com` → `https://www.manojkumawat.com` (GoDaddy does not support CNAME flattening at the apex). This is the weaker option — the apex is a redirect, not a real record.
5. **Verify after deploy**: page loads with no console errors; fonts render (Instrument Serif headings, JetBrains Mono labels); the portrait and the architecture SVG both load; the LinkedIn link opens in a new tab; the scroll-driven animations (hero schematic trace, approach spine, About timeline spine) run.

### Recommended repo shape
```
/index.html          (renamed from index.dc.html)
/support.js
/portrait-manoj.png
/architecture-chatbot.svg
/_headers            (optional, see below)
```
Optional `_headers` for caching the assets:
```
/*.png
  Cache-Control: public, max-age=31536000, immutable
/*.svg
  Cache-Control: public, max-age=31536000, immutable
```

## Page structure
One scrolling page, sections in order:

1. **Header / nav** — sticky, links to `#work`, `#approach`, `#about`, `#contact`.
2. **Hero** — headline, sub-line, two CTAs, plus a live schematic card ("From signup to serving · one tenant's journey") that traces a 17-step tenant lifecycle on a timer.
3. **01 Selected work** — tabbed switcher over five projects (left rail of titles, right panel with problem / built / outcome, an architecture layer list, and a live metric panel). Project 01 has a diagram: clicking "View the architecture diagram" opens a windowed viewer over the page with zoom in/out/reset and Esc-to-close. Below: an "Also delivered" strip.
4. **02 How I work** — six-stage delivery process on a scroll-filled vertical spine; stages light up as they pass the scroll anchor.
5. **03 About** — portrait on the left; on the right a career timeline (2013—17 IIT BHU → 2017—22 Samsung R&D → 2022 Cadence → 2022—24 Tynza → 2024—now Algo8 AI) on its own scroll-filled spine with dots. The final "now" row deepens to a dark burnt-brown fill when reached.
6. **04 What I work with** — six white cards (Architecture and platform, AI and data, Backend, Frontend, Cloud and infrastructure, Security and networking), each with chip-style tags.
7. **Contact** — dark band with email and LinkedIn (`https://www.linkedin.com/in/manojkumawat2022/`, opens in a new tab).

## Interactions & behavior
- **Reveal on scroll**: elements marked `data-reveal` fade and rise into place once via IntersectionObserver.
- **Two scroll spines**: `[data-spine]` (approach) and `[data-cvspine]` (About timeline). A scroll listener measures the container against an anchor at ~60% viewport height and sets a fill height; dots and labels change colour as the fill passes them. Transitions ~0.5–0.6s `cubic-bezier(.4,0,.2,1)`.
- **Timers** (all disabled under `prefers-reduced-motion`): hero schematic trace (1.9s), tenant cycle (1.15s), RAG pulse (0.82s), checklist (1.5s), and a live bar chart that jitters on the analytics project.
- **Project tabs**: click or Enter/Space on a title switches the panel; selected tile is dark (`#1A1614`) with light text.
- **Diagram viewer**: fixed overlay + panel, zoom 1×–3× in 0.25 steps, closes on backdrop click or Escape.
- **Hover**: cards lift 3px with a warm shadow and burnt-orange border; timeline rows and chips warm on hover.

## Design tokens
**Colour**
| Token | Hex | Use |
| --- | --- | --- |
| Ground | `#FBF8F4` | page background |
| Band | `#EFE9E3` | About / alternate band background |
| Ink | `#1A1614` | headings, rules, dark tiles |
| Body | `#544C46` | body copy |
| Muted | `#635A52` | secondary copy |
| Faint | `#A2968C` | inactive labels |
| Accent | `#9C4A1E` | burnt orange — labels, spines, links |
| Accent deep | `#7A360F` | current-role highlight |
| Copper | `#C8966E` / `rgba(200,150,110,…)` | gradient washes |
| Hairline | `#E2D8CE` | card borders, dividers |
| Rail | `#DCD0C5` | unfilled spine |
| On-dark text | `#FBF8F4`, secondary `#C8BCB0`, accent `#E0A97E` | dark bands |

No pure black anywhere. Band gradients: `linear-gradient(170deg, #EFE9E3, rgba(156,74,30,0.10) 55%, #EFE9E3)` plus `radial-gradient(760px 420px at 88% 0%, rgba(200,150,110,0.13), transparent 62%)`.

**Type** — Instrument Serif (400, headings, `letter-spacing:-0.02em`), Inter Tight (400/500, body), JetBrains Mono (400, labels/eyebrows at 9.5–11px, `letter-spacing:0.12–0.22em`, uppercase). H1 `clamp(40px,4.6vw,68px)/0.98`; H2 `clamp(32px,4vw,50px)/1.05`; card H3 26px; body 16–19px, line-height 1.55–1.65.

**Spacing / shape** — section padding `72–84px 52px`; max content width 1240px; text measure 600–660px. Radii: 8px buttons, 12px hero card, 14px capability cards, 999px chips. Shadows: `0 12px 30px rgba(60,35,20,0.08)` resting, `0 16px 34px rgba(60,35,20,0.10)` on hover.

## Content notes (before going live)
- Client names are deliberately withheld; project 01 (50+ tenants) and project 04 (30+ doctors, 400+ advisees, 90+ consultations) carry **real** figures. The remaining projects still carry **estimated** figures — confirm or replace them.
- Contact email in the page: `hello@manojkumawat.com` — make sure that mailbox exists (Cloudflare Email Routing can forward it to a personal inbox for free) or change it.

## Assets
- `portrait-manoj.png` — cropped from the client's original photo. Displayed at `aspect-ratio:4/5`, `object-fit:cover`, `object-position:50% 12%`, unfiltered.
- `architecture-chatbot.svg` — client-supplied architecture diagram.
- Fonts: Google Fonts CDN (no local files).

## Files
Everything is in `site/`. `index.dc.html` is the deliverable page; the other three are its dependencies.
