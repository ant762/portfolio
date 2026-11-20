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
| `Hero`         | Char-by-char reveal, scrubbed exit parallax over the site-wide `Atmosphere`                   |
| `Work`         | `pin` + `scrub` horizontal track; per-card parallax via `containerAnimation`; mobile fallback |
| `About`        | Word-by-word opacity scrub, count-up stats                                                    |
| `Professional` | Timeline rows, GitHub block, stack list read from `package.json`, practices                   |
| `Contact`      | Word reveal, elastic CTA, magnetic button, copy-to-clipboard                                  |

## WebGL atmosphere

`src/components/webgl/Atmosphere.tsx` is a fixed full-screen canvas (`-z-20`) rendered by one fragment
shader: fbm fog, two parallax layers of pointed arches, a rotating rose window, rising embers. Interaction
is fed through uniforms: a 14-point cursor trail (`uTrail`), up to 4 click shockwaves (`uRipples`), pointer
"energy" and page scroll. With no input (touch devices) a ghost light wanders on its own. It fades in on
`useSiteReady()`, pauses when the tab is hidden, caps pixel ratio at 1 and renders one static frame under
`prefers-reduced-motion`. Do not give `body` a background — it would cover the canvas.

## Internationalisation

Client-side i18n (no per-language URLs): `src/i18n/store.ts` is a module store read with
`useSyncExternalStore` (server snapshot is always `en`, so hydration never mismatches). `LocaleSync` applies
the saved/browser language after hydration, keeps `<html lang>` in sync and calls `ScrollTrigger.refresh()`.
UI strings live in `src/i18n/dictionaries.ts` (the `en` object defines the type; `tests/i18n.test.ts` asserts
all locales share the same keys). Project copy: English in `src/data/projects.ts`, `es`/`pt` in
`src/i18n/projects.ts`, merged by `localizeProject`. Trade-off: crawlers only see English.

## Sound

`src/lib/sound.ts` synthesises everything with Web Audio — no audio assets. Darkwave loop: 96 BPM,
Am–F–C–E, sawtooth bass, detuned pads, delayed arpeggio, kick/snare/hats, convolver reverb and a compressor,
driven by a look-ahead scheduler. SFX: click, hover, whoosh (route transitions), hit (menu), on/off.
`SoundControls` exposes two independent switches (music; effects + clicks), both **on by default (started from the preloader "Enter" gesture)** and
persisted in `localStorage` (`ant762:sound`). Browsers only allow audio after a gesture, so `SoundProvider`
calls `unlockAudio()` on the first pointer/key event. Audio suspends while the tab is hidden.

## Content layer

`src/data/projects.ts` is the single source of truth. Routes (`generateStaticParams`), sitemap, sections
and tests are all derived from it. `tests/data.test.ts` verifies slugs, links and that referenced images exist.

## Performance notes

- Source images are WebP (≈3 MB total); `next/image` serves AVIF/WebP at the requested size.
- three.js is loaded in a separate, client-only chunk.
- All animation code is client-side but the HTML (including the text content) is server-rendered for SEO.
