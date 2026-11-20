import type { SocialLink } from '@/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ant762.page.gd';

export const site = {
  name: 'ant762',
  firstName: 'Maik',
  handle: 'ant762',
  role: 'Fullstack Developer',
  title: 'ant762 — Fullstack Developer & Level Designer',
  tagline: 'Transforming your ideas into high-impact experiences.',
  description:
    'Systems Development Technician focused on robust, logical and complex solutions with intuitive interfaces. Specialist in Luau, JavaScript, Node.js and Level Design.',
  about:
    'Systems Development Technician focused on creating robust, logical and complex solutions with intuitive interfaces. I turn technical requirements into high-performance digital experiences with modern design — from gameplay systems in Luau to full-stack platforms and cinematic environments.',
  location: 'Brazil',
  timezone: 'America/Sao_Paulo',
  email: 'maik.antunes07@gmail.com',
  availability: 'Available for new challenges',
  ogImage: '/images/A2.webp',
} as const;

export const socials: readonly SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maik-antunes-6062aa355/',
    handle: 'Connect on LinkedIn',
  },
  { label: 'GitHub', href: 'https://github.com/ant762', handle: '@ant762' },
  { label: 'Discord', href: 'https://discord.gg/EnuYKVdGru', handle: 'Join the server' },
  { label: 'Email', href: `mailto:${site.email}`, handle: site.email },
];

export const skills = [
  'Luau',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'C',
  'MySQL',
  'CSS',
  'Web Design',
  'Level Design',
] as const;

export const navLinks = [
  { key: 'work', href: '/#work' },
  { key: 'environments', href: '/#environments' },
  { key: 'about', href: '/#about' },
  { key: 'professional', href: '/#professional' },
  { key: 'contact', href: '/#contact' },
] as const;
