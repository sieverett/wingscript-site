# Noridoc: wingscript-site src

Path: @/src

### Overview

- Standalone marketing / landing site for wingscript (wingscript.com), separate from the product app codebase
- React 19 + TypeScript, built with CRA (`react-scripts`), prerendered with react-snap, deployed to Azure Static Web Apps
- The live landing page is the redesign in `src/pages/redesign/` — a faithful React port of the Claude Design handoff "Wingscript Landing.dc.html" (2026-08-15 rev): open-paper design system, Wing Violet `#5400D1`, capture-agnostic "any dialer" positioning, and a dual rep/team funnel

### How it fits into the larger codebase

- This is a **separate repository** (`wingscript-site`) from the main product (`converse-ai`). It has no auth, no backend, no sidecar, no Chrome extension
- Deployed to Azure Static Web Apps (`swa-wingscript-www` in `rg-wingscript-prod`, serving wingscript.com + www) via the `deploy-azure-swa.yml` GitHub Action on push to `main` — no staging environment. SPA routing + `/privacy` and `/terms` rewrites live in `public/staticwebapp.config.json`. The build output goes to `build/`
- The page's CTAs are the seams into the product: install CTAs → the wingscript Chrome Web Store listing; "Start a team trial" → `https://app.wingscript.com/admin?create=1` (self-serve org create → auto TEAM trial in the product backend); demo CTAs → a `mailto:hello@wingscript.com` team-pilot link
- Pricing copy (Free / Pro $19 / Team $39 manager + $19 member, 20-seat cap / Enterprise 20+) was reconciled 2026-08-15 against the product backend's `tier_gate.py` in the converse-ai repo. It is a manual copy — changes there do not propagate here
- Design tokens in `src/pages/redesign/redesign-tokens.css` are an independent port of the handoff's design-system bundle; they do not share code with the product app's theme

### Core Implementation

- **`src/index.tsx`** — Entry point. Owns `BrowserRouter` and the react-snap hydrate-vs-render decision (`hydrateRoot` when `#root` has prerendered children, `createRoot` otherwise). Renders `<App/>`
- **`src/App.tsx`** — Route table, deliberately router-agnostic so tests can mount it in a `MemoryRouter`:

```
BrowserRouter (index.tsx)
  └─ App (App.tsx)
       ├─ /   → RedesignLanding
       └─ /*  → Navigate to "/" replace
                (legacy /sales /teams /never-blank keep resolving
                 for old ads/emails)
```

- **`src/pages/redesign/RedesignLanding.tsx`** — The live landing page, a single-file component: nav, hero with a static "live demo moment" (CueCard on the HUD gradient), rep/team split, capture-agnostic band, ramp-loop cards, real-time-vs-post-call comparison, 4-tier pricing row, closer, footer. CTA destinations are single-source-of-truth constants at the top of the file (`CWS`, `TEAM_TRIAL`, `DEMO`) — all install CTAs intentionally point at the same Chrome Web Store listing (handoff decision, not a bug)
- **`src/pages/redesign/components.tsx`** — Faithful ports of the handoff's design-system primitives (`Button`, `Tag`, `LiveDot`, `CueCard`) plus `useLucide`, a hook that injects the Lucide CDN script once and swaps `<i data-lucide>` for SVGs. `useLucide` skips during react-snap prerender (detects `ReactSnap` in the user agent) so the snapshot matches the first client render
- **`src/pages/redesign/redesign-tokens.css`** — All DS tokens (color scales, gradients, type, radius, elevation, motion) scoped under `.wg-redesign` so they cannot leak into other pages. Also holds everything inline styles can't express: link/hover rules, the closer buttons, keyframes, `prefers-reduced-motion`, and the responsive media queries
- **`src/pages/LandingPage.tsx` + `src/pages/landing/`** — The OLD landing page (tick-driven LiveDemo, RAF demo-video engine, Netlify-era RequestModal). Now **unrouted dead code, kept deliberately for reference** (owner decision). Its variant A/B plumbing (`/sales`, `/teams`, `/never-blank` as `variant` props) is dead with it. The stale cuedesk CWS URL in `src/pages/landing/demo-scenes.tsx` was fixed to the wingscript listing even though unrouted
- **Tests** — `src/setupTests.ts` (jest-dom), `src/App.test.tsx` (routing: root serves the redesign, legacy + unknown paths redirect), `src/pages/redesign/RedesignLanding.test.tsx` (visitor-visible copy and CTA/footer link destinations). CI does **not** run tests — the deploy workflow only builds. They are a local pre-push gate: `CI=true npx react-scripts test --watchAll=false`

### Styling Architecture

Three CSS systems exist side by side:

| File | Purpose | Used by |
|---|---|---|
| `src/pages/redesign/redesign-tokens.css` | DS tokens + responsive grids, scoped under `.wg-redesign` | The **live** landing page |
| `src/landing-tokens.css` + `src/landing.css` | Old token system + BEM-ish page styles | The unrouted legacy `LandingPage` only |
| `src/theme.css` / `src/tailwind.output.css` | Webapp token copy + prebuilt Tailwind output | Inert scaffolding — no source uses Tailwind utilities |

The redesign page styles itself almost entirely with inline `style` props (matching the handoff); `redesign-tokens.css` exists because inline styles cannot express hover, media queries, or keyframes.

### Responsive Behavior

- The live page's responsive rules are the media queries at the bottom of `src/pages/redesign/redesign-tokens.css`: at `900px` the hero/split/compare grids collapse to one column and ramp/pricing to two; at `620px` the nav links hide, ramp/pricing go single-column, and section padding tightens. Grid classes (`wg-hero-grid`, `wg-split-grid`, `wg-ramp-grid`, `wg-pricing-grid`, `wg-compare-grid`) exist purely as media-query hooks — their desktop layout is set inline
- The breakpoint system in `src/landing.css` (880/640/480 + clamp typography) applies only to the unrouted legacy page

### Things to Know

- **react-snap crashes locally on Apple Silicon**: its bundled puppeteer 1.20 Chromium is x86_64-only, so `npm run build`'s `postbuild` fails with "Navigation failed because browser has disconnected". CI (ubuntu x64) works fine. To verify locally, run `npx react-scripts build` then invoke react-snap programmatically with `puppeteerExecutablePath` pointed at system Chrome
- react-snap logs `in browser redirect (/)` while crawling the footer's `/privacy` and `/terms` links — its local server doesn't know the SWA rewrites, so the SPA catch-all redirects. Harmless; the rewrites in `public/staticwebapp.config.json` take precedence in prod. `reactSnap.include` in `package.json` is just `["/"]`
- `public/cuedesk-mark.svg` is the **wingscript** mark under a legacy filename (content updated in the rebrand). It is still the favicon referenced by `public/index.html`, `public/privacy.html`, and `public/terms.html` — do not "fix" references to it without renaming the file everywhere
- Pricing on the page is explicitly **pre-launch** (badge: "Pre-launch · pricing not live yet"); the copy tests in `RedesignLanding.test.tsx` pin the exact numbers, so a pricing change must update both the page and the tests
- Footer links: `/privacy` and `/terms` are static HTML served via SWA rewrites (not React routes); `security` → `mailto:support@wingscript.com` and `contact` → `mailto:hello@wingscript.com` are the only monitored inboxes
- `RequestModal` in the legacy page was already dead code (Netlify Forms, no submit target) before the whole legacy page went unrouted

Created and maintained by Nori.
