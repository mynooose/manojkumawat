# Project context

Background a new contributor (or a future session) needs that the code itself
does not explain. For *how* the code is organised, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## What this is

The personal portfolio of **Manoj Kumawat**, solution architect. One page, one
route, live at **https://manojkumawat.com**.

Its job is narrow: convince a technical buyer that the person behind it can
take a platform from architecture to production. Everything on the page serves
that — the operator console and architecture explorer exist to *demonstrate*
systems thinking rather than assert it.

This is personal, not connected to any employer.

## Non-obvious constraints

- **Client names are withheld everywhere.** Projects are described by shape and
  outcome, never by customer. Do not add a logo wall or a named case study.
- **The operator console is fabricated data** and is labelled
  *"representative data · built for this page · no client data used"*. Keep
  that label. Removing it turns a demo into a false claim.
- **Figures are mixed provenance.** Projects 01 and 04 carry real numbers; 02,
  03 and 05 are estimates. They read as equally solid on the page. Confirm or
  soften them before the site is pushed hard.
- **The design is approved and final.** It arrived as a handoff package with a
  pixel-specified reference. Do not "improve" it while changing code — ask
  first for any change to copy, colour, spacing or interaction.

## Decisions and why

| Decision | Reason |
| --- | --- |
| Next.js App Router over a static file | Server-rendered content, and room to add real backend features later |
| Vercel over Cloudflare Pages | Cloudflare's dashboard routed the Pages flow into a Worker; Vercel serves this with no build step and no nameserver move |
| DNS stays at GoDaddy | Vercel serves the apex from an `A` record, so there was no reason to migrate nameservers |
| Tailwind v4, tokens in `@theme` | v4 is CSS-first; this is the direct equivalent of the `tailwind.config.ts` theme the handoff asked for |
| `next/font`, not the Google CDN | Removes a render-blocking third-party request; the previous build fetched fonts *and* React from CDNs at runtime |
| Contact goes to a Gmail address | The design uses `manojnkumawat77@gmail.com`. `hello@manojkumawat.com` does **not** exist and needs a forwarder if it is ever used |

## History worth knowing

The site has been rebuilt twice. Both earlier versions are in git history.

1. **Static design-component export.** A single 102KB HTML file rendered
   client-side by a bundled runtime that fetched React from unpkg at page load.
   It worked, but crawlers saw almost no markup and a slow CDN meant a blank
   page. It also had no responsive breakpoints at all.
2. **Light/serif Next.js rebuild.** Same design, ported properly. Superseded
   after a week by a new approved design.
3. **Dark "Bold" design (current).** A different design entirely, plus a v2
   craft pass adding scroll-spy nav, chart crosshair and tooltip, KPI
   sparklines, surface depth, press states and a modal entrance.

## Traps that have already cost time

- **The Vercel project's framework preset must stay "Next.js".** It was
  originally created via CLI as a static site, so `framework` was `null`.
  Vercel then skips the build, uploads the repo as files, finds no
  `index.html`, and the whole domain 404s. Nothing in the repo shows this —
  it is project configuration.
- **Bricolage Grotesque needs its `opsz` axis.** Load it without and every
  display heading renders noticeably wider than the design. `next/font` only
  permits `axes` when the weight is variable, so the weight list is omitted on
  purpose.
- **Grid tracks must use `minmax(min(Npx, 100%), 1fr)`.** Plain
  `minmax(Npx, 1fr)` does not collapse below `N`; it overflows the viewport.
  This caused horizontal scroll on phones in the first build.
- **Two GitHub accounts exist on this machine.** A bare credential lookup
  resolves to a work account, so the git remote pins the username:
  `https://mynooose@github.com/mynooose/manojkumawat.git`.

## Outstanding

- **Lighthouse has never been measured.** The handoff asks for performance and
  accessibility ≥95 on desktop. Unverified.
- **Estimated figures** on projects 02, 03 and 05, as above.
- **No analytics.** Nothing measures whether the page converts.
