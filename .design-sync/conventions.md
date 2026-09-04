## Setup

No wrapper/provider is required for most components — they're plain
client-side React reading no external context. Two exceptions: `Nav` and
`Footer` read Next.js App Router navigation state (`usePathname` and
friends) that doesn't exist outside a real Next.js app, so their preview
cards render a typographic placeholder rather than the real nav — build with
the real exported component, but don't expect it to reflect route state.
Everything else composes normally; components needing content (`children`,
`items`, `words`) have no safe default and must be given real props/children
— see each component's `.prompt.md`.

## Styling idiom: Tailwind v4 utility classes on real design tokens

Style everything with Tailwind utility classes — never hand-rolled CSS or
inline hex colors. The palette is driven by CSS custom properties defined in
an `@theme` block, and Tailwind v4 auto-generates a `bg-*`/`text-*`/`border-*`
utility for every `--color-*` token, so use the token names directly:

| Token | Utility examples | Use for |
|---|---|---|
| `--color-primary` / `--color-primary-container` | `bg-primary`, `text-primary`, `bg-primary-container` | brand orange accents, primary CTAs |
| `--color-surface` / `--color-surface-variant` | `bg-surface`, `bg-surface-variant` | card/panel backgrounds |
| `--color-background` | `bg-background` | page background |
| `--color-on-background` / `--color-on-surface` / `--color-on-surface-variant` / `--color-on-primary-container` | `text-on-surface`, `text-on-surface-variant` | text placed on top of the matching surface — always pair `on-*` text with its surface, never mix |
| `--color-ink` / `--color-text` | `text-ink`, `text-text` | primary body/heading text |
| `--color-blueprint-line` | `border-blueprint-line` | construction/blueprint-motif dividers and borders |

Standard Tailwind gray/blue/green/orange/amber/teal/cyan/emerald scales
(`gray-50`…`gray-900`, etc.) are also available for secondary/neutral UI.

Fonts are CSS variables, applied via `font-[family-name:var(--font-*)]` or a
mapped `font-sans`/`font-mono` utility: `--font-inter` (body/UI, default
sans), `--font-space` (Space Grotesk, headings/display), `--font-nourd`
(brand wordmark only), `--font-wosker` (card titles/display accents),
`--font-jetbrains-mono` (code/numeric data, e.g. estimates).

## Where the truth lives

Read `styles.css` and its `@import` closure (includes `_ds_bundle.css`) for
the full compiled token/utility set before styling anything new — it's the
real production Tailwind build, not a summary. Per-component API and usage
are in each `<Name>.prompt.md`.

## Example

```jsx
<div className="bg-surface rounded-xl p-6 shadow-xl">
  <h3 className="font-[family-name:var(--font-space)] text-on-surface text-lg font-semibold">
    Class 3 Estimate
  </h3>
  <p className="text-on-surface-variant mt-2 text-sm">
    Delivered in 24–48 hours, ±10% accuracy.
  </p>
  <button className="bg-primary text-on-primary-container mt-4 rounded-md px-4 py-2 font-semibold">
    Get a quote
  </button>
</div>
```
