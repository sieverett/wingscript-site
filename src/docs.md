# Noridoc: cuedesk-site src

Path: @/src

### Overview

- Standalone marketing / landing site for cuedesk, separate from the product app codebase
- React 19 + TypeScript, built with CRA (`react-scripts`), deployed to Netlify
- All styling is hand-written CSS using custom properties -- Tailwind is installed but its utility classes are not used anywhere in the source

### How it fits into the larger codebase

- This is a **separate repository** (`cuedesk-site`) from the main product (`converse-ai`). It has no auth, no backend, no sidecar, no Chrome extension
- Deployed to Netlify with an SPA catch-all redirect (`netlify.toml`). The build output goes to `build/`
- Design tokens in `landing-tokens.css` share the same visual language as the product app's `theme.css`, but the two are independent copies -- changes in one do not propagate to the other

### Core Implementation

- **`index.tsx`** -- Entry point. Owns `BrowserRouter` (react-router-dom v6). All routes render `LandingPage` with a `variant` prop for future A/B testing (not yet differentiated):

```
BrowserRouter
  ├─ /            → redirect to /sales
  ├─ /sales       → LandingPage variant="sales"
  ├─ /never-blank → LandingPage variant="never-blank"
  ├─ /teams       → LandingPage variant="teams"
  └─ /*           → redirect to /sales
```

- **`LandingPage.tsx`** -- Single-file page component containing `LiveDemo` (tick-based animated transcript + cue widget), `RequestModal` (3-step beta signup via Netlify Forms), and the page layout. Imports `DemoVideo` from `pages/landing/demo-scenes.tsx`
- **`pages/landing/demo-engine.tsx` + `demo-scenes.tsx`** -- RAF-based 29-second product demo video loop built on a Stage/Sprite/Timeline rendering engine. `DemoVideo` is the exported component used in the dark demo section

### Styling Architecture

- **Two CSS variable systems exist side-by-side:**

| File | Purpose | Used by |
|---|---|---|
| `landing-tokens.css` | Primary token system. Dark default `:root` + `.theme-light` override | All landing page CSS |
| `theme.css` | Webapp token system, referenced by `tailwind.config.js` | Tailwind config only -- not used by landing page styles |

- **`landing.css`** -- All landing page styles. BEM-ish class naming (`.hero__inner`, `.livedemo__body`, `.nav__link`). No Tailwind utilities
- **`tailwind.output.css`** -- Pre-built Tailwind output imported in `index.tsx`. Present but effectively inert since no source files use Tailwind classes

### Responsive Behavior

Three breakpoints plus fluid typography:

| Breakpoint | What changes |
|---|---|
| `clamp()` on `.hero__h` and `.section-h` | Fluid font scaling across all widths (e.g. `clamp(36px, 6.5vw, 80px)`) |
| `880px` | Hero grid collapses to single column, how-it-works steps stack, fit cards stack |
| `640px` | Nav hides center link, padding drops from 32px to 16px, livedemo transcript/cues stack vertically, footer stacks, demo video goes edge-to-edge (border-radius: 0), tap targets enlarged to 44px min-height |
| `480px` | Modal padding tightens, modal heading uses `clamp()`, hero sub text shrinks to 16px |

`html, body` have `overflow-x: hidden` to prevent horizontal scroll from fluid elements on small viewports.

### Things to Know

- The `variant` prop on `LandingPage` is plumbing for A/B demand validation across `/sales`, `/never-blank`, and `/teams`. All three routes render identical content today
- `LiveDemo` is tick-driven: a `tick` counter in a `setInterval` triggers transcript lines, cue cards, and the reply at hardcoded tick thresholds defined in constants at the top of `LandingPage.tsx`
- `RequestModal` submits to Netlify Forms (HTML `form` with `data-netlify="true"`), not to any backend API
- The Tailwind toolchain (`tailwind.config.js`, `tailwind.input.css`, `tailwind.output.css`) is present as scaffolding but contributes no visible styles to the landing page -- all styling flows through `landing-tokens.css` + `landing.css`

Created and maintained by Nori.
