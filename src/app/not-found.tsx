'use client';

import { TransitionLink } from '@/components/ui/TransitionLink';
import { useI18n } from '@/i18n/useI18n';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="px-gutter flex min-h-svh flex-col items-start justify-center gap-8">
      <p className="label-mono text-accent">{t.notFound.error}</p>
      <h1 className="text-display-xl font-bold uppercase">{t.notFound.title}</h1>
      <p className="text-paper/70 max-w-md text-xl">{t.notFound.text}</p>
      <TransitionLink
        href="/"
        label={t.ui.home}
        className="label-mono bg-accent text-on-accent rounded-full px-6 py-3 transition-transform hover:scale-105"
      >
        {t.notFound.back}
      </TransitionLink>
    </section>
  );
}
