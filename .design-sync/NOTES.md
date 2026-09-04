# design-sync notes — ace-services

## Repo shape

This repo is the `ace-services` Next.js app itself, **not** a published component
library — there is no `dist/`, no `.d.ts` exports, and no Storybook. The
package-shape converter's normal entry-resolution assumes either a real
`dist/` build or that `node_modules/<pkg>` exists (self-reference); neither is
true here, so a synthetic entry (`.ds-entry.mjs`, gitignored-adjacent but
committed since it's a durable input) re-exports the 31 "core" reusable
components by name from `src/components/**`. Which 31 were picked, and their
src paths, live in `cfg.componentSrcMap` — that map is also what makes the
component *list* non-empty, since there's no `.d.ts` to discover exports from.

Page-specific components (`src/components/Home/sections/*`, `*PageClient`)
and pure integration/tracking components (`BotpressChat`, `ClarityAnalytics`,
`ThirdPartyScripts`, `RenderOnViewport`) were deliberately excluded from the
sync scope — user chose "core components only" when asked about preview
scope.

## Fixes applied during first sync (2026-08-21)

- **`[BUNDLE_EXPORT]` / bare `process` ReferenceError (all 31 components)**:
  one of the bundled npm deps (likely `react-dropzone`, used by `FileUpload`)
  references bare `process` (not just `process.env.NODE_ENV`) at module
  scope, which isn't covered by the converter's built-in
  `process.env.NODE_ENV` esbuild define and crashed the whole bundle before
  `window.AceServices` was ever populated. Fixed with `.ds-shim.mjs` (repo
  root, committed) — polyfills `globalThis.process` — imported as the very
  first line of `.ds-entry.mjs` so it evaluates before any other import's
  subtree (ESM evaluates imported modules in encounter order; a
  zero-dependency first import runs first).
- **`[CSS_IMPORT_MISSING]` (`tailwindcss` bare import)**: `globals.css` is a
  Tailwind v4 *source* file (`@import "tailwindcss";`), not compiled CSS —
  the converter's CSS scraper can't resolve a bare npm-package `@import`.
  Fixed by pointing `cfg.cssEntry` at the **compiled** stylesheet from a real
  `next build` (`.next/static/css/<hash>.css`, picked the largest of the 3
  emitted files). **Re-sync risk**: this filename is a content hash that
  changes on every `next build` — re-run `npm run build` and re-glob
  `.next/static/css/*.css` for the largest file before every re-sync, and
  update `cfg.cssEntry` to match.
- **`[FONT_MISSING]` (Inter)**: brand font is self-hosted via `next/font/local`
  (`src/app/fonts/google/inter/*.woff2`), which next/font wires up at Next
  build time — not a plain `@font-face` CSS file the scraper would find.
  Added `.design-sync/fonts.css` (committed) with hand-written `@font-face`
  rules pointing at the real woff2 files, wired via `cfg.extraFonts`.
- **`[FONT_MISSING]` (Cambria)**: non-blocking, not fixed — Cambria is a
  system-font fallback somewhere in the Tailwind-generated font stack, not an
  intentional brand font. Accepted as a substitute (renders with system
  serif in the DS pane).
- **`[RENDER_BLANK]` on `TextGenerateEffect` and `DraggableCardContainer`
  floor cards**: both need real props/children to render anything
  (`words` string, `children` respectively) — the `.d.ts` crash-prevention
  defaults left them empty. Authored real previews for both
  (`.design-sync/previews/`).
- **`[GRID_OVERFLOW]` on `DraggableCardContainer`**: only occurred with a
  since-removed second story (`MultipleCards`, absolutely-positioned cards
  that overflowed the grid cell) — simplified the preview to a single
  `Default` story instead of fighting the layout in a static capture.

## Known render warns (accepted, not new on re-sync)

- **`TextGenerateEffect` grading capture is blank** (`Default` and
  `WithSubtext`): the component fades in via `motion` opacity animation on
  mount; `package-capture.mjs` screenshots on `networkidle`, which fires
  before the animation settles, so the graded screenshot shows nothing even
  though the DOM content and render-check both confirm it's correct. Graded
  `good` from structural/DOM verification, not the screenshot. This is a
  static-capture limitation of any opacity/transform-animated mount, not a
  defect — expect it again for any newly authored animated component.

## What's NOT yet authored (floor cards, honest baseline)

22 of the 31 core components still ship the typographic floor card (fully
functional bundle + `.d.ts` + `.prompt.md`, just no rich preview yet):
BlogCard3D, CardBody, CardContainer, CardItem, CometCard, CursorFollower,
DraggableCardBody, ErrorBoundary, Footer, HeroParallax, Lens,
LiquidGlassFilter, Nav, PaginationGrid, ProcessFlow, Reveal, RevealInner,
TableOfContents, TextRepel, TextReveal, TypewriterEffect,
TypewriterEffectSmooth. Some of these (Nav, Footer, ProcessFlow,
TableOfContents, TypewriterEffect) render the typographic block rather than
real content because they either read Next.js router/navigation context that
doesn't exist outside the app (Nav/Footer), or need a required prop with no
safe default (`TableOfContents.items`, `TypewriterEffect.words`,
`Reveal`/`RevealInner`/`DraggableCardBody`'s `children`). Authorable
incrementally on any future re-sync — the standing offer per the skill design.

## Re-sync risks

- `cfg.cssEntry` is a content-hashed `.next` build path — WILL go stale;
  re-glob it every re-sync (see above).
- `.ds-shim.mjs` / `.ds-entry.mjs` are hand-maintained, not generated —
  adding/removing a core component means editing both `.ds-entry.mjs` and
  `cfg.componentSrcMap` together.
- No `.d.ts` exists anywhere in this repo, so every `<Name>.d.ts` the
  converter emits is inferred from usage/JSDoc, not authoritative shipped
  types — expect looser prop contracts than a real published DS.
