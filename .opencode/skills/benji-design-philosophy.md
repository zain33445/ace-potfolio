---
name: benji-design-philosophy
description: Apply Benji Taylor's design philosophy (simplicity through gradual revelation, fluidity through seamless transitions, delight through selective emphasis) to UI/UX design and implementation.
---

# Benji Taylor Design Philosophy

A design philosophy derived from Benji Taylor's articles — **Family Values**, **Honkish**, **Morphing Icons with Claude**, **Liveline**, and **Agentation**. Use this skill whenever you are designing, building, or reviewing UI/UX for apps, components, or interactions.

---

## Core Principles

### 1. Simplicity through Gradual Revelation

Don't show everything at once. Reveal content progressively as it becomes relevant.

**Guidelines:**
- **Singular focus per step** — each tray, panel, or screen should present one piece of content or one primary action
- **Progressive disclosure** — fundamentals at your fingertips; advanced features surface only when context demands them. *"Complexity kept out of sight and out of mind until required."*
- **The room analogy** — *"Each action by the user makes the interface unfold and evolve, much like walking through a series of interconnected rooms. The user sees where they're going as they go there."*
- **Context preservation** — overlay content onto the current context rather than displacing the user with full-screen transitions
- **Opt-in complexity** — start minimal, let users opt into more. *"Everything else is opt-in"*
- **Do one thing well** — a component should have a clear single purpose. *"Does one thing: draw a line that moves smoothly. Everything else is opt-in."*

**Implementation patterns:**
- Dynamic tray/drawer systems that expand, contract, and adapt
- Step-by-step wizards that encapsulate overwhelming flows into manageable chunks
- Varying tray heights to make progression visually clear
- Compact signals (not full-screen) for transient actions
- Minimal required props with sensible defaults

### 2. Fluidity through Seamless Transitions

Elements should morph rather than jump. Motion guides understanding.

**Guidelines:**
- **No static transitions** — every state change should animate meaningfully. *"We fly instead of teleport."*
- **Shared element continuity** — if a component persists between screens, keep it visually consistent. Don't duplicate what's already visible. *"If a component occupies a space and will persist in the next phase of the user's journey, it should remain consistent."*
- **Purposeful motion** — each animation serves to help users understand their path from A → B. Don't animate for its own sake.
- **Smooth interpolation** — values should lerp (linearly interpolate) between states rather than snapping. *"Nothing jumps."*
- **Morph over swap** — icons should transform into other icons rather than crossfading. Use shared underlying structure. (e.g., three SVG lines for every icon; unused lines collapse to invisible points)
- **Rotation groups** — icons that are the same shape at different rotations should rotate, not morph coordinates
- **Text morphing** — animate text transitions using shared letters (e.g., "Continue" → "Confirm" shares the "Con" prefix)
- **Directional awareness** — tab/panel transitions should move in the direction of the user's action (left → right, up → down)
- **Avoid redundant animations** — don't re-animate what's already on screen

**Implementation patterns:**
- Morphing component instances (not fading in/out)
- Layout animations with shared element transitions (FLIP technique)
- Smooth data interpolation for live-updating UI
- Icon systems that share a common path structure for morphing
- Text that animates morphs between states
- Preserved continuity for elements that persist across views

### 3. Delight through Selective Emphasis

Sprinkle delightful moments intentionally, not uniformly.

**Guidelines:**
- **The Delight-Impact Curve** — delight potential increases as feature usage frequency decreases. Less-used features benefit most from delightful moments. *"For features encountered less often, the opportunity to inject delight significantly enhances the user experience. For frequently used features, the value of adding further delight gradually diminishes."*
- **Selective emphasis** — *"Mastering delight is mastering selective emphasis. It's knowing where, when, and how to apply magical moments intentionally."*
- **Consistent polish everywhere** — *"Many products neglect their less commonly used features... like going to a fancy restaurant but finding it has a dirty bathroom."* Every part of the app, regardless of usage frequency, should receive the same holistic design approach.
- **Surprise as a tool** — easter eggs and unexpected moments create lasting impressions, but only in places where they won't become annoying
- **Respectful delight** — delightful moments should value the user's time and emotional investment, not distract from the task
- **Toyful utility** — design interfaces that feel as much like a toy as a utility. *"Software that embraces playfulness, experimentation, and delight."*

