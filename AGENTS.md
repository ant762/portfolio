# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in this repository.
Humans: see [`README.md`](README.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## What this is

Personal portfolio: Next.js (App Router) + TypeScript (strict) + Tailwind v4 + GSAP/Lenis + a three.js shader.
Content lives in `src/data/`; presentation lives in `src/components/`.

## Commands (run before you finish)

```bash
npm run check      # prettier --check, eslint, tsc --noEmit, vitest
npm run build      # must pass; also type-checks and prerenders every route
```

Never leave the tree failing `npm run check`. Run `npm run format` to fix formatting.

## Rules

1. **Content is data.** Add/edit projects only in `src/data/projects.ts`; site info in `src/data/site.ts`. Do not hard-code project copy in components.
   User-visible text goes through `useI18n()` and `src/i18n/dictionaries.ts` (en/es/pt); project translations live in `src/i18n/projects.ts`.
2. **TypeScript strict.** No `any`, no `// @ts-ignore`. Use `import type` for types. Indexed access returns `T | undefined` — handle it.
3. **Server vs client.** Components are server components by default. Add `'use client'` only when you need state, effects, refs or browser APIs (all animation components do).
4. **Animation conventions** (see `docs/architecture.md`):
   - Import GSAP only through `@/lib/gsap` (plugins are registered there).
   - Animate inside `useGSAP(..., { scope })` so tweens/ScrollTriggers are reverted on unmount. Never leave global listeners without cleanup.
   - Gate entrance animations on `useSiteReady()`; set the hidden state while `!ready`, play when `ready`.
   - Always respect `prefersReducedMotion()` — content must be fully visible and usable without animation.
   - **Never put a CSS `transition-transform` on an element GSAP animates with `x/y/xPercent/yPercent`** (the two fight and the element lags). Put the CSS hover effect on an inner wrapper.
   - Use `matchMedia` (`gsap.matchMedia`) for desktop-only pinning; mobile falls back to a vertical layout.
5. **Navigation.** Use `TransitionLink` (not `next/link`) for in-app links so the page transition runs. External links use `<a target="_blank" rel="noopener noreferrer">`.
6. **Scroll.** Use `scrollToTarget`, `lockScroll`/`unlockScroll` from `@/lib/scroll`. Do not call `window.scrollTo` directly when Lenis is active.
7. **Images.** Use `next/image` with `fill` + `sizes`. Store assets as WebP in `public/images/`. Every image needs meaningful `alt` (decorative → `alt=""`).
8. **Styling.** Tailwind utilities + the tokens/utilities in `src/app/globals.css` (`text-display-*`, `label-mono`, `px-gutter`, colors `ink`, `paper`, `accent`). Prefer extending tokens over one-off values. Custom utilities must be defined with `@utility` to work with variants.
9. **Accessibility.** Keep semantic landmarks, visible focus, `aria-label`s on icon-only controls, and the skip link.
10. **Sound.** Never autoplay. Audio is procedural (`src/lib/sound.ts`), off by default, and must stay controllable through `SoundControls`. New interactions can call `playSfx()`.
11. **Background.** The site-wide WebGL canvas sits at `-z-20`; do not add a `background` to `body` or full-width sections that would hide it.
12. **Tests.** Add Vitest tests under `tests/` for new pure logic or data invariants.

## Gotchas

- `useSiteReady()` is `false` until the preloader/route transition finishes. Hooks that compute layout (ScrollTrigger pins) should tolerate being created before and refreshed after (`ScrollTrigger.refresh()` is called after fonts load and after route transitions).
- The `Atmosphere` shader is dynamically imported with `ssr: false`; if WebGL is unavailable the container's CSS background remains.
- When testing a production build locally, stop any previous `next start` first — a stale server pointing at a rebuilt `.next` returns 500 for assets.

## Commit style

Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`). Keep commits focused.
