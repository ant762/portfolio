import { describe, expect, it } from 'vitest';
import { locales } from '@/i18n/config';
import { dictionaries } from '@/i18n/dictionaries';
import { localizeProject, projectCopy } from '@/i18n/projects';
import { projects } from '@/data/projects';

/** Lista os caminhos de todas as folhas string de um objeto. */
function leaves(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return [path];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe('i18n', () => {
  it('has the same keys in every locale', () => {
    const base = leaves(dictionaries.en).sort();
    for (const locale of locales) {
      expect(leaves(dictionaries[locale]).sort(), locale).toEqual(base);
    }
  });

  it('has no empty UI strings (except intentionally empty timeline fields)', () => {
    for (const locale of locales) {
      const t = dictionaries[locale];
      expect(t.hero.tagline.length).toBeGreaterThan(0);
      expect(t.about.text.length).toBeGreaterThan(0);
    }
  });

  it('translates every project into es and pt', () => {
    for (const locale of ['es', 'pt'] as const) {
      for (const project of projects) {
        const copy = projectCopy[locale][project.slug];
        expect(copy, `${locale}:${project.slug}`).toBeDefined();
        expect(copy?.headline).toBeTruthy();
        expect(copy?.summary).toBeTruthy();
        expect(copy?.description).toBeTruthy();
      }
    }
  });

  it('localizeProject returns the original for en and keeps slug/images', () => {
    const first = projects[0];
    if (!first) throw new Error('no projects');
    expect(localizeProject(first, 'en')).toBe(first);
    const pt = localizeProject(first, 'pt');
    expect(pt.slug).toBe(first.slug);
    expect(pt.cover).toBe(first.cover);
    expect(pt.description).not.toBe(first.description);
  });
});
