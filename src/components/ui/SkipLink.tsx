'use client';

import { useI18n } from '@/i18n/useI18n';

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="label-mono bg-accent text-on-accent fixed top-3 left-3 z-[300] -translate-y-20 rounded-full px-4 py-2 focus:translate-y-0"
    >
      {t.ui.skip}
    </a>
  );
}
