'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { getLocaleSnapshot, initLocale, subscribeLocale } from '@/i18n/store';

/** Aplica o idioma salvo/do navegador, mantém <html lang> e recalcula o layout. */
export function LocaleSync() {
  useEffect(() => {
    document.documentElement.lang = getLocaleSnapshot();
    const unsubscribe = subscribeLocale(() => {
      document.documentElement.lang = getLocaleSnapshot();
      // Textos mudam de tamanho: recalcula pins/triggers depois do React pintar.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    initLocale();
    return unsubscribe;
  }, []);

  return null;
}
