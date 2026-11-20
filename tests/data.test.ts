import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getNextProject, getProject, getProjectsByCategory, projects } from '@/data/projects';
import { socials } from '@/data/site';

const publicDir = join(process.cwd(), 'public');

describe('projects', () => {
  it('slugs são únicos e seguros para URL', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it.each(projects.map((p) => [p.slug, p] as const))(
    '%s tem dados e imagens válidos',
    (_slug, p) => {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(20);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(existsSync(join(publicDir, p.cover))).toBe(true);
      expect(existsSync(join(publicDir, p.detail))).toBe(true);
      for (const link of p.links) expect(link.href).toMatch(/^https:\/\//);
    },
  );

  it('mantém só o projeto deste site com a seção playground', () => {
    expect(projects.map((p) => p.slug)).toEqual(['personal-portfolio']);
    expect(getProject('personal-portfolio')?.playground).toBe(true);
    expect(getProjectsByCategory('programming')).toHaveLength(1);
  });

  it('getProject e getNextProject funcionam de forma circular', () => {
    expect(getProject('inexistente')).toBeUndefined();
    const last = projects[projects.length - 1]!;
    expect(getNextProject(last.slug).slug).toBe(projects[0]!.slug);
  });
});

describe('socials', () => {
  it('inclui o LinkedIn', () => {
    const linkedin = socials.find((s) => s.label === 'LinkedIn');
    expect(linkedin?.href).toContain('linkedin.com/in/maik-antunes');
  });
});

describe('skills e redes (fonte: README do GitHub)', () => {
  it('grupos de skills não têm itens vazios nem repetidos dentro do grupo', async () => {
    const { skillGroups } = await import('@/data/site');
    expect(skillGroups.length).toBe(5);
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0);
      expect(new Set(group.items).size).toBe(group.items.length);
      for (const item of group.items) expect(item.trim()).not.toBe('');
    }
  });

  it('links sociais são https e incluem GitHub e LinkedIn (sem Discord/Instagram)', () => {
    const hrefs = socials.map((s) => s.href);
    expect(hrefs).toContain('https://github.com/ant762');
    expect(hrefs.some((h) => h.includes('linkedin.com/in/maik-antunes'))).toBe(true);
    expect(hrefs.some((h) => /discord|instagram/.test(h))).toBe(false);
  });

  it('não lista PHP e inclui a stack usada neste site', async () => {
    const { skillGroups } = await import('@/data/site');
    const all = skillGroups.flatMap((g) => g.items);
    expect(all).not.toContain('PHP');
    for (const tech of ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'GSAP', 'Three.js']) {
      expect(all).toContain(tech);
    }
  });
});
