'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { getProjectsByCategory } from '@/data/projects';
import { useI18n } from '@/i18n/useI18n';
import { localizeProject } from '@/i18n/projects';
import { prefersReducedMotion, reveal, useGSAP } from '@/lib/gsap';

const baseWorks = getProjectsByCategory('programming');

/** Trabalhos selecionados: hoje só este site. Novos projetos entram em `src/data/projects.ts`. */
export function Work() {
  const { t, locale } = useI18n();
  const works = useMemo(() => baseWorks.map((p) => localizeProject(p, locale)), [locale]);
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      reveal(
        '[data-work-fade]',
        { y: 50, autoAlpha: 0 },
        {
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
        },
      );
    },
    { scope: rootRef, dependencies: [locale] },
  );

  return (
    <section
      ref={rootRef}
      id="work"
      aria-labelledby="work-title"
      className="px-gutter py-[clamp(6rem,12vw,12rem)]"
    >
      <header data-work-fade className="grid gap-6 md:grid-cols-12 md:items-end">
        <p className="label-mono text-muted md:col-span-3">{t.work.label}</p>
        <div className="md:col-span-9">
          <h2 id="work-title" className="text-display-lg font-bold uppercase">
            {t.work.titleA}
            <br />
            {t.work.titleB}
          </h2>
          <p className="text-paper/70 mt-8 max-w-xl text-lg leading-snug">{t.work.blurb}</p>
        </div>
      </header>

      <div className="mt-16 md:mt-24">
        {works.map((project) => (
          <TransitionLink
            key={project.slug}
            href={`/projects/${project.slug}`}
            label={project.title}
            data-work-fade
            data-cursor={t.cursor.view}
            className="group block"
          >
            <div className="bg-ink-soft relative aspect-[16/8] overflow-hidden rounded-sm">
              <Image
                src={project.cover}
                alt={`${project.title} — preview`}
                fill
                sizes="100vw"
                className="ease-expo object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
              <div>
                <h3 className="text-[clamp(1.5rem,2.6vw,2.75rem)] leading-none font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="text-muted mt-2">{project.summary}</p>
              </div>
              <ul
                className="label-mono flex flex-wrap justify-end gap-2"
                aria-label={t.work.technologies}
              >
                {project.tags.map((tag) => (
                  <li key={tag} className="border-line rounded-full border px-3 py-1">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </TransitionLink>
        ))}
        <p data-work-fade className="label-mono text-muted mt-10">
          {t.work.soon}
        </p>
      </div>
    </section>
  );
}
