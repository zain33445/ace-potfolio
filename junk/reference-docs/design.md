# ACE SERVICES — Design System

## 1. Project Overview

**ACE SERVICES** is a precision construction estimation and quantity surveying platform. The site serves general contractors, subcontractors, and developers with pre-construction support including cost estimating, material takeoffs, permit sets, and project scheduling across 35 US states.

- **Stack:** React 19 + TypeScript + Vite 6
- **Routing:** react-router-dom v7 (BrowserRouter)
- **Styling:** Tailwind CSS v4 with custom theme
- **3D:** Three.js (3 interactive scenes)
- **Animation:** motion (framer-motion API re-export), GSAP + ScrollTrigger, Lenis (smooth scroll)
- **Icons:** lucide-react
- **Pages:** Home (`/`), Calculator (`/calculator`)

---

## 2. Design Philosophy

The brand presents as a **technical, engineering-grade, industrial tool** — not a traditional construction company website. The aesthetic merges:

- **Blueprint/ schematic drafting** — grid overlays, bracket corners (`[ ]`), monochrome with orange accents, crosshair cursor
- **Software / systems interface** — system IDs like `[TAKEOFF_ENGINE_DEMO]`, pseudo-terminal labels, blinking status indicators
- **Precision instrumentation** — wireframe 3D models, oscillating scan lines, measurement tick marks
- **Industrial minimalism** — generous whitespace, monochromatic grays, single accent color

The tone is authoritative and data-driven, speaking directly to construction professionals who value accuracy and speed over visual fluff.

---

## 3. Color System

Tailwind v4 custom theme defined in `src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#FF6B00` (orange) | Buttons, links, active states, icons, borders on hover, system labels |
| `background` | `#F5F5F5` (light gray) | Page background |
| `on-background` | `#0A0A0A` (near-black) | Headings, body text |
| `surface` | `#FFFFFF` | Cards, sections, nav |
| `on-surface` | `#0A0A0A` | Text on surface |
| `surface-variant` | `#EAEAEA` | Subtle card backgrounds |
| `on-surface-variant` | `#5A5A5A` | Secondary text, metadata |
| `blueprint-line` | `#D1D5DB` (gray-300) | Borders, dividers, grid lines |
| `cad-white` | `#FFFFFF` | Pure white accents |

**Accent system ID color:** `#FF6B00` (orange) is used sparingly — only for interactive elements and system labels, never for body text. A secondary warm orange (`#FFDFCC`) appears on the contact form's dark background for subtle highlights.

**Feedback colors:**
- Success: `#00A859` (green) — verification badges, bid-won indicators
- System caution: `#FF6B00` — status flags, active indicators

---

## 4. Typography

Three font families loaded from Google Fonts:

| Family | CSS Token | Weight Used | Usage |
|---|---|---|---|
| **Inter** | `--font-sans` | 400, 500, 600 | Body text, descriptions, form inputs |
| **JetBrains Mono** | `--font-mono` | 400, 500, 700 | System IDs, labels, data displays, buttons |
| **Space Grotesk** | `--font-space` | 500, 600, 700, 800 | Headings, stat numbers, brand name |

**Type scale:**

| Element | Font | Size | Weight |
|---|---|---|---|
| H1 | Space Grotesk | `text-4xl` → `text-6xl` | 800 (extrabold) |
| H2 | Space Grotesk | `text-3xl` → `text-4xl` | 800 |
| H3 | Space Grotesk | `text-lg` → `text-xl` | 700 (bold) |
| Body | Inter | `text-base` | 400 |
| Small body | Inter | `text-sm` | 400 |
| System label | JetBrains Mono | `text-[10px]`–`text-xs` | 700 |
| Data / stats | Space Grotesk | `text-4xl`–`text-5xl` | 800 |
| Button text | JetBrains Mono | `text-[11px]`–`text-xs` | 700 |

**System IDs** (`[SYS_INIT: PRECISION_ESTIMATE]`, `[TAKEOFF_ENGINE_DEMO]`) are always JetBrains Mono, uppercase, primary color, and serve as section headers. They mimic terminal command output and developer tooling.

---

## 5. Spacing & Layout

### Responsive breakpoints
- Mobile first; Tailwind's default breakpoints: `sm` (640), `md` (768), `lg` (1024), `xl` (1280)

