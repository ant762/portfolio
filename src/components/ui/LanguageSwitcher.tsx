'use client';

import { locales, localeNames } from '@/i18n/config';
import { useI18n } from '@/i18n/useI18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      role="group"
      aria-label={t.ui.language}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={locale === code}
          aria-label={localeNames[code]}
          onClick={() => setLocale(code)}
          className="py-1 uppercase transition-opacity hover:opacity-100 aria-[pressed=false]:opacity-55"
        >
          {code}
        </button>
      ))}
    </div>
  );
}
