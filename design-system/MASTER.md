# Design System — Prestige Motors Oran (ShowCarRoom)

> **Source of truth.** When building or reviewing any page, read this file first, then
> check `design-system/pages/<page-name>.md` for overrides (page rules win; otherwise
> Master applies). This document reflects the system **as actually built** in
> `src/styles.css` + `src/components/*` — not raw tool output.
>
> **Stack:** Web — TanStack Start (SSR) · React 19 · Tailwind CSS v4 · shadcn/ui (new-york).
> **This is NOT React Native.** Ignore any RN/mobile-only guidance from the UI/UX Pro Max skill.

---

## 1. Product & posture

Bilingual (FR / AR, LTR + RTL) car-showroom landing page for a dealership in Oran, Algeria.
Prices in DZD. Single home page (`/`) + a state-toggled vehicle-detail overlay. No backend;
inventory is static (`src/lib/mockData.ts`). Rebrand surface = `src/lib/siteConfig.ts`.

**Brand posture:** dark, editorial, automotive-luxury. Deep obsidian surfaces, warm
champagne-gold accent, restrained motion. Quiet confidence — not loud, not mass-market.

---

## 2. Page pattern

**Hero-Centric + Feature-Rich** — `Hero → Features → CTA`, primary CTA above the fold.
Implemented in `src/routes/index.tsx`: `HeroSection → FeaturedVehicles → ContactCTA`, plus a
full-screen `VehicleDetailPage` overlay. Keep this order for new landing variants.

---

## 3. Color (oklch tokens — never hardcode hex/rgb in components)

Dark-first: `:root` and `.dark` are identical (the showroom is always dark). All values live
in `src/styles.css`; components reference **semantic tokens only** (`bg-background`, `text-gold`,
`border-hairline`, …). To add a color, add a token — don't inline it.

| Role | Token | oklch value |
|---|---|---|
| Background (obsidian) | `--background` | `0.16 0.012 265` |
| Foreground | `--foreground` | `0.97 0.005 260` |
| Surface / card | `--surface` `--card` | `0.20 0.014 265` |
| Surface elevated | `--surface-elevated` | `0.235 0.016 265` |
| **Primary = champagne gold** | `--primary` `--gold` | `0.78 0.11 82` |
| Gold on-color (text on gold) | `--gold-foreground` | `0.17 0.012 265` |
| Gold soft | `--gold-soft` | `0.86 0.07 85` |
| Muted foreground | `--muted-foreground` | `0.72 0.02 260` |
| WhatsApp green | `--whatsapp` | `0.68 0.16 148` |
| Success | `--success` | `0.68 0.15 145` |
| Destructive | `--destructive` | `0.60 0.22 25` |
| Border / hairline / input | `--border` / `--hairline` / `--input` | white @ 8% / 6% / 10% |
| Focus ring | `--ring` | gold @ 60% |

**Rules**
- **Gold is the single accent.** One primary CTA per screen (`Button variant="gold"`); everything
  else is subordinate (`default` / `outline` / `ghost`).
- **Never** introduce a red/orange "action" accent as primary. Red is reserved for `destructive`
  (errors, "Réservé"). (The UI/UX Pro Max generator suggested a light bg + red CTA + 3D-hyperrealism
  style — **rejected**: wrong posture, poor perf, poor a11y for an SSR bilingual RTL site.)
- Functional color must carry text/icon too (never color-alone) — e.g. "Réservé" badge has a label.

---

## 4. Typography

- **Display / headings:** `--font-display` = "Playfair Display" (serif). Weights 500–700, tight
  tracking (`-0.02em`). Applied to `h1–h4` automatically.
- **Body / UI:** `--font-sans` = "Inter". Weights 400 / 500 / 600.
- **Arabic (RTL):** `--font-arabic` = "Noto Kufi Arabic", auto-swapped via `html[dir="rtl"]`.
- Fonts loaded in `src/routes/__root.tsx` (Google Fonts with `display=swap`).

Use the named type utilities from `styles.css`, not ad-hoc sizes:
`text-display-2xl/xl/lg` · `text-h1/h2/h3` · `text-body-lg/body/body-sm` · `text-caption` · `text-eyebrow` (gold, uppercase, wide-tracked).
Base body = 16px, line-height ≥ 1.55. Numbers/prices/phones use `tabular-nums` + `dir="ltr"`.

---

## 5. Spacing, radii, layout

