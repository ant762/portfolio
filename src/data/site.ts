import type { Credential, SocialLink } from '@/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ant762.page.gd';

export const site = {
  name: 'Maik Antunes',
  handle: 'ant762',
  role: 'Fullstack Developer',
  title: 'Maik Antunes — Fullstack Developer & Level Designer',
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
    handle: 'maik-antunes',
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

export const credentials: readonly Credential[] = [
  { label: 'Education', detail: 'Technical Degree in Systems Development' },
  { label: 'Experience', detail: 'Security Infrastructure Intern' },
  { label: 'Certification', detail: 'Scrum Certified' },
  { label: 'Certification', detail: 'ITIL 4 Foundation' },
  { label: 'Languages', detail: 'English, Spanish and Portuguese' },
];

export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Environments', href: '/#environments' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;
