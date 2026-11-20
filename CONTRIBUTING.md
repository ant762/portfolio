# Contributing

Thanks for taking the time to improve this project.

## Workflow

1. Fork/branch from `main` (`feat/…`, `fix/…`, `docs/…`).
2. `npm install` and `npm run dev`.
3. Make focused changes. Content changes go in `src/data/`.
4. Run `npm run check` and `npm run build` — both must pass.
5. Open a pull request using the template. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Code standards

- TypeScript strict; no `any`. Prefer small, typed, composable components.
- Formatting is enforced by Prettier (`npm run format`), linting by ESLint.
- Animations must respect `prefers-reduced-motion` and clean up after themselves (`useGSAP` with a `scope`).
- Keep the site usable without JavaScript animation: content should never be permanently hidden.

## Reporting issues

Use the issue templates. For visual/animation bugs include browser, OS, viewport size and (if possible) a short screen recording.
