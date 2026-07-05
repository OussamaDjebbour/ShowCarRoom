# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (French / Arabic) **car showroom landing page** — a pitch prototype
for a dealership in Oran, Algeria. Prices are in Algerian Dinars (DZD). The whole
app is a single home page (`/`) with a state-toggled vehicle-detail overlay; there
is no backend and inventory is static mock data. It is designed to be **rebranded
for a new dealership in minutes** by editing `src/lib/siteConfig.ts` (contact info,
nav, bilingual copy) and `src/lib/mockData.ts` (inventory).

## Commands

Package manager is **bun** (`bun.lock` and `bunfig.toml` are the tracked, canonical
lockfiles — a stray untracked `pnpm-lock.yaml` should be ignored / not committed).

```bash
bun install            # install deps (bunfig enforces a 24h supply-chain guard)
bun run dev            # vite dev server
bun run build          # production build (nitro → Cloudflare target by default)
bun run build:dev      # build in development mode
bun run preview        # preview the production build
bun run lint           # eslint .
bun run format         # prettier --write .
bunx tsc --noEmit      # typecheck (no dedicated script; tsconfig already has noEmit)
```

There is **no test runner configured** — do not invent a `bun test`/`vitest` command.

## Framework & build (read before touching config)

- **TanStack Start** (SSR React framework) on **React 19**, **Vite 8**, **Tailwind CSS v4**.
- `vite.config.ts` extends `@lovable.dev/vite-tanstack-config`, which **already bundles**
  tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, the `@` path alias, dedupe,
  and error/dev plugins. **Do not add these plugins manually** — duplicates break the app.
- SSR entry is redirected to `src/server.ts` via `tanstackStart.server.entry`. `src/server.ts`
  and `src/start.ts` are error-handling wrappers that catch SSR failures (including h3-swallowed
  500s) and render `src/lib/error-page.ts` instead of leaking a raw error.

## Lovable connection (git constraints)

This repo is connected to [Lovable](https://lovable.dev) (see `AGENTS.md`). Commits pushed to
the connected branch sync back into the Lovable editor, so:
- **Never rewrite published history** — no force-push, rebase, amend, or squash of pushed commits.
- Keep the branch in a working state after each push.

## Architecture

- **Routing** — file-based under `src/routes/` (see `src/routes/README.md` for conventions; these
  are TanStack, *not* Next.js/Remix). `routeTree.gen.ts` is auto-generated — never edit by hand.
  `__root.tsx` is the only app shell: it mounts `QueryClientProvider` → `LanguageProvider` →
  `RootLayout` (Navbar/Footer) → `<Outlet/>`, plus the 404 and error boundaries. Preserve `<Outlet/>`.
- `src/router.tsx` — `getRouter()` builds the router with a per-request `QueryClient` in context.
- **`src/lib/` is the domain layer:**
  - `siteConfig.ts` — single source of truth for dealership strings, nav, and **all bilingual copy**
    (`translations.fr` / `translations.ar`). Components import copy from here, not inline literals.
  - `i18n.tsx` — `LanguageProvider` + `useLanguage()`. Locale (`fr`/`ar`) persists to `localStorage`
    (`showroom.locale`) and drives `dir`/`lang` on `<html>`. SSR renders the default (`fr`) then
    hydrates from storage, so keep server output deterministic (don't read `localStorage` during render).
  - `vehicles.ts` — the `Vehicle` type and `formatPriceDzd` / `formatMileage` locale-aware formatters.
  - `mockData.ts` — seed inventory (keep 3–8 entries; the grid is tuned for that).
- **Components** — `src/components/showroom/*` are the feature components (VehicleCard, HeroSection,
  ContactCTA, WhatsAppButton, …); `src/components/ui/*` are shadcn/ui primitives (new-york style, do
  not hand-rewrite — regenerate via the CLI). `src/layout/*` is the page chrome.

## Conventions

- **Styling: never hardcode hex/rgb in components.** All colors are semantic oklch tokens defined in
  `src/styles.css` (Tailwind v4 `@theme`), including brand tokens `--gold` and `--whatsapp`. Use
  semantic classes (`bg-background`, `text-gold`, …).
- **RTL is first-class.** Use Tailwind *logical* utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`,
  `end-*`) rather than left/right so Arabic layout and the Arabic font swap work automatically.
- **`@/` maps to `src/`.** Prefer it over deep relative imports.
- **No `server-only` package** — ESLint blocks it. TanStack Start uses `*.server.ts` filenames or
  `@tanstack/react-start/server-only` instead.
- Prettier: 100-col, semicolons, **double quotes**, trailing commas everywhere. Run `bun run format`.
