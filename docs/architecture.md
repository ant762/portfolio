# Architecture

## Overview

```
RootLayout (server)
└─ SmoothScroll        Lenis ⇄ gsap.ticker ⇄ ScrollTrigger
   └─ TransitionProvider   route-cover overlay + navigate()
      ├─ Preloader         first-load intro, flips "site ready"
      ├─ Cursor            custom cursor (fine pointers only)
      ├─ Navbar            hide-on-scroll header + fullscreen menu
      └─ <main>            page content (sections / project view)
```

## The "site ready" signal

`src/lib/ready.ts` is a tiny external store (consumed with `useSyncExternalStore` via `useSiteReady()`).

| Event                             | Value   |
| --------------------------------- | ------- |
| Initial render                    | `false` |
| Preloader exit animation midpoint | `true`  |
| Route transition starts (cover)   | `false` |
| Route transition reveals new page | `true`  |

Sections use it like this:

```ts
useGSAP(
  () => {
    if (!ready) {
      gsap.set(targets, hiddenState);
      return;
    } // prepare while covered
    gsap.to(targets, { ...visibleState }); // play when the stage is visible
  },
  { scope, dependencies: [ready] },
);
```

Because the preloader / transition overlay is opaque while `ready === false`, setting the hidden state
after hydration never causes a visible flash.

## Scrolling

`SmoothScroll` creates one Lenis instance, stores it in `src/lib/scroll.ts` and drives it from
`gsap.ticker`. Everything else goes through that module:

- `lockScroll(reason)` / `unlockScroll(reason)` — named locks (`preloader`, `menu`, `transition`); scroll is locked while any lock is held.
- `scrollToTarget(target, opts)` — Lenis when available, native smooth scroll otherwise (reduced motion).

## Route transitions

`TransitionProvider.navigate(href, { label })`:

1. Same pathname → just scroll (to the hash or top).
2. Different pathname → lock scroll, set `ready=false`, animate bars up (showing `label`), then `router.push`.
3. When `usePathname()` changes → reset scroll to top (or the requested hash), `ScrollTrigger.refresh()`, set `ready=true`, animate bars away.
4. A 4 s safety timer reveals the page if the route never changes.

`TransitionLink` wraps `next/link` and calls `navigate` (modifier-clicks keep native behaviour).

## Sections

| Section        | Technique                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------- |
| `Hero`         | Char-by-char reveal, avatar pill growth, scrubbed exit parallax, `HeroCanvas` shader          |
| `Marquee`      | Two infinite rows; ScrollTrigger velocity changes `timeScale` and direction                   |
| `Work`         | `pin` + `scrub` horizontal track; per-card parallax via `containerAnimation`; mobile fallback |
| `Environments` | Row reveals; cursor-following preview with `quickTo` + velocity tilt; touch thumbnails        |
| `About`        | Word-by-word opacity scrub, count-up stats                                                    |
| `Credentials`  | Line-draw + text mask reveals, hover fill                                                     |
| `Contact`      | Word reveal, elastic CTA, magnetic button, copy-to-clipboard                                  |

## WebGL hero

`src/components/webgl/HeroCanvas.tsx` renders one full-screen triangle-pair with a fragment shader:
simplex noise → height field → anti-aliased contour lines (`fwidth`). Uniforms: time, pointer (lerped),
pointer "energy" (speed), hero scroll progress. It pauses when off-screen or when the tab is hidden,
caps pixel ratio at 1.5 and renders a single static frame under `prefers-reduced-motion`.

## Content layer

`src/data/projects.ts` is the single source of truth. Routes (`generateStaticParams`), sitemap, sections
and tests are all derived from it. `tests/data.test.ts` verifies slugs, links and that referenced images exist.

## Performance notes

- Source images are WebP (≈3 MB total); `next/image` serves AVIF/WebP at the requested size.
- three.js is loaded in a separate, client-only chunk.
- All animation code is client-side but the HTML (including the text content) is server-rendered for SEO.
