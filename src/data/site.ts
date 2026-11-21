import type { SocialLink } from '@/types';

// Prévia (Discord/WhatsApp) exige og:image com URL absoluta do domínio real:
// usa a variável explícita, senão o domínio de produção da Vercel, senão o padrão.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : 'https://ant762.page.gd');

export const site = {
  name: 'ant762',
  firstName: 'Maik',
  handle: 'ant762',
  role: 'Fullstack Developer',
  title: 'ant762 — Fullstack Developer',
  tagline: 'Fullstack developer, IT infrastructure and game development.',
  description:
    'Fullstack developer working across backend, frontend, IT infrastructure and game development (LuaU). Node.js, Python, MySQL and more.',
  location: 'Brazil',
  timezone: 'America/Sao_Paulo',
  email: 'maik.antunes07@gmail.com',
  ogImage: '/og.jpg',
} as const;

export const socials: readonly SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maik-antunes-6062aa355/',
    handle: 'Connect on LinkedIn',
  },
  { label: 'GitHub', href: 'https://github.com/ant762', handle: '@ant762' },
  { label: 'Email', href: `mailto:${site.email}`, handle: site.email },
];

export type SkillGroupKey = 'backend' | 'frontend' | 'game' | 'infra' | 'tools';

/** Fonte: README do perfil github.com/ant762 + as tecnologias usadas neste site (frontend/tools). */
export const skillGroups: readonly { key: SkillGroupKey; items: readonly string[] }[] = [
  { key: 'backend', items: ['Node.js', 'Python', 'MySQL', 'C', 'C++', 'C#', 'Lua'] },
  {
    key: 'frontend',
    items: [
      'JavaScript',
      'TypeScript',
      'HTML',
      'CSS',
      'Next.js',
      'React',
      'Tailwind CSS',
      'GSAP',
      'Three.js',
      'Lenis',
    ],
  },
  { key: 'game', items: ['LuaU', 'Game Design'] },
  {
    key: 'infra',
    items: [
      'Virtual Machines',
      'Ubuntu Server',
      'Network Devices',
      'Network Protocols',
      'Cisco Networking Basics',
      'Wireshark',
      'Cloudflare',
    ],
  },
  {
    key: 'tools',
    items: [
      'Git',
      'Photoshop',
      'Premiere',
      'Notion',
      'Figma',
      'VS Code',
      'GitHub',
      'Red Hat',
      'ESLint',
      'Prettier',
      'Vitest',
    ],
  },
];

/** Tecnologias principais (tudo exceto "tools") — usadas no marquee. */
export const skills: readonly string[] = skillGroups
  .filter((g) => g.key !== 'tools')
  .flatMap((g) => g.items);

export const allSkillsCount = new Set(skillGroups.flatMap((g) => g.items)).size;

export const navLinks = [
  { key: 'work', href: '/#work' },
  { key: 'about', href: '/#about' },
  { key: 'professional', href: '/#professional' },
  { key: 'contact', href: '/#contact' },
] as const;
