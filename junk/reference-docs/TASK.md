# ACE SERVICES — Animation Upgrade Task Log

## Session: Jul 07 2026

### Meta
- **Strategy**: Tier 1 quick wins first (count-up, text reveals, ticker, preloader→hero handoff)
- **Supervision**: Each task logged here, reviewed before next task starts
- **Agents used**: documented per task

---

### [TASK-101] Create `useCountUp` hook
- **Status**: ✅ COMPLETED
- **Agent**: inline (CEO)
- **Time**: 30s
- **Description**: Created `src/hooks/useCountUp.ts` — an animated number counter hook using `requestAnimationFrame`. Supports configurable duration, easing, prefix/suffix, and scroll-triggered start.
- **Files**: `src/hooks/useCountUp.ts`

---

### [TASK-102] Integrate count-up into StatsSection
- **Status**: ✅ COMPLETED
- **Agent**: inline (CEO)
- **Time**: ~3 min
- **Description**: Refactored stats data to separate numeric values from display strings. Replaced hardcoded `stat.num` with live `useCountUp` counters. Added IntersectionObserver to fire count-up when the section scrolls into view (threshold: 30%).
- **Files**: `src/components/Home/sections/StatsSection.tsx`

---

### [TASK-103] Create `TextReveal` component for section headings
- **Status**: ✅ COMPLETED
- **Agent**: inline (CEO)
- **Time**: ~2 min
- **Description**: Built reusable character-by-character text reveal component. Uses `motion.span` staggered char animations triggered by IntersectionObserver with configurable delay/duration/threshold. Supports heading tags h1-h6, span, and p. Reads from `splitTextIntoChars` utility. Includes `sr-only` fallback for a11y.
- **Files**: `src/components/TextReveal.tsx`

---

### [TASK-104] Integrate TextReveal into WhyChooseUsSection heading
- **Status**: ✅ COMPLETED
- **Agent**: inline (CEO)
- **Time**: ~1 min
- **Description**: Replaced static `<h2>` heading in WhyChooseUsSection with `<TextReveal>` component. Character-by-character stagger now triggers when the section scrolls into view.
- **Files**: `src/components/Home/sections/WhyChooseUsSection.tsx`

---

### [TASK-105] Build CursorFollower component + wire into layout
- **Status**: ✅ COMPLETED
- **Agent**: senior-frontend (parallel dispatch) + CEO (wiring)
- **Time**: ~2 min
- **Description**: 24px orange ring (#FF6B00) following mouse with GSAP quickTo (power3.out, 0.4s lag). Hides native cursor. Hover state scales 1.5x + brightens on buttons/links/data attributes. First-move fade-in. SSR-safe. Wired into layout-shell.tsx so it renders on all routes.
- **Files**: `src/components/CursorFollower.tsx`, `src/app/layout-shell.tsx`

---

### [TASK-106] Upgrade Hero ticker to GSAP seamless loop
- **Status**: ✅ COMPLETED
- **Agent**: motion-designer (parallel dispatch)
- **Time**: ~2 min
- **Description**: Replaced CSS `@keyframes` ticker with GSAP `xPercent: 0 → -50` infinite tween. Uses `repeat: -1, ease: 'none', duration: 30`. Removed stale `.ticker-wrap`, `.ticker`, `@keyframes ticker-anim` from globals.css.
- **Files**: `src/components/Hero.tsx`, `src/app/globals.css`

---

### [TASK-107] Code review findings & fixes
- **Status**: ✅ COMPLETED
- **Agent**: CEO (code review)
- **Time**: ~3 min
- **Description**: Reviewed all 8 files across TASK-101–106. Found and fixed 2 issues:
  1. **MEDIUM** — StatsSection counters (`isActive={sectionVisible}`) could fire before cards were wheel-revealed. Fixed: gated on `sectionVisible && visible`.
  2. **LOW** — CursorFollower set `cursor: none` on touch devices. Fixed: added `'ontouchstart' in window` guard.
- **Verified**: `tsc --noEmit` clean after both fixes.

---


