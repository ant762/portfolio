import { defaultLocale, isLocale, LOCALE_STORAGE_KEY, matchLocale, type Locale } from './config';

let current: Locale = defaultLocale;
const listeners = new Set<() => void>();

export const getLocaleSnapshot = (): Locale => current;
export const getLocaleServerSnapshot = (): Locale => defaultLocale;

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setLocale(next: Locale): void {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* armazenamento indisponível: a preferência vale só nesta sessão */
  }
  listeners.forEach((listener) => listener());
}

/** Lê preferência salva (ou idioma do navegador). Chamar só no cliente, após hidratar. */
export function initLocale(): void {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const next = isLocale(saved)
    ? saved
    : (navigator.languages.map(matchLocale).find(Boolean) ?? defaultLocale);
  setLocale(next);
}
