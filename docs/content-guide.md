# Content guide

## Add a project

1. Export two images (cover + detail, ~16:10, WebP, ≤ 2000 px wide) into `public/images/`.
   If you only have one image, point `cover` and `detail` at the same file — the detail block is skipped.
2. Append an entry to `projects` in `src/data/projects.ts`:

```ts
{
  slug: 'my-project',                 // lowercase-kebab, unique, becomes /projects/my-project
  category: 'programming',            // 'programming' → horizontal showcase, 'environment' → list
  title: 'My Project',                // short title (cards/lists)
  headline: 'My Project: Long Title', // page title
  summary: 'One line.',
  description: 'Full description…',
  tags: ['Luau', 'Systems'],
  cover: '/images/my-project-1.webp',
  detail: '/images/my-project-2.webp',
  links: [{ label: 'Source on GitHub', href: 'https://github.com/…' }],
}
```

3. Add its Spanish and Portuguese copy (headline, summary, description) under the same slug in `src/i18n/projects.ts`.
4. `npm test` validates slugs, links, image paths and that every project is translated. `npm run dev` to preview.

## Edit site info

`src/data/site.ts` holds name, tagline, about text, email, social links (including LinkedIn), skill groups (`skillGroups`).
Interface text (all languages) lives in `src/i18n/dictionaries.ts`; career entries are in its `professional.timeline`.

**Source of truth for profile data:** the README of github.com/ant762 (skills, experience, education, social links). Do not add certifications, languages or roles that are not published there. Roblox projects and level-design studies are kept as extras.
