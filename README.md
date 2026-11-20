# ant762.dev — Portfolio

Personal portfolio of **ant762** — Fullstack Developer & Level Designer.
Rebuilt from a static HTML/CSS/JS site into a **Next.js + TypeScript** application with a WebGL hero,
inertial scrolling, scroll-driven GSAP animation and animated route transitions.

[![CI](https://github.com/ant762/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ant762/portfolio/actions/workflows/ci.yml)

**Links:** [GitHub](https://github.com/ant762) · [LinkedIn](https://www.linkedin.com/in/maik-antunes-6062aa355/) · [Email](mailto:maik.antunes07@gmail.com)

## Highlights

- **Preloader** with progress counter and curved exit transition
- **Gothic WebGL atmosphere** (red / black / grey) behind the whole site — fog, parallax pointed arches, a rotating rose window, rising embers, a blood-red cursor trail and click shockwaves
- **Procedural darkwave soundtrack + sound effects** (Web Audio, no audio files). Music and effects/clicks have independent toggles; both default to off
- **English, Spanish and Portuguese** (`EN / ES / PT`), detected from the browser and remembered
- **Smooth scrolling** (Lenis) wired into GSAP's ticker and ScrollTrigger
- **Pinned horizontal showcase** for code projects, with per-card image parallax
- **Editorial environment list** with a cursor-following, velocity-tilted preview
- **Route transitions** — staggered bars cover the screen while Next.js swaps the page
- **Custom cursor** with contextual labels (`data-cursor="View"`), magnetic buttons, scroll-velocity marquee
- Statically generated project pages (`/projects/[slug]`), typed content layer, SEO (metadata, Open Graph, JSON-LD, sitemap, robots)
- Accessible by default: skip link, semantic landmarks, `prefers-reduced-motion` support, keyboard-friendly menu

## Stack

| Area      | Tools                                            |
| --------- | ------------------------------------------------ |
| Framework | Next.js (App Router, Turbopack), React 19        |
| Language  | TypeScript (strict, `noUncheckedIndexedAccess`)  |
| Styling   | Tailwind CSS v4 (design tokens in `globals.css`) |
| Motion    | GSAP + ScrollTrigger, `@gsap/react`, Lenis       |
| WebGL     | three.js (single full-screen shader)             |
| Quality   | ESLint, Prettier, Vitest, GitHub Actions         |

## Getting started

Requirements: Node.js `>= 20.9` (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build                             |
| `npm start`         | Serve the production build                   |
| `npm run lint`      | ESLint                                       |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm test`          | Vitest (content integrity + utilities)       |
| `npm run format`    | Prettier (write)                             |
| `npm run check`     | Format check + lint + typecheck + tests (CI) |

Copy `.env.example` to `.env.local` to override `NEXT_PUBLIC_SITE_URL`.

## Project structure

```
src/
├── app/                  # Routes, layout, metadata, sitemap, robots
│   └── projects/[slug]/  # Statically generated project pages
├── components/
│   ├── layout/           # Preloader, Navbar (+ fullscreen menu)
│   ├── providers/        # SmoothScroll (Lenis), TransitionProvider, LocaleSync, SoundProvider
│   ├── sections/         # Hero, Marquee, Work, Environments, About, Professional, Contact
│   ├── project/          # Project page view
│   ├── ui/               # Cursor, Magnetic, SplitWords, TransitionLink, SoundControls, LanguageSwitcher
│   └── webgl/            # Atmosphere (three.js shader, site-wide background)
├── data/                 # Typed content: site.ts, projects.ts
├── hooks/                # useSiteReady, useLocalTime, useSound
├── i18n/                 # Locale store, dictionaries (en/es/pt), localized project copy
├── lib/                  # gsap setup, scroll lock/Lenis bridge, ready store, sound engine, utils
└── types/                # Shared domain types
tests/                    # Vitest suites
docs/                     # Architecture & animation notes
```

See [`docs/architecture.md`](docs/architecture.md) for how the animation pipeline fits together and
[`docs/content-guide.md`](docs/content-guide.md) for adding projects.

## Adding a project

Add an entry to [`src/data/projects.ts`](src/data/projects.ts) and drop the images in `public/images/`
(WebP recommended). The home page, project route, sitemap and tests pick it up automatically.

## Deployment

Any Next.js-compatible host works (Vercel, Netlify, Cloudflare, a Node server). Set
`NEXT_PUBLIC_SITE_URL` to the production origin so canonical URLs, Open Graph and the sitemap are correct.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). AI coding agents should read [`AGENTS.md`](AGENTS.md) first.