**Implementation patterns:**
- Animated empty states with personality
- Micro-interactions on infrequent actions (backup complete → confetti, QR code → ripple effect)
- Skeuomorphic details (items tumbling into a trash can)
- Custom typefaces and bespoke sound design
- Physics-based reactions (emoji collisions, spring animations)
- Easter eggs in moderate-traffic features

### 4. Presence and Aliveness (from Honkish)

Design for real-time, human-feeling interaction.

**Guidelines:**
- **Presence-first** — show when someone is actively engaged. Use live indicators, not just static read receipts.
- **Character-by-character** — when appropriate, reveal content as it's being created (typing, editing, deleting in real-time)
- **Real-time reactions** — haptic feedback felt by both parties simultaneously creates a shared space
- **Active engagement** — features that require both parties to be present reinforce the feeling of aliveness
- **Ephemerality as a feature** — not everything needs to be saved. No history can create freedom.
- **Sound design** — audio completes the interaction. Custom sounds timed to match the rhythm of each interaction.

---

## Process: How to Apply These Principles

### Phase 1: Analyze
1. Identify what the user needs to accomplish
2. Map the minimum information/actions needed at each step
3. Identify what can be deferred or hidden until relevant
4. Identify which elements persist across states

### Phase 2: Design the Reveal
1. Start with the simplest possible default state
2. Layer in complexity progressively — one piece of content or one action per step
3. Ensure each step preserves context from the previous one
4. Use compact surfaces (trays, sheets, overlays) instead of full-screen navigation for transient actions

### Phase 3: Design the Flow
1. Every transition should have a direction and purpose
2. Elements that persist should animate continuously (not disappear and reappear)
3. Text changes should morph meaningfully
4. Icons should transform, not swap
5. Data updates should interpolate smoothly

### Phase 4: Place Delight
1. For high-frequency features: keep delight subtle (micro‑animations, satisfying feedback)
2. For low-frequency features: add more expressive delight (confetti, easter eggs, surprises)
3. Ensure no feature feels neglected — consistent polish everywhere
4. Add one unexpected moment that rewards exploration

---

## Code & Implementation Guidelines

### CSS/Animation
- Use `requestAnimationFrame` loops for smooth 60fps updates
- Lerp values toward targets rather than snapping (e.g., `current += (target - current) * 0.08`)
- Prefer `transform` and `opacity` for performant animations
- Use shared layout animations (FLIP) for element continuity
- Avoid `AnimatePresence` crossfades for things that should morph

### Component Design
- Components should do one thing well with minimal required props
- Use sensible defaults — everything beyond the core should be opt-in
- Support `loading`, `empty`, and `paused` states as first-class states
- Use a single `<canvas>` or minimal DOM for performant real-time rendering
- Expose `lerpSpeed` or similar for tuning animation feel

### Icon Systems
- Represent every icon with the same underlying path count (e.g., exactly 3 lines)
- Collapse unused lines to invisible center points with `opacity: 0`
- Group icons by shape for rotation-based transitions
- Use coordinate interpolation for cross-group morphs

---

## References

- [Family Values](https://benji.org/family-values) — Full article on the three core principles
- [Honkish](https://benji.org/honkish) — Real-time messaging design philosophy
- [Morphing Icons with Claude](https://benji.org/morphing-icons-with-claude) — Icon transformation patterns
- [Liveline](https://benji.org/liveline) — Chart component with smooth interpolation
- [Agentation](https://benji.org/agentation) — Visual feedback tool for iterative design
