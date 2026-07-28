# GSAP Animation & Motion Types — Complete Reference

> Comprehensive study of all animation and motion types in GSAP (GreenSock Animation Platform) v3.15+.
> Covers core tweens, timelines, keyframes, staggering, physics, inertia, path-following, scroll-driven, drag-driven, FLIP layout, SVG morphing/stroking, text splitting/typewriting, custom easing, and more.

---

## Table of Contents

1. [Core Tween Animations](#1-core-tween-animations)
2. [Timeline-Based Sequencing](#2-timeline-based-sequencing)
3. [Keyframe Animations](#3-keyframe-animations)
4. [Stagger Animations](#4-stagger-animations)
5. [Easing & Custom Curves](#5-easing--custom-curves)
6. [Scroll-Driven Motion (ScrollTrigger)](#6-scroll-driven-motion-scrolltrigger)
7. [ScrollSmoother](#7-scrollsmoother)
8. [Draggable](#8-draggable)
9. [Physics & Motion Simulation](#9-physics--motion-simulation)
10. [Path-Based Motion (MotionPathPlugin)](#10-path-based-motion-motionpathplugin)
11. [SVG Animations (MorphSVG & DrawSVG)](#11-svg-animations-morphsvg--drawsvg)
12. [FLIP Layout Animations (Flip)](#12-flip-layout-animations-flip)
13. [Text Animations (SplitText & TextPlugin)](#13-text-animations-splittext--textplugin)
14. [Observer Plugin](#14-observer-plugin)
15. [Advanced Control & Performance](#15-advanced-control--performance)
16. [Responsive & Accessible](#16-responsive--accessible)
17. [All Animation-Type Quick Reference](#17-all-animation-type-quick-reference)
18. [Animation Recipes & Patterns](#18-animation-recipes--patterns)
19. [Framework Integration](#19-framework-integration)
20. [Performance & Debugging](#20-performance--debugging)

---

## 1. Core Tween Animations

### Methods

| Method | Signature | What It Does |
|---|---|---|
| **`gsap.to()`** | `gsap.to(target, vars)` | Animate from **current** values → **target** values |
| **`gsap.from()`** | `gsap.from(target, vars)` | Animate from **target** values → **current** values |
| **`gsap.fromTo()`** | `gsap.fromTo(target, fromVars, toVars)` | Explicit **start** + **end** values |
| **`gsap.set()`** | `gsap.set(target, vars)` | Instant (zero-duration) property set |

### Animate-able Properties

- All CSS properties (camelCase): `opacity`, `width`, `height`, `color`, `backgroundColor`, `borderRadius`, etc.
- Transforms: `x`, `y`, `rotation`, `rotationX`, `rotationY`, `scaleX`, `scaleY`, `skewX`, `skewY`, `transformOrigin`
- SVG attributes: `cx`, `cy`, `r`, `fill`, `stroke`, `strokeWidth`, `d` (with MorphSVGPlugin)
- Canvas properties
- Generic object properties (any JS object)
- CSS custom properties
- Colors (hex, rgb, rgba, hsl, hsla, named)
- Complex strings (with string filtering)
- Filters: `blur`, `brightness`, `contrast`, `grayscale`, `hueRotate`, `invert`, `saturate`, `sepia`

### Tween Config (vars object)

```js
gsap.to(".box", {
  // --- Duration & Timing ---
  duration: 1,             // seconds (default: 0.5)
  delay: 0,                // seconds before start
  ease: "power2.out",      // easing function
  repeat: -1,              // -1 = infinite
  repeatDelay: 0,          // delay between repeats
  yoyo: true,              // reverse on each repeat
  yoyoEase: true,          // easing for yoyo direction (true = same ease reversed)

  // --- Values ---
  x: 100,                  // px translation
  y: "+=50",               // relative to current
  opacity: 0.5,
  scale: 1.5,

  // --- Stagger (multiple targets) ---
  stagger: 0.1,            // delay between each target's start

  // --- Overwrite ---
  overwrite: "auto",       // automatically resolve conflicts

  // --- Immediate Render ---
  immediateRender: false,  // render start values immediately (default: false for to(), true for from()/set())

  // --- Callbacks ---
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onRepeat: () => {},
  onReverseComplete: () => {},

  // --- Data ---
  data: { myData: "anything" },  // arbitrary data attached to the tween

  // --- Keyframes (inline) ---
  keyframes: [{ x: 100 }, { y: 200 }],

  // --- Functional values ---
  x: (index, target, targets) => index * 50,
})
```

### Special Properties

| Property | Description |
|---|---|
| `duration` | Animation length in seconds (default: 0.5) |
| `delay` | Seconds to wait before starting |
| `ease` | Easing function: `"power2.out"`, `"elastic.inOut"`, `"none"`, etc. |
| `repeat` | Number of repeats (-1 = infinite) |
| `repeatDelay` | Seconds between repeats |
| `yoyo` | Boolean — reverse animation on each repeat |
| `yoyoEase` | Ease for yoyo direction. `true` mirrors the ease, or pass a string |
| `stagger` | Delay between animated targets (can be object for advanced config) |
| `overwrite` | `"auto"` (default), `true`, `"none"`, `"all"`, `"existingOnly"` |
| `immediateRender` | Render start values immediately. `true` for `from()`/`set()`, `false` for `to()` |
| `callbackScope` | `this` context for callbacks |
| `data` | Attach arbitrary data to the animation |
| `paused` | Start paused |
| `reversed` | Start reversed |
| `keyframes` | Array of keyframe objects |

---

## 2. Timeline-Based Sequencing

### Creating a Timeline

```js
const tl = gsap.timeline({
  // --- Timeline Config ---
  duration: 1,              // total duration (auto-calculated if omitted)
  delay: 0,
  ease: "power2.out",       // default ease for child tweens
  paused: false,
  reversed: false,
  repeat: -1,
  repeatDelay: 0,
  yoyo: true,
  smoothChildTiming: true,  // true = adjust child timing when tween changes
  autoRemoveChildren: false, // true = remove completed children (memory saver)
  align: "normal",          // "normal", "sequence", or "start"
  stagger: 0,               // stagger between all children

  // --- Defaults for children ---
  defaults: {
    duration: 1,
    ease: "power2.out",
  },

  // --- Callbacks ---
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onRepeat: () => {},
  onReverseComplete: () => {},
})
```

### Adding Tweens (Position Parameter)

```js
tl.to(".box", { x: 100 })                 // appends at end
tl.to(".box", { x: 200 }, 1)              // insert at exactly 1 second
tl.to(".box", { x: 300 }, "+=0.5")        // 0.5s after end of timeline
tl.to(".box", { x: 400 }, "-=0.25")       // 0.25s before end
tl.to(".box", { x: 500 }, "<")            // start of previous animation
tl.to(".box", { x: 600 }, ">")            // end of previous animation
tl.to(".box", { x: 700 }, "<50%")         // 50% through previous
tl.to(".box", { x: 800 }, "-=25%")        // 25% before previous end
tl.to(".box", { x: 900 }, "myLabel")      // at label position
tl.to(".box", { x: 1000 }, "myLabel+=0.5") // 0.5s after label
```

### Label Methods

```js
tl.addLabel("myLabel", 2)          // add label at 2 seconds
tl.addLabel("myLabel", ">")        // add label at end of previous
tl.addLabel("myLabel")             // add label at end (last child's end time)
tl.getLabelTime("myLabel")         // get time position of label → Number
tl.removeLabel("myLabel")
tl.labels                             // Object of labelName → time
tl.addPause("myLabel")             // add a pause at label
```

### Timeline Methods

```js
tl.to(target, vars, position)      // add tween
tl.from(target, vars, position)
tl.fromTo(target, fromVars, toVars, position)
tl.set(target, vars, position)     // add zero-duration set

tl.call(func, params, position)    // add function call
tl.add(timelineOrTween, position)  // add child animation
tl.addLabel(label, position)

tl.seek(time)                      // jump to time (preserves reversed state)
tl.time(time)                      // set time (ignores reversed)
tl.progress(value)                 // set progress 0-1
tl.totalProgress(value)
tl.duration(value)                 // get/set total duration
tl.totalDuration(value)

tl.play() / .pause() / .resume() / .reverse()
tl.restart(includeDelay)
tl.revert()                        // revert all properties

tl.clear()                         // remove all children
tl.kill()                          // kill, remove from parent
tl.getChildren()                   // Array of child animations
tl.getTweensOf(target)             // Array of tweens for a target
tl.shiftChildren(amount, adjustLabels)
```

### Timeline Events

```js
tl.eventCallback("onStart", func)
tl.eventCallback("onComplete", func)
tl.eventCallback("onUpdate", func)
tl.eventCallback("onRepeat", func)
tl.eventCallback("onReverseComplete", func)

// Remove callback:
tl.eventCallback("onComplete", null)
```

---

## 3. Keyframe Animations

### 3a. Object Array Syntax (most common)

```js
gsap.to(".box", {
  keyframes: [
    { x: 100, duration: 1, ease: "power2.out" },
    { y: 200, duration: 0.5, ease: "bounce.out" },
    { opacity: 0, duration: 0.3 },
  ],
  ease: "none",      // overall ease applied between keyframes (default: "none")
})
```

### 3b. Percentage Syntax

```js
gsap.to(".box", {
  keyframes: {
    "0%":   { x: 0, y: 0 },
    "25%":  { x: 100, y: 50 },
    "50%":  { x: 200, y: 0, transform: "scale(1.5)" },
    "75%":  { x: 100, y: -50 },
    "100%": { x: 0, y: 0, clearProps: "transform" },
  },
  easeEach: "power1.inOut",  // ease between each keyframe
  duration: 3,
})
```

### 3c. Array-Based Per-Property Syntax

```js
gsap.to(".box", {
  keyframes: {
    x: [0, 100, 200, 0],        // sequence of x values
    y: [0, 50, 0, 100],
    easeEach: "sine.inOut",     // ease applied between each step
  },
  duration: 3,
})
```

### 3d. Keyframe Config Properties

| Property | Description |
|---|---|
| `easeEach` | Ease applied **between** each consecutive keyframe (inside the sequence) |
| `ease` (on parent tween) | Overall ease for the entire keyframe sequence (default: `"none"`) |
| `duration` | Total duration of all keyframes |
| `stagger` | Stagger between multiple targets, each running their own keyframes |
| `delay` | Delay before starting the keyframe sequence |

Each individual keyframe object can have its own: `duration`, `ease`, `delay`, `onComplete`, etc.

---

## 4. Stagger Animations

### Simple Stagger

```js
gsap.to(".box", {
  x: 100,
  stagger: 0.1,        // 0.1s delay between each element's start
})
```

### Advanced Stagger Object

```js
gsap.to(".box", {
  x: 100,
  stagger: {
    each: 0.1,              // delay between each element (seconds)
    from: "center",         // starting point: "start", "center", "edges", "end", "random"
    axis: "x",              // restrict stagger to one axis ("x" or "y")
    ease: "power2.inOut",   // ease the stagger timing curve
    amount: 0,              // total stagger time (overrides `each`)
    grid: 4,                // auto-columns if using "center"/"edges" (number or [cols, rows])
  },
})
```

### Stagger `from` Options

| Value | Description |
|---|---|
| `"start"` | From the first element |
| `"center"` | From the center element outward |
| `"edges"` | From the edges inward |
| `"end"` | From the last element backward |
| `"random"` | Random order |
| `0` (number) | Index position (e.g. `5`) |

### Grid Stagger

```js
gsap.to(".box", {
  x: 100,
  stagger: {
    grid: "auto",          // auto-detect columns
    // grid: [4, 3],       // or explicit [cols, rows]
    from: "center",        // ripple from center of grid
    each: 0.1,
  },
})
```

### Function-Based Stagger

```js
gsap.to(".box", {
  x: 100,
  stagger: (index, target, targets) => {
    return Math.abs(index - 3) * 0.1;  // custom delay per element
  },
})
```

### Stagger on Timelines

```js
gsap.timeline({ stagger: 0.1 })
  .to(".box", { x: 100 })
  .to(".box", { y: 200 })
  .to(".box", { opacity: 0 })

// Stagger between child timeline units:
gsap.timeline({ stagger: { each: 0.2, from: "end" } })
```

---

## 5. Easing & Custom Curves

### Core Eases

| Ease String | Curve Shape |
|---|---|
| `"none"`, `"linear"` | Linear |
| `"power1.out"` | Gentle deceleration |
| `"power2.out"` | Moderate deceleration (good default) |
| `"power3.out"` | Strong deceleration |
| `"power4.out"` | Very strong deceleration |
| `"power1.in"` | Gentle acceleration |
| `"power2.in"` | Moderate acceleration |
| `"power3.in"` | Strong acceleration |
| `"power4.in"` | Extreme acceleration |
| `"power1.inOut"` | Gentle ease-in-out |
| `"power2.inOut"` | Moderate ease-in-out |
| `"power3.inOut"` | Strong ease-in-out |
| `"power4.inOut"` | Extreme ease-in-out (s-curve) |

### Expressive Eases

| Ease String | Description |
|---|---|
| `"back.in"`, `"back.out"`, `"back.inOut"` | Overshoots slightly past target then settles |
| `"elastic.in"`, `"elastic.out"`, `"elastic.inOut"` | Bouncy spring oscillation |
| `"bounce.in"`, `"bounce.out"`, `"bounce.inOut"` | Ball-bouncing effect |
| `"circ.in"`, `"circ.out"`, `"circ.inOut"` | Circular (smooth velocity curve) |
| `"expo.in"`, `"expo.out"`, `"expo.inOut"` | Exponential (very steep curve) |
| `"sine.in"`, `"sine.out"`, `"sine.inOut"` | Sinusoidal (smooth, gentle) |
| `"steps(n)"` | Step function (e.g. `"steps(12)"` for 12 discrete steps) |
| `"none"`, `"linear"` | No easing (linear) |

### Club GSAP Custom Eases

| Plugin | Description |
|---|---|
| **CustomEase** | Draw any bezier curve. `CustomEase.create("myEase", "M0,0 C0.25,0.1 0.25,1 1,1")` |
| **CustomWiggle** | Create a wiggle ease. `gsap.to(el, { duration: 2, ease: "wiggle" })` |
| **CustomBounce** | Create a bounce ease. `gsap.to(el, { duration: 1, ease: "bounce" })` |
| **RoughEase** | Add jitter/noise. `gsap.to(el, { duration: 2, ease: "roughEase" })` |
| **SlowMo** | Slow-mid/fast edges ease. `gsap.to(el, { duration: 2, ease: "slowMo" })` |
| **ExpoScaleEase** | Exponential scale for large numeric ranges |

### Directional Ease (v3.15+)

```js
gsap.to(el, {
  x: 500,
  ease: "power2.out",
  easeReverse: true,   // different easing when playhead reverses
})
```

---

## 6. Scroll-Driven Motion (ScrollTrigger)

### Minimal Usage

```js
gsap.to(".box", {
  scrollTrigger: ".box",  // shorthand for trigger
  x: 500,
})
```

### Full Config Object

```js
gsap.to(".box", {
  scrollTrigger: {
    trigger: ".box",           // Element to track
    start: "top center",       // when trigger's top hits scroller's center
    end: "bottom 100px",       // when trigger's bottom hits 100px from scroller top
    endTrigger: "#other",      // different element for end calc (default: trigger)
    scroller: window,          // scrollable element (default: viewport)
    horizontal: false,         // horizontal scroll mode

    // Scrubbing
    scrub: true,               // direct link to scrollbar progress
    // scrub: 0.5,             // 0.5s smooth catch-up

    // Pinning
    pin: true,                 // pin trigger element
    // pin: ".myPin",          // or pin a specific element
    pinSpacing: true,          // auto-padding to push content (default: true, false on flex)
    pinSpacing: "margin",      // use margin instead of padding
    pinType: "fixed",          // "fixed" or "transform"
    pinReparent: false,        // reparent to body during pin (fixes position:fixed breakage)
    pinnedContainer: "#parent", // parent that pins too (rare)
    anticipatePin: 0,          // apply pin early (try 1 to avoid flash)

    // Snapping
    snap: {
      snapTo: "labels",        // "labels", "labelsDirectional", Number, Array, or Function
      delay: 0.1,             // delay before snap (seconds)
      directional: true,      // snap toward scroll direction
      duration: { min: 0.2, max: 3 },  // duration range based on velocity
      ease: "power3",         // snap ease
      inertia: true,          // factor scroll inertia
      onStart, onInterrupt, onComplete  // callbacks
    },

    // Toggle Actions
    toggleActions: "play pause resume reset",
    // Keywords: "play", "pause", "resume", "reset", "restart", "complete", "reverse", "none"
    // Order: onEnter, onLeave, onEnterBack, onLeaveBack

    // Toggle Class
    toggleClass: "active",
    toggleClass: { targets: ".my-selector", className: "active" },

    // Markers (development only)
    markers: true,
    markers: { startColor: "green", endColor: "red", fontSize: "16px", indent: 20 },

    // Fast scroll
    fastScrollEnd: true,       // force completion if scrolled past quickly
    fastScrollEnd: 2500,       // velocity threshold px/s

    // Overlap prevention
    preventOverlaps: true,     // force preceding ST animations to complete
    preventOverlaps: "group1", // group name

    // Advanced
    id: "uniqueId",            // for getById()
    once: false,               // kill after one activation
    invalidateOnRefresh: false, // invalidate animation on refresh
    refreshPriority: 0,        // higher = earlier refresh
    containerAnimation: horizontalTween, // for horizontal sections via vertical scroll

    // Callbacks
    onEnter: (self) => {},
    onLeave: (self) => {},
    onEnterBack: (self) => {},
    onLeaveBack: (self) => {},
    onToggle: (self) => {},         // isActive changed
    onUpdate: (self) => {},         // progress changed
    onScrubComplete: (self) => {},  // numeric scrub finished
    onSnapComplete: (self) => {},   // snap finished
    onRefresh: (self) => {},        // resize recalculation
  },
})
```

### Start/End Position Syntax

```
"top top"         → trigger top hits viewport top
"top center"      → trigger top hits viewport center
"top bottom"      → trigger top hits viewport bottom (default start)
"bottom top"      → trigger bottom hits viewport top (default end)
"center center"   → trigger center hits viewport center
"top 80%"         → trigger top hits 80% down viewport
"top-=100 center" → 100px above trigger's top hits viewport center
"bottom +=200"    → 200px beyond the bottom of the trigger
"max"             → maximum scroll position
"clamp(top bottom)" → v3.12+: clamp calculated value between 0 and max scroll
```

### ScrollTrigger.create() (Standalone)

```js
const st = ScrollTrigger.create({
  trigger: "#id",
  start: "top top",
  end: "bottom top",
  onEnter: () => console.log("entered"),
  onLeave: () => console.log("left"),
})
```

### Using ScrollTrigger on a Timeline

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    start: "top top",
    end: "+=1000",
    scrub: 1,
    snap: { snapTo: "labels", duration: { min: 0.2, max: 3 } },
  },
})

tl.addLabel("a")
  .to(".el1", { x: 200 })
  .addLabel("b")
  .to(".el2", { opacity: 0 })
  .addLabel("c")
```

### ScrollTrigger Static Methods

```js
ScrollTrigger.create(vars)              // Create standalone instance
ScrollTrigger.getAll()                  // Array of all instances
ScrollTrigger.getById(id)               // Find instance by id
ScrollTrigger.batch(triggers, vars)     // Coordinated group
ScrollTrigger.defaults(config)          // Set global defaults
ScrollTrigger.config({ limitCallbacks: true })  // Global config
ScrollTrigger.refresh(safe)             // Recalculate all positions
ScrollTrigger.saveStyles(targets)       // Record inline styles for revert
ScrollTrigger.scrollerProxy(scroller, vars)  // Hijack scroll getters/setters
ScrollTrigger.normalizeScroll(true)     // Force JS-thread scrolling
ScrollTrigger.observe(config)           // Unified input observer
ScrollTrigger.maxScroll(element, horiz) // Max scroll value
ScrollTrigger.isInViewport(el, prop, horiz)  // Viewport check
ScrollTrigger.killAll()                 // Kill all ST instances
ScrollTrigger.addEventListener(type, cb)     // Global "scrollStart", "scrollEnd", etc.
ScrollTrigger.removeEventListener(type, cb)
ScrollTrigger.sort(fn)                  // Sort refresh order
ScrollTrigger.clearMatchMedia(query)
ScrollTrigger.clearScrollMemory()
ScrollTrigger.positionInViewport(el, ref, horiz)  // 0-1 position
ScrollTrigger.snapDirectional(incOrArr)  // Directional snap function
ScrollTrigger.update()                  // Force update all ST
```

### ScrollTrigger Instance Methods

```js
st.disable(revert, allowAnimation)  // Disable, unpin, restore DOM
st.enable(reset)                    // Re-enable
st.kill(revert, allowAnimation)     // Destroy, remove listeners
st.refresh()                        // Recalculate start/end
st.scroll(position)                 // Get/set scroll position (Number)
st.getVelocity()                    // Scroll velocity px/s → Number
st.getTween(snap)                   // Get scrub tween (or snap tween via true)
st.labelToScroll(label)             // Timeline label → scroll position
st.next()                           // Next ST in refresh order
st.previous()                       // Previous ST in refresh order
```

### ScrollTrigger Instance Properties

```js
st.animation     // Tween | Timeline | undefined
st.direction     // 1 = forward, -1 = backward
st.end           // End scroll position (Number px)
st.isActive      // Boolean
st.pin           // Pinned element
st.progress      // 0-1 progress
st.scroller      // Element | window
st.start         // Start scroll position (Number px)
st.trigger       // Trigger element
st.vars          // Config object
ScrollTrigger.isTouch  // 0 = no touch, 1 = touch-only, 2 = both
```

---

## 7. ScrollSmoother

### Basic Setup

```js
ScrollSmoother.create({
  content: "#content",        // wrapper for all scrollable content
  wrapper: "#wrapper",        // outer wrapper
  smooth: 1,                 // smoothing time in seconds (1 = 1 second to catch up)
  effects: true,              // enable speed effects via data-speed attribute
  normalizeScroll: true,      // normalize scroll on mobile
})
```

### Speed & Effects

```html
<div data-speed="0.5">...<div>  <!-- moves slower than scroll (parallax) -->
<div data-speed="2">...<div>   <!-- moves faster than scroll -->
<div data-lag="0.5">...<div>   <!-- lags behind scroll -->
```

### Features

- Built on native scroll (not scroll-jacking)
- Smooths wheel/touch/trackpad input
- Integrates with ScrollTrigger seamlessly (no manual proxies)
- `effects: true` enables `data-speed` and `data-lag` attributes for parallax
- `normalizeScroll: true` fixes mobile address bar and cross-browser inconsistencies
- Spacebar, PageUp/Down, Home/End all work naturally

---

## 8. Draggable

### Basic Usage

```js
Draggable.create("#id", {
  type: "x,y",         // "x,y", "left,top", "rotation", "x", "y", "top", "left"
  bounds: "#container",// or {top, left, width, height} or {minX, maxX, minY, maxY}
  inertia: true,       // enable momentum (requires InertiaPlugin)
})
```

### Full Config

```js
Draggable.create("#id", {
  // Type & Bounds
  type: "x,y",                  // "x,y", "left,top", "rotation", "x", "y", "top", "left"
  bounds: "#container",          // Element, selector, or coordinate object
  trigger: "#handle",            // Child element that initiates drag

  // Inertia / Throw
  inertia: true,                 // Boolean or advanced object
  // Inertia sub-properties:
  //   snap: fn | array | object
  //   throwResistance: 1000     (higher = faster stop)
  //   maxDuration: 10
  //   minDuration: 0.2
  //   overshootTolerance: 1
  //   onThrowUpdate: fn
  //   onThrowComplete: fn

  // Snapping
  snap: fn | array | object,     // snap after release
  liveSnap: fn | bool | array | object,  // snap while dragging

  // Axis control
  lockAxis: true,                // lock to dominant axis after initial movement
  minimumMovement: 2,            // px threshold before drag starts

  // Resistance
  dragResistance: 0,             // 0-1 constant resistance
  edgeResistance: 0,             // 0-1 resistance beyond bounds

  // Scrolling
  autoScroll: 1,                 // 0 = off, 1+ = speed multiplier

  // Visual
  cursor: "move",                // hover cursor
  activeCursor: "grabbing",      // cursor while dragging
  force3D: true,                 // GPU-accelerated transforms
  zIndexBoost: true,             // auto-boost zIndex on press
  allowContextMenu: false,
  allowEventDefault: false,
  allowNativeTouchScrolling: true,

  // Clickable elements
  dragClickables: true,
  clickableTest: (el) => true | false,

  // Scope
  callbackScope: myObj,

  // Callbacks
  onPress: (event) => {},
  onPressInit: () => {},          // before press values recorded
  onDragStart: (event) => {},
  onDrag: (event) => {},          // once per rAF
  onMove: (event) => {},          // can fire multiple times per rAF
  onDragEnd: (event) => {},
  onRelease: (event) => {},       // always fires (even if no drag)
  onClick: (event) => {},         // press+release with <3px movement
  onLockAxis: (event) => {},

  // Callback params (arrays of extra args)
  onClickParams: ["clicked"],
  onDragParams: ["dragged"],
  onDragStartParams: [],
  onDragEndParams: [],
  onPressParams: [],
  onReleaseParams: [],
})
```

### Snap / LiveSnap Forms

```js
// Simple function
snap: (value) => Math.round(value / 50) * 50

// Array
liveSnap: [0, 100, 200, 300]

// Per-property
snap: { x: [0, 100, 200], y: [0, 50, 100] }

// Points + radius (2D proximity snap)
liveSnap: {
  points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 50 }],
  radius: 15,
}

// Custom points function
liveSnap: {
  points: function(point) {
    if (Math.hypot(point.x - 500, point.y - 250) < 100) {
      return { x: 500, y: 250 }
    }
    return point
  }
}

// Boolean — reuses snap config live
liveSnap: true
```

### Instance Methods

```js
draggable.disable()                  // Disable dragging
draggable.enable()                   // Enable dragging
draggable.enabled(value)             // Get/set enabled state
draggable.kill()                     // Destroy, remove from lookup
draggable.applyBounds(bounds)        // Apply new bounds dynamically
draggable.startDrag(event, align)    // Programmatically start drag
draggable.endDrag(event)             // Programmatically end drag
draggable.update(applyBounds, sticky)  // Sync x/y with current position
draggable.getDirection(from)         // "right", "left", "up", "down", etc.
draggable.addEventListener(type, cb) // Event listener
```

### Static Methods

```js
Draggable.create(target, vars)           // → Array of instances
Draggable.get(target)                    // Get instance for DOM element → Draggable
Draggable.hitTest(testObj, threshold)    // Overlap test → Boolean
Draggable.timeSinceDrag()                // Seconds since last drag ended → Number
```

### Instance Properties

```js
draggable.x, draggable.y            // Current position (read-only)
draggable.rotation                  // Current rotation
draggable.deltaX, draggable.deltaY  // Change since last event
draggable.isPressed                 // Boolean
draggable.isThrowing                // Boolean (inertia tweeting)
draggable.tween                     // Inertia tween (read-only)
draggable.target                    // DOM element
draggable.pointerX, draggable.pointerY  // Pointer position
draggable.startX, draggable.startY      // Start of current drag
draggable.endX, draggable.endY, draggable.endRotation  // Predicted end after inertia
draggable.minX, draggable.maxX, draggable.minY, draggable.maxY  // Bounds
draggable.minRotation, draggable.maxRotation
draggable.lockAxis, draggable.lockedAxis
draggable.autoScroll
draggable.vars                     // Config object
Draggable.zIndex                   // Static default z-index on press
```

---

## 9. Physics & Motion Simulation

### Physics2DPlugin (Club GSAP)

2D projectile/trajectory motion. No end value — physics drives it.

```js
gsap.to(".ball", {
  physics2D: {
    velocity: 500,           // initial speed (px/s)
    angle: 45,               // launch angle in degrees
    gravity: 300,            // downward acceleration (always positive value)
    acceleration: 0,         // additional acceleration in `accelerationAngle` direction
    accelerationAngle: 0,    // angle for acceleration
    friction: 0,             // drag coefficient (0 = no friction)
  },
  duration: 3,               // how long physics runs
})
```

### PhysicsPropsPlugin (Club GSAP)

Physics-based animation on **any** individual CSS/object property.

```js
gsap.to(".box", {
  physicsProps: {
    x: { velocity: 200, acceleration: 50, friction: 0.1 },
    y: { velocity: -100, acceleration: -200, friction: 0.05 },
    rotation: { velocity: 180, friction: 0.3 },
  },
  duration: 2,
})
```

Per-property config:

```js
velocity: Number            // initial velocity (units/s)
acceleration: Number        // constant acceleration (units/s²)
friction: Number            // drag coefficient (0 = none, higher = more drag)
```

### InertiaPlugin (Club GSAP)

Momentum-based deceleration with snapping. Often paired with Draggable.

```js
gsap.to(el, {
  inertia: {
    x: {
      velocity: 500,              // initial velocity (auto-tracked by Draggable)
      min: 0,                     // minimum bound
      max: 1000,                  // maximum bound
      end: [0, 200, 400, 600],    // snap-to values (array) or function
      resistance: 1000,           // deceleration amount (higher = faster stop)
    },
  },
  ease: "power3.out",             // ease (Inertia uses its own easing)
  duration: 2,                    // or let Inertia auto-calculate
})

// Track velocity manually:
InertiaPlugin.track(el, "x,y")

// Get tracked velocity:
InertiaPlugin.getVelocity(el, "x")  // → Number (px/s)
InertiaPlugin.getVelocity(el, "rotation")

// Stop tracking:
InertiaPlugin.untrack(el, "x")
```

Inertia config per-property:

```js
velocity: Number            // initial velocity
min: Number                 // minimum bound
max: Number                 // maximum bound
end: Number | Array | Function  // end value, snap array, or function returning value
resistance: Number          // deceleration (default system-determined)
overshootTolerance: Number  // how much overshooting allowed (default 1, 0 = none)
```

---

## 10. Path-Based Motion (MotionPathPlugin)

### Along SVG Path

```js
gsap.to(".car", {
  motionPath: {
    path: "#path",               // SVG <path> element, path data string, or point array
    align: "#path",              // align element to path orientation
    autoRotate: true,            // automatically rotate element to follow path
    alignOrigin: [0.5, 0.5],    // alignment origin [x, y] (default: center)
    start: 0,                    // start position on path (0-1)
    end: 1,                      // end position on path (0-1)
    offsetX: 0,                  // offset from path horizontally
    offsetY: 0,                  // offset from path vertically
    fromCurrent: false,          // start from element's current position
    relative: false,             // treat values as relative
    curviness: 1,                // 0 = straight lines, 2 = more curved, etc.
    type: "cubic",               // "cubic" or "thru" (interpolation type)
  },
  duration: 3,
  ease: "power1.inOut",
})
```

### Path Data String

```js
motionPath: {
  path: "M0,0 C100,50 200,50 300,0",  // raw SVG path data
}
```

### Point Array

```js
motionPath: {
  path: [
    { x: 0, y: 0 },
    { x: 100, y: 200 },
    { x: 300, y: 50 },
    { x: 400, y: 0 },
  ],
}
```

### MotionPathHelper (Club GSAP)

Interactive in-browser editor for designing MotionPath animations. Drag control points on screen.

```js
// In browser dev tools:
MotionPathHelper.create(".box", { path: "#path" })
```

---

## 11. SVG Animations (MorphSVG & DrawSVG)

### DrawSVGPlugin (Club GSAP)

Animates the stroke of an SVG shape (reveal/hide).

```js
gsap.fromTo("path", {
  drawSVG: "0%",         // stroke hidden (0% length)
}, {
  drawSVG: "100%",       // stroke fully drawn
  duration: 2,
  ease: "power2.out",
})

// Partial values:
drawSVG: "50%"           // only show second half
drawSVG: "0% 50%"        // show first half only
drawSVG: true            // shorthand for "0% 100%"
gsap.set("path", { drawSVG: 0 })  // immediately hide stroke

// Multiple strokes in one tween:
gsap.to(".stroke-group path", {
  drawSVG: "100%",
  stagger: 0.1,
  duration: 1.5,
})
```

### MorphSVGPlugin (Club GSAP)

Morph one SVG shape into another.

```js
gsap.to("path", {
  morphSVG: "#otherPath",       // target path element or path data
  duration: 2,
  ease: "power2.inOut",
})

// With shape index for complex paths:
gsap.to("path", {
  morphSVG: { shape: "#targetPath", shapeIndex: 8 },
  duration: 2,
})

// Better results with render:
morphSVG: { shape: "#targetPath", map: "complex" }  // "complex", "logical", "exact"
```

**Note:** GSAP has built-in support for animating `"d"` (path data) attribute directly on `path` elements, but MorphSVGPlugin is recommended for complex morphs because it handles mismatched point counts.

---

## 12. FLIP Layout Animations (Flip)

### Core Workflow

```js
// Step 1: Capture current state
const state = Flip.getState(".targets" /*, { props: "backgroundColor,color" } */);

// Step 2: Make any DOM/styling changes
element.classList.toggle("full-screen");
// Or any DOM mutations...

// Step 3: Animate from old state to new state
Flip.from(state, {
  duration: 1,
  ease: "power1.inOut",
  absolute: true,        // use position:absolute during flip
}).play();
```

### Config Properties

```js
Flip.from(state, {
  duration: 1,
  ease: "power1.inOut",

  // Flip mode
  absolute: true,                 // use position:absolute (for flex/grid layouts)
  absolute: ".box",               // scope to subset
  absoluteOnLeave: true,          // absolute on leaving elements
  scale: true,                    // use scaleX/Y instead of width/height
  spin: true,                     // spin 360° during flip
  spin: -1,                       // spin -360°
  spin: (index, target) => index % 2 === 0 ? 1 : -1,  // per-target spin

  // Nesting / complexity
  nested: true,                   // compensate for nested flip targets
  simple: false,                  // skip rotation/scale/skew calc (faster)
  prune: true,                    // remove non-animating targets

  // Extra properties
  props: "backgroundColor,color", // comma-delimited extra CSS props
  targets: ".subset",             // scope to subset of state targets
  toggleClass: "flipping",        // class during flip
  zIndex: 100,                    // z-index during flip
  fade: true,                     // cross-fade when swapping elements

  // Enter/Leave callbacks
  onEnter: (elements) => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1 }),
  onLeave: (elements) => gsap.to(elements, { opacity: 0 }),

  // Standard GSAP tween props
  onComplete, onUpdate, repeat, yoyo, stagger, ...
})
```

### Flip Between Different Elements (Swap)

```html
<div data-flip-id="card">Old</div>
<!-- becomes... -->
<div data-flip-id="card">New</div>
```

```js
Flip.from(state, {
  fade: true,
  absolute: true,  // required for cross-fade swaps
})
```

### Static Methods

```js
Flip.getState(targets, vars)          // Capture current state → FlipState
Flip.from(state, vars)                // Animate FROM state TO current → Timeline
Flip.to(state, vars)                  // Animate TO state FROM current → Timeline
Flip.fit(targetDest, targetOrState, vars)  // Resize/reposition to fit another
Flip.batch(id)                        // Create coordinated multi-flip batch
Flip.isFlipping(target)               // Check if target is flipping → Boolean
Flip.killFlipsOf(targets, complete)   // Kill active flips
Flip.makeAbsolute(targets)            // Set position:absolute retaining position
```

### Batching (for React/Vue/Angular)

```js
const batch = Flip.batch("myBatch")
batch.getState(".targets")           // capture BEFORE any mutations
// ... make all DOM changes (across components) ...
batch.run()                          // runs all flips together
// batch.getState(true) — re-captures state with getState()

// In React (useLayoutEffect):
useLayoutEffect(() => {
  batch.getState(true)
  // change state...
  batch.run(true)
}, [deps])
```

### Framework Gotcha

```js
// BAD — frameworks create NEW element instances
Flip.from(state, { duration: 1 })

// GOOD — explicitly tell Flip which targets to animate
Flip.from(state, {
  targets: ".your-class",
  duration: 1,
})
```

Also use `data-flip-id` to correlate old/new elements after re-render.

---

## 13. Text Animations (SplitText & TextPlugin)

### SplitText (Club GSAP)

Split text into characters, words, and/or lines for per-segment staggering.

```js
const split = new SplitText(".target", {
  type: "chars,words,lines",   // what to split into
  charsClass: "my-char",       // CSS class for each char
  wordsClass: "my-word",       // CSS class for each word
  linesClass: "my-line",       // CSS class for each line
  lineThreshold: 0,            // tolerance for line detection
})

// GSAP retains original DOM — revert with:
split.revert()

// Common animation pattern:
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  rotateX: -90,
  stagger: 0.02,
  duration: 0.5,
})

// Clean up: always revert in SPA/frameworks
split.revert()
```

### Split Properties

```js
split.chars    // Array of character elements
split.words    // Array of word elements
split.lines    // Array of line elements
split.lines   // Each line also has: .textContent, .innerHTML
```

### TextPlugin

Typewriter effect — replaces text character by character.

```js
gsap.to(".text", {
  text: "Hello world! This is typewriter text.",
  duration: 3,
  ease: "none",               // linear by character
  delay: 0,
})

// Values:
text: "New text"              // type in
text: ""                      // type out (erase)
text: { value: "Hi", delimiter: "" }  // custom delimiter

// Existing text cleared first, then new text typed.
```

---

## 14. Observer Plugin

Unified input abstraction for wheel, touch, pointer, and scroll — with velocity tracking.

```js
Observer.create({
  target: window,              // element to observe (default: window)
  type: "wheel,touch,pointer", // comma-delimited event types to listen for
  onUp: (self) => {},
  onDown: (self) => {},
  onLeft: (self) => {},
  onRight: (self) => {},
  onWheel: (self) => {},
  onDrag: (self) => {},
  onPress: (self) => {},
  onRelease: (self) => {},
  onHover: (self) => {},
  onMove: (self) => {},
  onStop: (self) => {},
  onChange: (self) => {},       // direction changed or velocity crossed threshold
  onLock: (self) => {},         // axis locked
  tolerance: 10,                // min distance before firing (px)
  debounce: 100,                // fire at most once per N ms (for scroll events)
  minimumMovement: 1,           // px before firing directional events
  preventDefault: false,        // call preventDefault on events
  capture: false,               // use capture phase
  passive: true,                // use passive listeners
  allowContextMenu: false,
})

// Self properties inside callbacks:
self.deltaX, self.deltaY       // change since last event
self.velocityX, self.velocityY // velocity (px/s)
self.direction                 // 1 = forward, -1 = backward
self.axis                      // "x" or "y"
self.isDragging
self.event                     // the original event
self.target                    // observed element
```

---

## 15. Advanced Control & Performance

### TimeScale

```js
anim.timeScale(2)              // 2× speed (fast-forward)
anim.timeScale(0.5)            // half speed (slow-motion)
anim.timeScale()               // get current timeScale → Number
tl.timeScale(2)                // timeline also works
```

### Seek / Progress

```js
anim.seek(2)                   // jump to 2 seconds (preserves reversed)
anim.time(2)                   // jump to 2 seconds (ignores reversed)
anim.progress(0.5)             // jump to 50% (0-1)
anim.totalProgress(0.75)       // jump to 75% including repeats
```

### Play / Pause / Reverse / Restart

```js
anim.play()
anim.pause()
anim.resume()
anim.reverse()
anim.restart(includeDelay)
```

### Modifiers

Intercept property values mid-animation.

```js
gsap.to(".gear", {
  rotation: 360,
  modifiers: {
    rotation: (value, target) => {
      // Keep value in 0-360 range for a smooth loop
      return parseFloat(value) % 360
    },
    x: (value, target) => {
      return Math.round(value)  // remove sub-pixel
    },
  },
  duration: 2,
  repeat: -1,
  ease: "none",
})
```

### RepeatRefresh

Re-evaluate dynamic values on each repeat.

```js
gsap.to(el, {
  x: () => Math.random() * 500,   // dynamic value
  repeat: 3,
  repeatRefresh: true,             // re-calc random value each repeat
})
```

### Function-Based Values

```js
gsap.to(".box", {
  x: (index, target, targets) => index * 50,
  backgroundColor: (i, t, ts) => ["red","green","blue"][i % 3],
  delay: (i) => i * 0.2,
})
```

### Random Values

```js
x: "random(-100, 100)"           // random between -100 and 100
x: "random(-100, 100, 5)"       // random in increments of 5
color: "random([red, blue, green])"  // random from array
x: "random([10, 50, 100])"       // random from array
```

### Relative Values

```js
x: "+=50"         // 50px more than current
x: "-=20"         // 20px less than current
rotation: "+=360" // 360° more than current
```

### QuickTo / QuickSetter

Hyper-optimized for frequent updates (mouse tracking, etc).

```js
const setX = gsap.quickTo(".box", "x", { duration: 0.3, ease: "power3.out" })
const setY = gsap.quickTo(".box", "y", { duration: 0.3, ease: "power3.out" })

window.addEventListener("mousemove", (e) => {
  setX(e.clientX)
  setY(e.clientY)
})

// QuickSetter for properties without animation:
const setOpacity = gsap.quickSetter(".box", "opacity")
window.addEventListener("mousemove", (e) => {
  setOpacity(e.clientX / window.innerWidth)
})
```

### GSAP Ticker

```js
gsap.ticker.add(() => {
  // runs on every frame
})
gsap.ticker.add(myFunc)
gsap.ticker.remove(myFunc)

gsap.ticker.lagSmoothing(0)  // disable lag smoothing
gsap.ticker.fps(30)          // cap to 30fps
```

### Global Control

```js
gsap.globalTimeline.timeScale(0.5)  // slow down ALL animations
gsap.globalTimeline.pause()         // pause ALL animations
```

---

## 16. Responsive & Accessible

### gsap.matchMedia()

Define animations per breakpoint. Automatically reverts on resize.

```js
const mm = gsap.matchMedia()

mm.add("(min-width: 800px)", () => {
  // Desktop animations — runs when entering matching breakpoint
  gsap.to(".box", { x: 500, duration: 2 })
  gsap.to(".other", { scale: 1.5 })

  // Return a cleanup function (or use gsap.context() automatically)
})

mm.add("(max-width: 799px)", () => {
  gsap.to(".box", { x: 100, y: 50 })
})

// Cleanup all matchMedia
mm.revert()
```

### prefers-reduced-motion

```js
const mm = gsap.matchMedia()

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Full animations
  gsap.to(".box", { x: 500, duration: 2 })
})

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Minimal or no animations
  gsap.set(".box", { x: 500 })
})
```

### gsap.context()

Scoped animations with automatic revert — essential for React/framework cleanup.

```js
const ctx = gsap.context(() => {
  // All animations created inside this function are tracked
  gsap.to(".box", { x: 100 })
  gsap.from(".hero", { opacity: 0, y: 50 })
  const tl = gsap.timeline()
  tl.to(".item", { scale: 0.5 })
})

// Revert ALL tracked animations
ctx.revert()

// Add individual tweens after creation
ctx.add(() => {
  gsap.to(".new", { y: 50 })
})

// Get tweens for a specific target
ctx.getAll()      // Array of all tracked animations

// Selector scope — all selectors resolve relative to `scope`
const ctx2 = gsap.context(() => {
  gsap.to(".item", { x: 100 })  // matches .item inside scope
}, scopeElement)

// In React with useGSAP():
useGSAP(() => {
  gsap.to(".box", { x: 100 })
}, { dependencies: [dep], scope: containerRef })
```

### useGSAP() React Hook

```js
import { useGSAP } from "@gsap/react"

// Inside component:
const container = useRef()

useGSAP(() => {
  // All selectors auto-scoped to container
  gsap.to(".box", { x: 100 })
  gsap.fromTo(".title", { opacity: 0 }, { opacity: 1, duration: 1 })
}, { scope: container })

// With dependencies:
useGSAP(() => {
  // Runs when deps change
}, { dependencies: [count], scope: container })
```

---

## 17. All Animation-Type Quick Reference

| # | Animation Category | Tool/Plugin | License | Key Feature |
|---|---|---|---|---|
| 1 | **Basic Tween** | `gsap.to()/from()/fromTo()/set()` | Free | Core property animation |
| 2 | **Timeline Sequencing** | `gsap.timeline()` | Free | Chain/multiplex animations |
| 3 | **Keyframes** | `keyframes: [...]` | Free | Multi-step sequential |
| 4 | **Stagger** | `stagger: {...}` | Free | Cascading delays between targets |
| 5 | **Scroll-Driven** | ScrollTrigger | Free | Animation tied to scroll position |
| 6 | **Smooth Scroll** | ScrollSmoother | Club | Smooth parallax scrolling |
| 7 | **Drag** | Draggable | Club | Drag, flick, throw, rotate elements |
| 8 | **Physics 2D** | Physics2DPlugin | Club | Projectile/trajectory motion |
| 9 | **Physics Props** | PhysicsPropsPlugin | Club | Per-property physics |
| 10 | **Inertia** | InertiaPlugin | Club | Momentum + snap deceleration |
| 11 | **Path Following** | MotionPathPlugin | Club | SVG path & coordinate array |
| 12 | **SVG Morph** | MorphSVGPlugin | Club | Shape-to-shape morphing |
| 13 | **SVG Stroke** | DrawSVGPlugin | Club | Stroke reveal/hide |
| 14 | **FLIP Layout** | Flip | Free (v3.9+) | Layout state transition |
| 15 | **Text Split** | SplitText | Club | Char/word/line staggering |
| 16 | **Typewriter** | TextPlugin | Free | Character-by-character text |
| 17 | **Scramble Text** | ScrambleTextPlugin | Club | Scrambling character reveal |
| 18 | **Observer** | Observer | Free | Unified input (wheel/touch/pointer) |
| 19 | **Custom Ease** | CustomEase | Club | Bezier curve designer |
| 20 | **Custom Bounce** | CustomBounce | Club | Design bounce curves |
| 21 | **Custom Wiggle** | CustomWiggle | Club | Design wiggle curves |
| 22 | **Rough Ease** | RoughEase | Club | Jittery/noise easing |
| 23 | **GSDevTools** | GSDevTools | Club | Runtime animation controls |

---

## 18. Animation Recipes & Patterns

Collection of real-world, copy-pasteable animation patterns covering common UI needs.

### 18.1 Staggered Reveal (Fade + Slide Up)

```js
// Cards/items stagger-in on scroll
gsap.from(".card", {
  opacity: 0,
  y: 60,
  stagger: 0.08,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".cards-grid",
    start: "top 80%",
  },
})
```

### 18.2 Parallax Background

```js
// Background moves slower than scroll
gsap.to(".parallax-bg", {
  y: (i, el) => -(el.offsetHeight - el.parentElement.offsetHeight),
  ease: "none",
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
})
```

### 18.3 Horizontal Scroll Section

```js
const panels = gsap.utils.toArray(".panel")
gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    end: `+=${(panels.length - 1) * 100}%`,
  },
})
```

### 18.4 Infinite Marquee / Seamless Loop

```js
// Duplicate the content, animate both as a seamless strip
const marquee = document.querySelector(".marquee-track")
const dup = marquee.innerHTML
marquee.innerHTML += dup

gsap.to(marquee, {
  xPercent: -50,
  ease: "none",
  repeat: -1,
  duration: 20,
})
```

### 18.5 Counting Number Animation

```js
// Animate a number from 0 to target
function animateCount(el, target) {
  gsap.fromTo(el, 
    { textContent: 0 },
    {
      textContent: target,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },  // round to integers
    }
  )
}
// Usage: animateCount("#count", 1500)
```

### 18.6 Accordion / Expand-Collapse

```js
function accordionToggle(header) {
  const content = header.nextElementSibling
  const isOpen = content._open

  gsap.to(content, {
    height: isOpen ? 0 : content.scrollHeight,
    duration: 0.35,
    ease: "power2.inOut",
    onStart: () => {
      if (!isOpen) content.style.display = "block"
    },
    onComplete: () => {
      if (isOpen) content.style.display = "none"
      content._open = !isOpen
    },
  })
}

// Set initial state
gsap.set(".accordion-content", { height: 0, display: "none" })
```

### 18.7 Progress Bar (Scroll Tracked)

```js
gsap.to(".progress-bar", {
  scaleX: 1,
  transformOrigin: "left center",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.2,
  },
})
```

### 18.8 Typewriter + Blinking Cursor

```js
gsap.to(".typewriter-text", {
  text: "Hello, world! This types itself.",
  duration: 3,
  ease: "none",
  delay: 0.5,
})

// CSS cursor:
// .typewriter-text::after { content: "|"; animation: blink 0.7s infinite; }
// @keyframes blink { 50% { opacity: 0 } }
```

### 18.9 Hamburger to X Morph

```js
const tl = gsap.timeline({ paused: true, reversed: true })

tl.to(".line-top",  { y: 8, rotation: 45, transformOrigin: "50% 50%" }, 0)
tl.to(".line-mid",  { scaleX: 0, opacity: 0 }, 0)
tl.to(".line-bot",  { y: -8, rotation: -45, transformOrigin: "50% 50%" }, 0)

// Toggle:
menuBtn.addEventListener("click", () => tl.reversed() ? tl.play() : tl.reverse())
```

### 18.10 Drag-to-Reveal (Swipeable Card)

```js
Draggable.create(".card", {
  type: "x",
  bounds: { minX: -300, maxX: 300 },
  edgeResistance: 0.5,
  inertia: true,
  onDragEnd: function () {
    if (this.x < -150) {
      gsap.to(this.target, { x: -400, opacity: 0, duration: 0.3, onComplete: () => { /* remove */ } })
    } else if (this.x > 150) {
      gsap.to(this.target, { x: 400, opacity: 0, duration: 0.3, onComplete: () => { /* remove */ } })
    } else {
      gsap.to(this.target, { x: 0, duration: 0.4, ease: "back.out" })
    }
  },
})
```

### 18.11 Scroll-Triggered Timeline with Labels

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    pin: true,
    start: "top top",
    end: "+=3000",
    scrub: 1.5,
    snap: { snapTo: "labels", duration: { min: 0.2, max: 3 } },
  },
})

tl.addLabel("start")
  .to(".el-1", { x: 200, scale: 1.2 })
  .addLabel("mid")
  .to(".el-2", { opacity: 1, y: 0 })
  .addLabel("end")
  .to(".el-3", { rotation: 360 })
```

### 18.12 Pin + Zoom-In Effect

```js
gsap.to(".zoom-target", {
  scale: 1.5,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: ".pin-section",
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: true,
    scrub: 1,
  },
})
```

### 18.13 Split Text Reveal (Lines Stagger)

```js
const split = new SplitText(".headline", { type: "lines" })

gsap.from(split.lines, {
  y: 80,
  opacity: 0,
  rotationX: -45,
  stagger: 0.12,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".headline",
    start: "top 90%",
  },
  onComplete: () => split.revert(),
})
```

### 18.14 3D Card Tilt (Mouse Follower)

```js
const card = document.querySelector(".card-3d")

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2  // -1 to 1
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

  gsap.to(card, {
    rotationX: -y * 15,
    rotationY: x * 15,
    transformPerspective: 600,
    duration: 0.3,
    ease: "power2.out",
  })
})

card.addEventListener("mouseleave", () => {
  gsap.to(card, {
    rotationX: 0,
    rotationY: 0,
    duration: 0.5,
    ease: "elastic.out(1, 0.4)",
  })
})
```

### 18.15 Smooth Anchor Scrolling (ScrollToPlugin)

```js
// Club GSAP — requires ScrollToPlugin
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const target = document.querySelector(link.getAttribute("href"))
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: "power3.inOut",
      })
    }
  })
})
```

### 18.16 Magnet Button Effect

```js
const btn = document.querySelector(".magnet-btn")

btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) * 0.3
  const y = (e.clientY - rect.top - rect.height / 2) * 0.3

  gsap.to(btn, {
    x, y,
    duration: 0.4,
    ease: "power3.out",
  })
})

btn.addEventListener("mouseleave", () => {
  gsap.to(btn, {
    x: 0, y: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.4)",
  })
})
```

### 18.17 Loading Spinner / Pulse

```js
// Pulsing opacity
gsap.to(".loader", {
  opacity: 0.3,
  scale: 0.9,
  duration: 0.8,
  yoyo: true,
  repeat: -1,
  ease: "power1.inOut",
})

// Rotating spinner
gsap.to(".spinner", {
  rotation: 360,
  duration: 1,
  repeat: -1,
  ease: "none",
})
```

### 18.18 Image Gallery / Lightbox Transition

```js
// Open lightbox (full screen)
function openLightbox(imgEl) {
  const clone = imgEl.cloneNode(true)
  const rect = imgEl.getBoundingClientRect()

  gsap.set(clone, {
    position: "fixed",
    margin: 0,
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    zIndex: 1000,
    objectFit: "cover",
    borderRadius: "8px",
  })

  document.body.appendChild(clone)

  gsap.to(clone, {
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    borderRadius: "0px",
    cursor: "zoom-out",
    duration: 0.5,
    ease: "power2.inOut",
  })
}
```

### 18.19 Grid Filter / Sort with Flip

```js
// Filter grid items with FLIP animation
function filterGrid(category) {
  const state = Flip.getState(".grid-item")

  document.querySelectorAll(".grid-item").forEach((item) => {
    item.style.display = category === "all" || item.dataset.category === category
      ? "block" : "none"
  })

  Flip.from(state, {
    duration: 0.5,
    ease: "power1.inOut",
    absolute: true,
    fade: true,
    onEnter: (els) => gsap.from(els, { opacity: 0, scale: 0.8 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8 }),
  })
}
```

### 18.20 Custom Cursor

```js
const cursor = document.querySelector(".custom-cursor")

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: "power2.out",
  })
})

// Hover scale on interactive elements
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 2, duration: 0.2 }))
  el.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1, duration: 0.2 }))
})
```

---

## 19. Framework Integration

### 19.1 React — useGSAP Hook

```js
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

function MyComponent() {
  const container = useRef()

  useGSAP(() => {
    // Selectors auto-scope to container
    gsap.from(".title", { opacity: 0, y: 50, duration: 1 })
    gsap.to(".box", { x: 200, duration: 1.5, ease: "power2.out" })
  }, { scope: container })

  return (
    <div ref={container}>
      <h1 className="title">Animated</h1>
      <div className="box" />
    </div>
  )
}
```

**With Dependencies:**

```js
useGSAP(() => {
  gsap.to(".progress", { width: `${count}%`, duration: 0.5 })
}, { dependencies: [count], scope: container })
```

**ScrollTrigger + useGSAP:**

```js
useGSAP(() => {
  gsap.to(".reveal", {
    x: 200,
    scrollTrigger: {
      trigger: ".reveal",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  })
}, { scope: container })

// Cleanup on unmount is automatic — ScrollTrigger instances are killed
```

### 19.2 React — Flip with State Change

```js
import { useGSAP } from "@gsap/react"
import { useState, useRef } from "react"

function SortableGrid() {
  const [items, setItems] = useState([/* ... */])
  const gridRef = useRef()

  const shuffle = () => {
    const state = Flip.getState(".grid-item", { props: "backgroundColor" })
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5))
    Flip.from(state, {
      duration: 0.6,
      ease: "power1.inOut",
      absolute: true,
    })
  }

  return (
    <div>
      <button onClick={shuffle}>Shuffle</button>
      <div ref={gridRef} className="grid">
        {items.map((item) => (
          <div key={item.id} className="grid-item" style={{ backgroundColor: item.color }}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 19.3 React — Draggable with Refs

```js
import { useRef, useEffect } from "react"

function DraggableCard() {
  const cardRef = useRef()

  useEffect(() => {
    const draggable = Draggable.create(cardRef.current, {
      type: "x,y",
      bounds: "#container",
      inertia: true,
    })[0]

    return () => draggable.kill()
  }, [])

  return (
    <div id="container" style={{ width: 400, height: 400 }}>
      <div ref={cardRef} className="draggable-card" />
    </div>
  )
}
```

### 19.4 React — SplitText Cleanup

```js
import { useGSAP } from "@gsap/react"

function Headline({ text }) {
  const container = useRef()

  useGSAP(() => {
    const split = new SplitText(".split-target", { type: "chars" })

    gsap.from(split.chars, {
      opacity: 0,
      y: 30,
      stagger: 0.02,
      duration: 0.4,
      ease: "back.out",
    })

    // ⚠️ Always revert SplitText in cleanup
    return () => split.revert()
  }, { scope: container })

  return (
    <h1 ref={container} className="split-target">{text}</h1>
  )
}
```

### 19.5 Vue 3 — Composables

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const boxRef = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(boxRef.value, { opacity: 0, x: -100, duration: 1 })
    gsap.to(".animate-in", {
      y: 0, opacity: 1, stagger: 0.1,
      scrollTrigger: { trigger: ".list", start: "top 80%" },
    })
  })
})

onUnmounted(() => ctx.revert())
</script>

<template>
  <div ref="boxRef" class="box">Hello Vue + GSAP</div>
  <div class="list">
    <div v-for="i in 5" :key="i" class="animate-in" style="transform: translateY(40px); opacity: 0">
      Item {{ i }}
    </div>
  </div>
</template>
```

### 19.6 Vue 3 — Reactive Props

```vue
<script setup>
import { watch, ref } from "vue"
import { gsap } from "gsap"

const props = defineProps({ progress: Number })
const barRef = ref(null)

watch(() => props.progress, (val) => {
  gsap.to(barRef.value, { scaleX: val / 100, duration: 0.4, ease: "power2.out" })
})
</script>

<template>
  <div class="progress-bar">
    <div ref="barRef" class="progress-fill" />
  </div>
</template>
```

### 19.7 Svelte — use:action

```svelte
<script>
  import { gsap } from "gsap"
  import { Flip } from "gsap/Flip"

  gsap.registerPlugin(Flip)

  let items = [1, 2, 3, 4, 5]
  let grid

  function shuffle() {
    const state = Flip.getState(".item")
    items = items.sort(() => Math.random() - 0.5)
    Flip.from(state, { duration: 0.5, absolute: true })
  }

  function gsapAnimate(node, { from, to, ...vars }) {
    if (from) gsap.from(node, { ...from, ...vars })
    else if (to) gsap.to(node, { ...to, ...vars })
    return { destroy() { gsap.killTweensOf(node) } }
  }
</script>

<div bind:this={grid} class="grid">
  {#each items as item (item)}
    <div class="item" use:gsapAnimate={{ from: { opacity: 0, y: 30 }, stagger: 0.1 }}>
      {item}
    </div>
  {/each}
</div>

<button on:click={shuffle}>Shuffle</button>
```

### 19.8 Svelte — onMount / onDestroy

```svelte
<script>
  import { onMount, onDestroy } from "svelte"
  import { gsap } from "gsap"

  let el
  let ctx

  onMount(() => {
    ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, scale: 0.8, duration: 0.6, ease: "back.out" })
      gsap.to(".float", { y: -20, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" })
    })
  })

  onDestroy(() => ctx?.revert())
</script>

<div bind:this={el}>Animated</div>
<div class="float">Floating</div>
```

### 19.9 Angular — Directive Pattern

```typescript
// gsap-animate.directive.ts
import { Directive, Input, ElementRef, OnInit, OnDestroy } from "@angular/core"
import { gsap } from "gsap"

@Directive({ selector: "[gsapAnimate]" })
export class GsapAnimateDirective implements OnInit, OnDestroy {
  @Input("gsapAnimate") vars: any
  private tween: gsap.core.Tween | null = null

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.tween = gsap.fromTo(this.el.nativeElement,
      this.vars?.from || {},
      { ...this.vars?.to, duration: this.vars?.duration || 0.5 }
    )
  }

  ngOnDestroy() {
    this.tween?.kill()
  }
}
```

```html
<!-- Usage -->
<div [gsapAnimate]="{ from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 }, duration: 1 }">
  Animated
</div>
```

### 19.10 Angular — ScrollTrigger Service

```typescript
import { Injectable, NgZone, OnDestroy } from "@angular/core"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

@Injectable({ providedIn: "root" })
export class GsapService implements OnDestroy {
  private ctx = gsap.context(() => {})

  constructor(private ngZone: NgZone) {
    gsap.registerPlugin(ScrollTrigger)
  }

  createScrollAnimation(target: string, vars: any) {
    this.ngZone.runOutsideAngular(() => {
      this.ctx.add(() => {
        gsap.from(target, {
          ...vars,
          scrollTrigger: { trigger: target, start: "top 85%", ...vars.scrollTrigger },
        })
      })
    })
  }

  ngOnDestroy() {
    this.ctx.revert()
  }
}
```

### 19.11 Next.js / SSR Safety

```jsx
"use client"  // GSAP requires client-side DOM

import { useGSAP } from "@gsap/react"

function ClientAnimation() {
  const container = useRef()

  useGSAP(() => {
    gsap.to(".box", { x: 200, duration: 1 })
  }, { scope: container })

  if (typeof window === "undefined") return null  // or <div ref={container}>...

  return (
    <div ref={container}>
      <div className="box" />
    </div>
  )
}
```

**Dynamic Import (Next.js):**

```jsx
import dynamic from "next/dynamic"

const AnimatedSection = dynamic(() => import("@/components/AnimatedSection"), {
  ssr: false,  // skip SSR for GSAP-heavy components
})
```

**When you need SSR guard:**

```jsx
import { useEffect, useRef } from "react"

function SafeGsap() {
  const ref = useRef()
  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    if (!isBrowser) return
    const ctx = gsap.context(() => gsap.from(ref.current, { opacity: 0 }))
    return () => ctx.revert()
  }, [isBrowser])

  return <div ref={ref}>Content</div>
}
```

### 19.12 Nuxt 3 — Plugin

```typescript
// plugins/gsap.client.ts
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"

gsap.registerPlugin(ScrollTrigger, Flip)

export default defineNuxtPlugin(() => {
  return { provide: { gsap, ScrollTrigger, Flip } }
})
```

```vue
<!-- Usage in any page/component -->
<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp()

onMounted(() => {
  $gsap.to(".box", { x: 200, scrollTrigger: { trigger: ".box" } })
})
</script>
```

### 19.13 SvelteKit — onMount Guard

```svelte
<script>
  import { onMount } from "svelte"
  import { gsap } from "gsap"
  import { browser } from "$app/environment"

  let el

  onMount(() => {
    if (!browser) return
    const ctx = gsap.context(() => gsap.from(el, { opacity: 0, y: 50 }))
    return () => ctx.revert()
  })
</script>

<div bind:this={el}>Kit + GSAP</div>
```

---

## 20. Performance & Debugging

### 20.1 GPU Acceleration

GSAP automatically uses `transform` properties (`x`, `y`, `scale`, `rotation`) which are GPU-composited. For best results:

```js
// GOOD — GPU accelerated
gsap.to(el, { x: 200, rotation: 45, scale: 1.5 })

// AVOID — triggers layout/paint
gsap.to(el, { left: "200px", top: "100px" })
gsap.to(el, { width: "50%", height: "300px" })
```

**Prefer transforms over layout properties:**

| Instead of... | Use... | Reason |
|---|---|---|
| `left` / `top` / `right` / `bottom` | `x` / `y` | No layout recalc |
| `width` / `height` | `scaleX` / `scaleY` | GPU composited |
| `margin` | `x` / `y` | No reflow |
| `fontSize` | `scale` (on wrapper) | Cheaper |

### 20.2 force3D & will-change

```js
// Force GPU compositing (usually automatic in GSAP)
gsap.to(el, { x: 200, force3D: true })

// CSS will-change for high-frequency updates (mouse tracking, etc.)
// GSAP adds/removes will-change automatically during tweens,
// but for quickTo/quickSetter you may need to set it:
.el {
  will-change: transform, opacity;
}
```

**When to set `will-change` manually:**
- `quickTo` / `quickSetter` callbacks (not animation-driven)
- Custom ticker loops
- Frequent style reads (avoid forced layout)

### 20.3 Avoiding Layout Thrashing

```js
// BAD — read-then-write interleaving (forces layout each time)
elements.forEach((el) => {
  const w = el.offsetWidth      // forces layout
  gsap.set(el, { width: w * 2 }) // forces layout
})

// GOOD — batch reads then writes
const widths = elements.map((el) => el.offsetWidth)
elements.forEach((el, i) => gsap.set(el, { width: widths[i] * 2 }))
```

**GSAP-friendly approach:**

```js
gsap.set(elements, {
  width: (i, el, targets) => {
    // The index callback runs during set — batch internally
    return el.offsetWidth * 2
  },
})
```

### 20.4 Ticker & Frame Management

```js
// Cap frame rate (battery/mobile friendly)
gsap.ticker.fps(30)            // cap at 30fps
gsap.ticker.fps(60)            // restore 60fps
gsap.ticker.fps()              // read current fps

// Disable lag smoothing (for consistent stepping)
gsap.ticker.lagSmoothing(0)

// Pause all animations (visibility change, etc.)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    gsap.globalTimeline.pause()
  } else {
    gsap.globalTimeline.resume()
  }
})

// Remove slow ticker listeners
gsap.ticker.add(myFunc)
gsap.ticker.remove(myFunc)  // always clean up
```

### 20.5 Memory Leaks & Cleanup

**Always revert in SPA frameworks:**

```js
// BAD — GSAP keeps references to DOM elements
useEffect(() => {
  gsap.to(".el", { x: 100 })
})

// GOOD — context tracks and reverts
useEffect(() => {
  const ctx = gsap.context(() => gsap.to(".el", { x: 100 }))
  return () => ctx.revert()
}, [])
```

**Kill ScrollTrigger on unmount:**

```js
// Kills ALL ScrollTrigger instances for this context
onCleanup(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
// OR with context:
const ctx = gsap.context(() => { /* ... */ })
// ctx.revert() automatically kills ST instances created inside
```

**SplitText memory:**

```js
// ⚠️ SplitText creates DOM nodes — always revert
const split = new SplitText(el, { type: "chars" })
gsap.from(split.chars, { opacity: 0 }).then(() => split.revert())
// .then() waits for all tweens to complete
```

**Draggable cleanup:**

```js
// Draggable instances must be killed
const draggable = Draggable.create(target, vars)[0]
// cleanup:
draggable.kill()
```

### 20.6 Common Pitfalls & Solutions

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | Animation doesn't play | GSAP not registered or selector wrong | Check `gsap.registerPlugin()` and `document.querySelector()` |
| 2 | ScrollTrigger not firing | No `scrub` or `toggleActions` set | Add `scrub: true` or `toggleActions: "play none none none"` |
| 3 | Jump on first scroll | `immediateRender` behavior | Set `immediateRender: false` on `from()` tweens inside ST |
| 4 | Pin flashes at start | Layout shift on pin | Set `anticipatePin: 1` on ScrollTrigger config |
| 5 | Flip animates zero-size | DOM not rendered before `getState` | Call `Flip.getState()` AFTER browser paint (requestAnimationFrame or layout effect) |
| 6 | SplitText breaks SSR | DOM not available on server | Guard with `typeof window !== "undefined"` or use client-only import |
| 7 | Draggable not working on mobile | `allowNativeTouchScrolling` blocks | Set `allowNativeTouchScrolling: false` |
| 8 | Tween starts from wrong value | CSS has `transition` property | Remove CSS transitions on animated elements |
| 9 | Stagger order looks wrong | Elements not in document order | Use `gsap.utils.toArray()` for reliable element ordering |
| 10 | Animation jitters on scroll | Layout thrashing or heavy paint | Prefer `x`/`y` over `top`/`left`, use `force3D: true` |
| 11 | matchMedia doesn't re-fire | Returned cleanup not reverting | Always return a revert function or use `gsap.context()` inside |
| 12 | Observer fires too often | `tolerance` too low | Increase `tolerance` and/or set `debounce` |

### 20.7 Debugging Tools

**GSDevTools (Club GSAP):**

```js
// Add scrubber UI for any timeline/tween
GSDevTools.create({ animation: tl })

// Config:
GSDevTools.create({
  animation: tl,
  container: "#custom-container",  // mount target
  css: { backgroundColor: "#222" },
})
```

**ScrollTrigger Markers:**

```js
scrollTrigger: {
  markers: true,
  // Custom colors:
  markers: { startColor: "lime", endColor: "red", fontSize: "14px", indent: 200 },
}
```

**Logging & Inspection:**

```js
// Log animation state on update
gsap.to(el, {
  x: 200,
  onUpdate: function () {
    console.log(this.progress(), this.time(), this.isActive())
  },
})

// Inspect all ScrollTriggers
console.table(ScrollTrigger.getAll().map((st) => ({
  id: st.vars.id,
  trigger: st.trigger,
  progress: st.progress,
  active: st.isActive,
  start: st.start,
  end: st.end,
})))

// Check GSAP version
console.log(gsap.version)

// Check registered plugins
console.log(gsap.plugins)
```

**Browser DevTools tips:**

```
1. Performance tab: Record scroll/animations, look for:
   - Long frames (>16ms = <60fps)
   - Forced reflows (layout trashing)
   - Purple "Rendering" bars (compositing)

2. Paint flashing: DevTools → More tools → Rendering → "Paint flashing"
   - Flashing green = repaints (minimize these)

3. Layers panel: DevTools → More tools → Layers
   - Verify animated elements are on their own compositor layer
```

**GSAP Utility Methods for debugging:**

```js
gsap.utils.toArray(".selector")    // reliable array from NodeList/collection
gsap.utils.checker(value)          // validate/check values
gsap.utils.distribute(vars)        // create distribution functions
gsap.utils.selector(scope)         // scoped selector (used by context internally)
gsap.utils.unitize(fn, unit)       // wrap function to append unit
gsap.utils.pipe(fn1, fn2, ...)     // function composition
gsap.utils.clamp(min, max, value)  // clamp value
gsap.utils.snap(snapTo, value)     // snap value to increment
gsap.utils.interpolate(from, to, progress)  // interpolate between values
gsap.utils.random(min, max, snap, returnFunction)
gsap.utils.mapRange(inMin, inMax, outMin, outMax, value)
gsap.utils.normalize(min, max, value)  // normalize to 0-1
```

---

## Appendices

### A. Tween Config Properties Quick Reference

```
duration, delay, ease, repeat, repeatDelay, yoyo, yoyoEase,
stagger, overwrite, immediateRender, callbackScope, data, paused, reversed,
keyframes, onStart, onUpdate, onComplete, onRepeat, onReverseComplete,
x, y, rotation, scaleX, scaleY, skewX, skewY, transformOrigin,
opacity, width, height, color, backgroundColor, borderRadius,
boxShadow, textShadow, filter, clipPath, ...
```

### B. Loading & Registering Plugins

```js
// ES Modules
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Draggable } from "gsap/Draggable"
import { Flip } from "gsap/Flip"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { Observer } from "gsap/Observer"
import { TextPlugin } from "gsap/TextPlugin"

// Club GSAP plugins (separate membership package)
import { SplitText } from "gsap/SplitText"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { InertiaPlugin } from "gsap/InertiaPlugin"
import { Physics2DPlugin } from "gsap/Physics2DPlugin"
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin"
import { CustomEase } from "gsap/CustomEase"

// Always register:
gsap.registerPlugin(ScrollTrigger, Draggable, Flip, Observer, TextPlugin, ...)

// CDN:
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
// then: gsap.registerPlugin(ScrollTrigger)
```

### C. GSAP Versions & Membership

- **Free / Core:** Tween, Timeline, CSSPlugin, Eases, ScrollTrigger, Observer, Flip, TextPlugin, Utility Methods, matchMedia, context, useGSAP, quickTo, quickSetter
- **Club GSAP (paid):** Draggable, InertiaPlugin, MotionPathPlugin, MotionPathHelper, SplitText, MorphSVGPlugin, DrawSVGPlugin, Physics2DPlugin, PhysicsPropsPlugin, CustomEase, CustomWiggle, CustomBounce, RoughEase, SlowMo, ExpoScaleEase, ScrambleTextPlugin, GSDevTools, ScrollSmoother, ScrollToPlugin
- **v3.15+:** Directional easing (`easeReverse`), enhanced InertiaPlugin
- **v3.12+:** `"clamp()"` for ScrollTrigger start/end

---

*Generated: July 2026 — Comprehensive study of GSAP v3.15 animation & motion types.*
