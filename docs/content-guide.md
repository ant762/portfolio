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

3. `npm test` validates slugs, links and image paths. `npm run dev` to preview.

## Edit site info

`src/data/site.ts` holds name, tagline, about text, email, social links (including LinkedIn), skills and credentials.
