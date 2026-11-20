import type { Project, ProjectCategory } from '@/types';

export const projects: readonly Project[] = [
  {
    slug: 'personal-portfolio',
    category: 'programming',
    title: 'ant762.dev',
    headline: 'This Website',
    summary: 'A live test bench for modern web development.',
    description:
      'This site is the project. It was built to test the limits of modern web development: a site-wide WebGL shader, inertial scrolling, scroll-driven GSAP animation, route transitions, procedural audio, three languages and a typed content layer. Below you can read how each part works and play with small interactive experiments.',
    tags: ['Next.js', 'TypeScript', 'GSAP', 'three.js', 'Web Audio'],
    cover: '/images/webs.webp',
    detail: '/images/webs.webp',
    links: [{ label: 'Source on GitHub', href: 'https://github.com/ant762/portfolio' }],
    playground: true,
  },
];

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Próximo projeto na ordem global (circular). */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  if (!next) throw new Error(`Project not found: ${slug}`);
  return next;
}
