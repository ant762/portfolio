export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'ant762:locale';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** "pt-BR" → "pt"; devolve undefined se não houver suporte. */
export function matchLocale(tag: string | undefined | null): Locale | undefined {
  const base = tag?.toLowerCase().split('-')[0];
  return isLocale(base) ? base : undefined;
}
