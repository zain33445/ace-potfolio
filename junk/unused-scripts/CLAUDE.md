# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio single-page site for **ACE SERVICES**, a construction pre-estimation firm. React 19 + TypeScript, server-rendered/prerendered with **Vike** (not Vite SPA, not react-router — ignore `design.md`'s claim of react-router-dom, it is stale). Tailwind CSS v4, heavy Three.js and GSAP/Lenis motion work. The whole "Home" experience is one prerendered page composed of full-viewport sections driven by a custom fullscreen scroller.

## Commands

```bash
npm run dev      # vike dev on port 3000, host 0.0.0.0
npm run build    # vike build -> dist/client (static prerender) + dist/server
npm run preview  # serve the production build
npm run lint     # tsc --noEmit  (this is the ONLY check — there are no tests)
npm run clean    # rimraf dist server.js
```

There is **no test runner** and no lint tool beyond `tsc`. "Passing" means `npm run lint` is clean. Deployed on Vercel (`vercel.json`) as a static prerender: build output `dist/client`, SPA fallback rewrites everything to `/index.html`.

`DISABLE_HMR=true` disables HMR/file-watching (used in AI Studio-style hosted envs) — see `vite.config.ts`. Path alias `@` → repo root.

## Architecture

### Routing (Vike, file-based under `src/pages/`)
- `+config.ts` (root) — global Vike/vike-react config: `prerender: true`, Google Fonts preconnect, and a large block of JSON-LD structured data (Organization/FAQ/HowTo schema) injected into `<head>`. Edit SEO/meta here, not in `index.html`.
- `+Layout.tsx` — wraps every page: mounts `Preloader`, `Nav`, and provides `PreloaderContext`.
- `index/+Page.tsx` — the homepage; just renders `<BackgroundShader/>` + the ordered list of `*Section` components from `pages/Home/sections/`.
- `calculator/+Page.tsx` — standalone `/calculator` route (per-page title/description in its `+config.ts`).
- Section titles/order live in `index/+Page.tsx`; each section's per-page meta would go in a sibling `+config.ts`.

### Fullscreen scroller (REMOVED — see history below)
The previous FullscreenScroller system has been removed and replaced with simpler scroll behavior. **Nav.tsx** now uses `IntersectionObserver` for navScrolled state detection and native `scrollIntoView({ behavior: 'smooth' })` for anchor navigation.

### Section system
Each homepage section is a `<div id="section-id">` container (no longer wraps via a `<Section>` component). Sections are registered in `index/+Page.tsx` in display order.

### Key architectural decisions & history

#### Scroll system evolution
1. **FullscreenScroller removed** — Previously used `useLayoutEffect` + context-based section registration + `scrollIntoView` in Nav. Removed because 11 serial re-renders competed with GSAP initialization.
2. **GSAP ScrollSmoother removed** — `SmoothScroller.tsx` used `ScrollSmoother.create()` with `#smooth-wrapper`/`#smooth-content` DOM structure. Removed because it intercepts native scroll (applies translateY to content wrapper) which conflicts with framer-motion's `useScroll()` reading `window.scrollY` — HeroParallax scroll-driven transforms received near-zero progress, Nav's `scrollIntoView` fought ScrollSmoother, and both systems competed for scroll control.
3. **Current**: Native scrolling on all routes. All scroll-based components (HeroParallax useScroll, ProcessFlow ScrollTrigger, About3D scrollY, Reveal ScrollTrigger) work with native scroll positions.

#### Performance optimizations
- **RenderOnViewport** (`components/RenderOnViewport.tsx`): IntersectionObserver-based lazy-render wrapper defers heavy 3D/WebGL children (About3D, ProcessFlow) until ~200-400px from viewport.
- **HeroParallax** (`components/ui/hero-parallax.tsx`): Reduced from `h-[300vh]` to `h-[175vh]`, lighter framer-motion springs (stiffness 150, bounce 0), lazy images with `loading="lazy"` + `decoding="async"`, `will-change-transform` on container + cards, customizable header props.
- **Preloader**: Only lazy-loaded component in layout-shell via `next/dynamic` with `ssr: false`.

### Three.js — two coexisting approaches (know which you're editing)
1. **Vanilla three via `src/three/`** — `useThreeEngine(onFrame)` owns the renderer/scene/camera lifecycle, the RAF loop, and passes a `FrameParams` struct (`delta, time, mouseX, mouseY, isMouseIdle, scrollY, isVisible`) to a per-component `onFrame`. It handles mouse-idle detection, IntersectionObserver visibility, resize, and full cleanup/dispose on unmount. Used by `Hero3D`, `About3D`, `BackgroundShader`. When adding a vanilla scene, build geometry once and mutate it inside `onFrame`; do not create objects per frame.
2. **react-three-fiber** — only `components/EstimationMachine/` (`ThreeScene.jsx` `<Canvas>` + `SceneContent`/`ScenePrimitives`). This subtree is `.jsx`, declarative, and lit (point/directional lights) rather than wireframe. Don't mix the `useThreeEngine` pattern into it.