### Grid system
- Pages use **Tailwind grid** (`grid-cols-1 lg:grid-cols-12 gap-12`) for hero and about sections
- Cards use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` or `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` depending on context
- The contact form uses `grid-cols-1 lg:grid-cols-2` split layout

### Horizontal margins
- `px-6 md:px-16` — consistent left/right padding across all sections
- Max content width via `max-w-7xl mx-auto` where needed

### Section spacing
- Vertical padding: `py-20` to `py-24` per section
- Separated by `border-b border-blueprint-line` dividers
- Hero has `pt-24` (accounts for fixed nav height)

---

## 6. Interactive Elements

### Buttons

| Variant | Style | Usage |
|---|---|---|
| **Primary (CTA)** | `bg-primary text-white font-mono` | Main actions — Get Quote, Submit, Calculator |
| **Secondary (outline)** | `border border-blueprint-line text-on-background` | Secondary actions — View Schematics |
| **Ghost / tab** | `text-on-surface-variant hover:text-primary` | Tabs, category filters |
| **Active tab** | `bg-primary text-white font-bold` | Selected filter / tab state |

All buttons use `tracking-wider` or `tracking-widest`, small monospace font, and uppercase.

### Bracket corners (`bracket-corners` class)

A signature visual element: small corner brackets (`┐ ┌ ┘ └`) drawn with CSS `::before`/`::after` pseudo-elements on cards, buttons, and input fields. The brackets are 8×8px, primary color, and expand to 12×12px on hover (`.hover-brackets`). This reinforces the blueprint/drafting theme.

### Accordion (Solutions section)
- Click-to-expand card list on left, detail panel with animated transition on right
- Uses `motion` AnimatePresence for `opacity` + `x` transitions
- Active item gets `ring-1 ring-primary border-primary`

### Process flow (scroll-triggered pin)
- **GSAP + ScrollTrigger** pins the section and scrubs through 4 steps
- Steps fade/scale in sequence as user scrolls
- Active step shows `bg-surface border-primary` with left accent bar
- Sidebar 3D clipboard model updates in sync with active step

### Interactive cost estimator
- Live calculation engine updates on slider/button/input change
- Project type buttons (commercial, residential, MEP, industrial, permits)
- Range slider for square footage (1,000–200,000 SF)
- Toggle buttons for complexity (simple/medium/high) and speed (standard/rush)
- ZIP code text input with regional cost multiplier feedback
- Results panel shows total with animated horizontal cost bars per category
- "Analysis" tab shows full parametric breakdown

### Portfolio project cards
- Click to expand with `AnimatePresence` height animation
- Category filter pills (ALL, COMMERCIAL, HOSPITALITY, RETAIL, MUNICIPAL)
- Text search by project ID, name, or scope
- Hover state: border turns primary, heading turns primary

### Contact form
- Two-column layout: orange info panel (left) + white form (right)
- Animated submit confirmation with reference ticket generation
- Submitting state with spinner (`RefreshCw` icon spinning)
- Input validation on name, email, project name

### Ticker strip
- Continuous horizontal scrolling marquee of stats
- CSS animation (`ticker-anim`) with `translate3d(-100%, 0, 0)`

---

## 7. 3D & WebGL

Three interactive Three.js scenes, all using wireframe materials with shared aesthetic:

| Component | File | Subject | Interaction |
|---|---|---|---|
| **Hero3D** | `Hero3D.tsx` | Structural building frame (columns, slabs, foundation) | Mouse parallax rotation + continuous slow spin + scroll displacement |
| **About3D** | `About3D.tsx` | Mixed-use massing model (podium + tower + adjacent block) | Mouse tracking rotation + floating + scroll displacement |
| **Process3D** | `Process3D.tsx` | Clipboard / surveyor's board with clip | Mouse tracking rotation + scroll-linked z-rotation |

**Shared material language:**
- Orange wireframe (`color: 0xFF6B00`) for primary structural elements
- Charcoal wireframe (`color: 0x0A0A0A`, opacity 0.15–0.25) for secondary / context elements
- Alpha renderer, antialias, pixel ratio capped at 2

**Background:** WebGL canvas (`BackgroundShader.tsx`) renders a subtle orange grid that pulses on a sine wave — visible behind all content at 60% opacity.

All 3D scenes are cleaned up on unmount (dispose renderer, cancel RAF, remove event listeners).

---

## 8. Motion & Animation

### Libraries
- **motion** (framer-motion v12): Used for UI transitions — accordion panel switches, project card expand/collapse, contact form submit/reveal
- **GSAP + ScrollTrigger**: Used for the pinned process flow section scrub animation
- **Lenis**: Smooth scrolling with `duration: 1.2`, custom easing curve, scroll-driven nav background swap

### Animation patterns

| Animation | Method | Details |
|---|---|---|
| Smooth scroll | Lenis | `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` |
| Nav background | Lenis scroll event | Transparent → `bg-surface/95 backdrop-blur-md border-b-2 border-primary` when scrolled past 40px |
| Process steps | GSAP ScrollTrigger | Pinned, scrubbed, 4 steps fade/scale in sequence over `400vh` |
| Accordion detail | motion AnimatePresence | `opacity` + `x: ±20` slide |
| Project card expand | motion AnimatePresence | `height: 0 → auto` + `opacity` |
| Contact form swap | motion AnimatePresence | `opacity` + `x: ±20` (form→receipt), `scale` (receipt reveal) |
| Buttons | CSS transitions | `transition-all duration-200` or `duration-300` |
| Cards | CSS transitions | `hover:border-primary transition-all duration-300` |
| Spinning icon | CSS | `animate-spin` on loader |
| Pulsing dot | Tailwind | `animate-ping` on status indicators |

---

## 9. Navigation

- **Desktop:** Fixed top nav with logo (ACE SERVICES) + links (SOLUTIONS, PROJECTS, METHODOLOGY, ABOUT) + CALCULATOR button. Links are anchor-scroll on Home, route to `/#id` on Calculator page.
- **Mobile:** Hamburger menu (lucide `Menu`/`X`) opens a full-width overlay panel below the nav bar with the same links styled as list items with bottom borders.
- **Nav background:** Transparent when at top, white + blur + orange bottom border when scrolled past threshold.

