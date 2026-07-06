# Design System — Prestige Motors Oran · "Cluster"

> **Source of truth.** When building or reviewing any page, read this file first, then
> check `design-system/pages/<page-name>.md` for overrides (page rules win; otherwise
> Master applies). This reflects the system **as built** in `src/styles.css` +
> `src/components/*`.
>
> **Stack:** Web — TanStack Start (SSR) · React 19 · Tailwind CSS v4 · shadcn/ui.
> **Not React Native** — ignore RN/mobile-only guidance from any design skill.

---

## 1. Concept & posture

Bilingual (FR / AR, LTR + RTL) car-showroom landing page for a premium dealership in Oran,
Algeria. Prices in DZD. Single home page (`/`) + a full-screen vehicle-detail overlay. No
backend; inventory is static (`src/lib/mockData.ts`). Rebrand surface = `src/lib/siteConfig.ts`.

**Posture: the car as a backlit instrument.** Deep petrol surfaces, cool ice readouts, a
tachometer signature, mono "build-sheet" data. Precision and trust over generic luxury. The
identity is drawn from the automotive instrument cluster — deliberately *not* the "near-black +
single warm accent" look this project used before.

---

## 2. Page pattern

**Hero-Centric + Feature-Rich** — `Hero → Features → CTA`, primary CTA above the fold.
`src/routes/index.tsx`: `HeroSection → FeaturedVehicles → ContactCTA` + `VehicleDetailPage` overlay.

---

## 3. Dual-illumination color (oklch tokens — never hardcode hex/rgb)

Dark-first: `:root` and `.dark` are identical. Two illuminations with **assigned jobs** — this
is the system, not decoration. Components reference semantic tokens only.

| Token | oklch | Role |
|---|---|---|
| `background` | `0.20 0.018 202` | petrol base — a hue, not neutral black |
| `foreground` | `0.95 0.006 190` | ice readout text |
| `surface` / `card` | `0.26 0.019 200` | panels |
| `surface-elevated` | `0.30 0.021 200` | raised panels |
| **`needle`** (cool) | `0.77 0.10 196` | **live/interactive**: labels, focus, active/selected, gauge needle, secondary CTA (`outline`) |
| **`gold`** = redline (warm) | `0.78 0.14 68` | **peak/convert**: primary CTA (`gold` variant), price, redline arc, "Réservé" |
| `muted-foreground` | `0.71 0.02 197` | secondary text, gauge track/ticks |
| `whatsapp` | `0.68 0.16 148` | WhatsApp brand green (fixed) |
| `destructive` | `0.62 0.21 25` | errors / "Réservé" |
| `border` / `hairline` / `input` | cool white @ 9% / 6% / 12% | backlit edges |
| `ring` | `needle @ 65%` | focus |

**Rules**
- `--gold` is kept as the **alias for the warm accent** so existing `text-gold`/`bg-gold`/button
  `gold` utilities map onto the redline amber. `--needle` is the cool illumination; use `text-needle`,
  `bg-needle`, `border-needle`.
- **Cool = navigate/inform, warm = convert/peak.** Don't mix: primary CTA amber, secondary/outline
  cyan, WhatsApp green. One warm primary per screen.
- Functional color always carries text/icon too (never color-alone).

---

## 4. Typography

- **Display — Archivo, expanded** (`font-variation-settings: "wdth" 106–112`, weight 700–800):
  nameplate headlines. Loaded as a variable font (`wdth,wght` axes).
- **Body — Archivo** (normal width, 400–600).
- **Data — IBM Plex Mono** (500): odometer / VIN / price / spec **readouts** + all labels.
- **Arabic — Noto Kufi Arabic** (RTL). See §8: Arabic must not inherit Latin tracking/width.

Use the named utilities, not ad-hoc sizes:
`text-display-2xl/xl/lg` · `text-h1/h2/h3` · `text-body-lg/body/body-sm` (Archivo) ·
`text-eyebrow` (mono, cyan, wide-tracked) · `text-caption` (mono caps) ·
`text-data` / `text-odometer` (mono tabular, slashed zero) for numerals.
Numbers/prices/phones: `text-data`/`text-odometer` + `dir="ltr"`.

---

## 5. Spacing, radii, layout

- Spacing 4 / 8 / 16 / 24 / 32 / 48 / 64px. Radii base `0.5rem` → `sm 6 · md 10 · lg 14 · xl 20`
  (cards) `· 2xl 28`. Container `max-w-7xl`, `px-4 sm:px-6 lg:px-8`.
- Mobile-first; verify 375 / 768 / 1024 / 1440. Hero is single-column below `lg`, two-column
  (text + gauge) at `lg+`.
- z-index: navbar `z-50` · mobile drawer `z-40` · detail overlay `z-[70]`.

---

## 6. Effects & motion

- `surface-card` (+`surface-card-hover`: lift + **cyan** border tint). `gold-glow` (amber),
  `needle-glow` (cyan). Shadow scale: `--shadow-card / -elevated / -gold / -needle`. `grain` overlay.
- Motion tokens: easing `cubic-bezier(0.22, 1, 0.36, 1)`; micro 150–320ms; entrances ~400–700ms,
  stagger 80–90ms. Restrained — a few key elements.
- **Reduced motion is handled**: `<MotionConfig reducedMotion="user">` (`__root.tsx`) + a CSS
  media query in `styles.css`. New Framer/CSS motion inherits this automatically.

---

## 7. Signature — the tachometer `Gauge`

`src/components/showroom/Gauge.tsx`. An SVG tach that runs the **ignition needle-sweep**
(0 → redline → settle) on load and lands on a real reading. The cyan needle (with glow) is the
live illumination; the amber redline zone near full-scale is the one warm accent.
- **Hero:** large, reads the live curated stock count (`variant="hero"`).
- Reusable (`variant="spec"`) for any bounded numeric where higher = more.
- Reduced-motion: needle settles instantly, no sweep (via `MotionConfig`).
- **Spend boldness here.** Keep everything else quiet. Specs use a mono build-sheet, not gauges,
  unless the value is genuinely a bounded 0→max reading.

---

## 8. RTL (first-class)

- Logical utilities only: `ms-* me-* ps-* pe-* start-* end-*` — never `left/right`. Directional
  icons flip with `rtl:rotate-180`.
- **Arabic ≠ Latin type:** the display/mono utilities apply Latin width + letter-spacing, which
  break Arabic joins. `styles.css` has **unlayered** `html[dir="rtl"]` overrides that swap headings
  and eyebrow/caption to Noto Kufi and drop tracking/width. Any new tracked/mono label utility must
  be added to that override block.
- Locale drives `dir`/`lang` via `LanguageProvider` (`src/lib/i18n.tsx`). Test every surface FR + AR.

---

## 9. Accessibility baseline (WCAG AA)

- Text ≥ 4.5:1 (≥ 3:1 large/UI). Visible `focus-visible:ring-2 ring-ring` (cyan) on every
  interactive element. Touch targets ≥ 44px. Icon-only controls need `aria-label`.
- Modals: labelled, Escape-closable, focus trapped + moved in on open + restored on close;
  `inert` the drawer when closed. Respect reduced motion. SVG signatures need a text `aria-label`.

---

## 10. Anti-patterns (reject on sight)

- Hardcoded hex/rgb in components (tokens only) · using amber where cyan belongs or vice-versa
  (respect the cool/warm split) · a second warm primary CTA on a screen · 3D/WebGL/hyperrealism ·
  emoji as icons · Latin letter-spacing/width on Arabic · `left/right` instead of logical props ·
  gauges forced onto non-bounded data · motion with no reduced-motion fallback · placeholder-as-label.