- **Spacing scale:** 4 / 8 / 16 / 24 / 32 / 48 / 64px (Tailwind `1 2 4 6 8 12 16`). Stay on it.
- **Radii:** `--radius` 0.5rem base → `sm 6 · md 10 · lg 14 · xl 20` (cards) `· 2xl 28` (hero).
- **Container:** `max-w-7xl`, padding `px-4 sm:px-6 lg:px-8`.
- **Breakpoints:** default Tailwind — mobile-first, verify at 375 / 768 / 1024 / 1440.
- **Fixed navbar:** sections that don't start with the hero need top offset / `scroll-mt-24`
  for anchor targets (see `FeaturedVehicles`).
- **z-index:** navbar `z-50` · mobile drawer `z-40` · detail overlay `z-[70]`.

---

## 6. Effects & motion

- **Surfaces:** `surface-card` utility (card bg + hairline border + `--shadow-card` + 320ms transition);
  `surface-card-hover` (lift `-2px`, gold-tinted border, elevated shadow). `gold-glow` for gold CTAs.
  `grain` overlay for hero/luxury photography feel.
- **Shadow scale:** `--shadow-card` · `--shadow-elevated` · `--shadow-gold`. Don't invent ad-hoc shadows.
- **Motion tokens:** standard easing `cubic-bezier(0.22, 1, 0.36, 1)`; micro-interactions 150–320ms;
  entrances ~400–700ms with stagger 80–90ms. Enter from `y+16/24`, fade in. Restrained: animate a few
  key elements, not everything.
- **⚠ Reduced motion:** Framer Motion + CSS transitions do **not** currently respect
  `prefers-reduced-motion`. New motion must be gated (e.g. `MotionConfig reducedMotion="user"` +
  a CSS media query). See audit finding A1.

---

## 7. Component conventions

- **Button** (`components/ui/button.tsx`) — variants: `gold` (primary CTA) · `default` (neutral/
  secondary) · `outline` (tertiary) · `ghost` (nav/inline) · `whatsapp` · `destructive` · `link`.
  Sizes `sm/default/lg/xl/icon`. `default` size = 44px tall (`h-11`); `lg` = 48px (`h-12`).
  Includes `cursor-pointer` + `focus-visible:ring`. **Prefer this over hand-rolled `<button>`** so
  focus/cursor/disabled states stay consistent.
- **WhatsAppButton** — always `whatsapp` variant; builds `wa.me` deep link + prefilled bilingual
  message; opens in new tab with `rel="noopener noreferrer"`. Don't restyle.
- **TrustBadge** — credibility marker; variants `line` / `solid` / `subtle`; gold icon.
- **Badge** — condition (`solid`/`gold`), `destructive` for "Réservé". Always paired with text.
- **Icons:** Lucide only, `strokeWidth` 1.75–2, sized via tokens (`size-3.5/4/5`). No emoji as icons.

---

## 8. RTL (first-class, not an afterthought)

- Use **logical** utilities: `ms-* me-* ps-* pe-* start-* end-*` — never `left/right`.
- Directional icons flip with `rtl:rotate-180` (arrows, chevrons).
- Numbers, prices, phone, image counters: wrap in `dir="ltr"` + `tabular-nums`.
- Locale drives `dir`/`lang` on `<html>` via `LanguageProvider` (`src/lib/i18n.tsx`); the Arabic
  font swaps automatically. Test every new surface in **both** FR and AR.
- Prefer letting flex flow via `dir` over manual `flex-row-reverse` (double-reverse risk — see audit D8).

---

## 9. Accessibility baseline (WCAG AA)

- Text contrast ≥ 4.5:1 (≥ 3:1 large/UI glyphs). Gold (`L 0.78`) on obsidian (`L 0.16`) clears the
  3:1 glyph/large-text bar; **spot-check gold on body-size text**.
- Every interactive element needs a **visible focus ring** (`focus-visible:ring-2 ring-ring`).
- Touch targets ≥ 44×44px (expand hit area for small icons).
- Icon-only controls need `aria-label`. Modals: labelled, Escape-closable, focus-trapped,
  focus moved in on open + restored on close, background inert.
- Respect `prefers-reduced-motion`.

---

## 10. Anti-patterns (reject on sight)

- Hardcoded hex/rgb in components (tokens only) · red/light "car-dealer" palette as primary ·
  3D/WebGL/hyperrealism · emoji as icons · hover-only affordances · sub-44px tap targets ·
  motion with no reduced-motion fallback · `left/right` instead of logical props · placeholder-as-label.