Footer contains:
- Logo + tagline
- Navigation links
- Standards section (CSI MasterFormat, AACE Class 3, ISO 9001)
- Contact info (email, phone, Dallas HQ)
- Copyright + geo-coordinates

---

## 10. Component Tree

```
App (Lenis, scrollToAnchor, nav state)
├── Nav (desktop links, mobile menu, calculator button)
├── Outlet
│   ├── Home
│   │   ├── BackgroundShader (WebGL grid)
│   │   ├── Hero3D (Three.js building frame)
│   │   ├── Ticker strip (CSS marquee)
│   │   ├── Interactive stats (4 hover cards)
│   │   ├── About3D (Three.js massing model)
│   │   ├── SolutionAccordion (4 solutions, click-swap)
│   │   ├── "Why Choose Us" grid (4 feature cards)
│   │   ├── Testimonials (2 client quotes + stat bar)
│   │   ├── InteractiveEstimator (live cost engine)
│   │   ├── ProjectPortfolio (filterable project grid)
│   │   ├── ProcessFlow (GSAP pinned 4-step scrub)
│   │   │   └── Process3D (Three.js clipboard)
│   │   └── ContactRequest (form + receipt)
│   └── CalculatorPage
│       └── InteractiveEstimator (standalone instance)
└── Footer
```

---

## 11. Data Types

All type definitions in `src/types.ts`:

```typescript
ProjectScope  — id, name, category, scope, turnaroundHours, totalAreaSqFt, estimatedCost, description
SolutionItem  — id, title, category, description, details[]
EstimationInputs — projectType, areaSqFt, complexity, turnaroundSpeed, zipCode
CostBreakdown — materials, labor, equipment, permits, total, lowRange, highRange
```

---

## 12. Hooks

- `useNavScrolled` — simple state hook tracking whether the user has scrolled past the hero threshold (used by `App` to toggle nav background)

---

## 13. Assets & Public Files

- `assets/` — currently contains only `.aistudio/` directory (AI Studio framework metadata)
- No images, fonts, or static assets are loaded from `public/`
- All visual content is either CSS/HTML, inline SVG icons, or procedurally generated Three.js
- `index.html` is the single entry point — minimal shell that mounts React via `#root`

---

## 14. Build & Dev

- **Dev:** `npm run dev` — Vite dev server on port 3000, host 0.0.0.0
- **Build:** `npm run build` — Vite production build
- **Preview:** `npm run preview` — Vite preview server
- **Type check:** `npm run lint` — TypeScript `--noEmit`
- **HMR** can be disabled via `DISABLE_HMR=true` env var (used in AI Studio deployments)
- **Proxy** — a MITM proxy (`gemini-schema-proxy.mjs`) exists for sanitizing Gemini API schemas

---

## 15. Responsive Behavior

| Breakpoint | Layout Changes |
|---|---|
| **Mobile (< 768px)** | Single column, stacked cards, hamburger nav, full-width sections |
| **Tablet (768–1024px)** | 2-column grids for cards, nav links visible |
| **Desktop (> 1024px)** | 12-column grid for hero/about, 3-4 column card grids, split accordion layout |

The hero swaps from side-by-side (desktop) to stacked (mobile) layout. The process flow and contact form also switch from side-by-side to single-column on mobile. The estimator's configurator and results columns stack vertically on small screens.

---

## 16. SEO Metadata

```json
{
  "name": "ACE SERVICES",
  "description": "Precision construction estimation and rapid quantity surveying platform.",
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
```

The `index.html` title is currently generic (`"My Google AI Studio App"`) — should be updated to match the brand. All pages share the same bare `<title>` since there is no per-page meta tag management.