The root `*.blend` / `*.py` files and `model-*.glb` are a Blender asset-authoring pipeline (scene scripts + exports). They are **not currently imported** by any `src/` code — the live scenes are procedural. Treat them as source assets, not app dependencies.

### Cost estimator
Pure calculation lives in `src/services/costCalculator.ts` (base rates per project type × complexity/speed/zip factors → `CostBreakdown`). UI is refactored into `src/features/estimator/` — `useEstimator.ts` state hook, `useLerpedDisplay.ts` for animated number transitions, and `steps/` step components + `projectTypes.ts` config. `components/InteractiveEstimator.tsx` is the older monolithic variant; prefer the `features/estimator` decomposition. All shared shapes (`EstimationInputs`, `CostBreakdown`, `ProjectScope`, `SolutionItem`) are in `src/types.ts`.

### Headless WordPress integration (`src/services/wordpress/`)
Content comes from the **headless WordPress** backend at `theaceservices.com` (`WORDPRESS_API_URL` → the `wp/v2` namespace). The layer:
- `client.ts` — SSR/prerender-safe `fetch` wrapper (no axios), base URL from env with a hard fallback, typed query builder, `WordPressError`.
- `types.ts` — raw WP REST shapes; `html.ts` — DOM-free entity decode / tag strip (runs at build in Node); `content.ts` — app-facing view models (`Insight`, `ServicePage`) + adapters + the public API (`getInsights`, `getServicePages`).
- Consumed via Vike **`src/pages/index/+data.ts`** (`data()` runs at build under `prerender: true`) and read in components with `useData<Data>()`. `InsightsSection.tsx` is the first fully CMS-driven section.

**CMS reality (important, non-obvious):** it's a stock WordPress/Elementor site — **no ACF, no custom post types, no custom REST fields**. So the CMS can only cleanly serve blog Posts and Page bodies. Two gotchas baked into the code:
- The install is polluted with **SEO/casino spam** across many categories; genuine construction posts live in category **`1`**. `getInsights` therefore **allowlists** `INSIGHT_CATEGORY_IDS = [1]` rather than chasing a spam denylist. Update that list once the CMS is cleaned/categorized.
- Page bodies are **Elementor HTML blobs** — `ServicePage.contentHtml` is NOT drop-in renderable; use the sanitized `title`/`summary` instead.

Structured data the app still renders (project cost/area/turnaround, testimonials, FAQ, stats, hero copy) has **no source in the current CMS** — it remains hardcoded in components pending a decision to model it in WP (ACF + CPTs) vs keep as repo config. See the migration status below.

### Migration in progress: hardcoded data → CMS
The goal is to render all content from WordPress. Done: blog Insights. Still hardcoded (need CMS modeling decision before migrating): `SolutionAccordion` (solutions), `ProjectPortfolio` (projects), `TestimonialsSection`, `FAQSection`/`FAQAccordion`, `StatsSection`, `WhyChooseUs`, `processSteps.ts`, hero/about copy. The estimator (`costCalculator.ts`, `projectTypes.ts`) is calculation logic, not CMS content — leave it.

### Dead / unwired code — do not assume it runs
- `@google/genai` dependency, `gemini-schema-proxy.mjs`, `GEMINI_API_KEY`, and `README.md`'s "AI Studio app" text are leftovers from the project scaffold; there is **no Gemini usage in `src/`**.
- The prior Express/axios WordPress scaffold (`src/server/`, `wpService.ts`, old `wordpress.ts`) has been **removed** and replaced by `src/services/wordpress/` above.

## Design system

`design.md` is the authoritative visual/brand spec (blueprint/industrial aesthetic, `#FF6B00` orange accent, Space Grotesk / Inter / JetBrains Mono, bracket-corner motif, system-ID labels). Its stack/routing/component-tree sections are outdated (pre-Vike, pre-fullscreen-scroller), but the **color, typography, spacing, and interaction-language sections remain correct** — follow them for any new UI. Theme tokens are defined in `src/index.css` (Tailwind v4 `@theme`), fonts are loaded via `+config.ts` head HTML.

## Conventions
- Motion: `motion` (framer-motion API) for UI transitions, GSAP + ScrollTrigger for scroll-pinned sequences, Lenis for smooth scroll. Match the existing library per use-case rather than introducing another.
- Guard browser globals (`window`, `document`) for SSR/prerender — code runs on the server at build time. Existing code uses `typeof window !== 'undefined'` (e.g. `Nav.tsx`).
- `.tsx` for typed components; the r3f `EstimationMachine` subtree is intentionally `.jsx`.

## Note on `.opencode/` and `.agents/`
These hold a separate "GSD" agent/skill framework and a GSAP reference skill — tooling/config, not application code. Leave them alone unless the task is explicitly about that tooling.
