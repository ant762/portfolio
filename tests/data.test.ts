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

  it('separa programação e ambientes', () => {
    expect(getProjectsByCategory('programming').length).toBeGreaterThan(0);
    expect(getProjectsByCategory('environment').length).toBeGreaterThan(0);
    expect(
      getProjectsByCategory('programming').length + getProjectsByCategory('environment').length,
    ).toBe(projects.length);
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
