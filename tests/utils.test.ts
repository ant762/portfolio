import { describe, expect, it } from 'vitest';
import { clamp, cn, formatTime, isExternal, padIndex } from '@/lib/utils';

describe('utils', () => {
  it('clamp limita o valor ao intervalo', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });

  it('padIndex completa com zeros', () => {
    expect(padIndex(1)).toBe('01');
    expect(padIndex(12)).toBe('12');
    expect(padIndex(7, 3)).toBe('007');
  });

  it('cn ignora valores falsos', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('isExternal detecta links externos e mailto', () => {
    expect(isExternal('https://github.com/ant762')).toBe(true);
    expect(isExternal('mailto:a@b.c')).toBe(true);
    expect(isExternal('/projects/x')).toBe(false);
    expect(isExternal('/#work')).toBe(false);
  });

  it('formatTime respeita o fuso horário', () => {
    const date = new Date('2026-01-01T15:00:00Z');
    expect(formatTime(date, 'America/Sao_Paulo')).toBe('12:00');
    expect(formatTime(date, 'UTC')).toBe('15:00');
  });
});
