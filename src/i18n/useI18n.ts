'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from './config';
import { dictionaries, type Dictionary } from './dictionaries';
import { getLocaleServerSnapshot, getLocaleSnapshot, setLocale, subscribeLocale } from './store';

export function useI18n(): { locale: Locale; t: Dictionary; setLocale: typeof setLocale } {
  const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getLocaleServerSnapshot);
  return { locale, t: dictionaries[locale], setLocale };
}
