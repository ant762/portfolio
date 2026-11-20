'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { getProjectsByCategory } from '@/data/projects';
import { useI18n } from '@/i18n/useI18n';
import { localizeProject } from '@/i18n/projects';
import { gsap, useGSAP, reveal } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

const baseWorks = getProjectsByCategory('programming');
const LOCKED_COUNT = 3;

/**
 * Showcase horizontal: a seção fica "pinada" e o scroll vertical move a trilha
 * lateralmente. Em telas pequenas (ou movimento reduzido) vira uma lista vertical.
 */
export function Work() {
  const { t, locale } = useI18n();
  const works = useMemo(() => baseWorks.map((p) => localizeProject(p, locale)), [locale]);
  const total = works.length + LOCKED_COUNT;
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
        const bar = section.querySelector<HTMLElement>('[data-progress]');
        const counter = section.querySelector<HTMLElement>('[data-counter]');

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
              if (counter) {
                const index = Math.min(Math.floor(self.progress * total), total - 1);
                counter.textContent = padIndex(index + 1);
              }
            },
          },
        });

        // Parallax interno das imagens, relativo ao movimento horizontal.
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          const media = card.querySelector('[data-parallax]');
          if (!media) return;
          gsap.fromTo(
            media,
            { xPercent: -9 },
            {
              xPercent: 9,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });
      });

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          reveal(
            card,
            { y: 60, autoAlpha: 0 },
            {
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 88%' },
            },
          );
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="work"
      aria-labelledby="work-title"
      className="px-gutter relative py-24 md:flex md:h-svh md:items-center md:overflow-hidden md:px-0 md:py-0"
    >
      <div
        ref={trackRef}
        className="md:px-gutter flex flex-col gap-14 will-change-transform md:w-max md:flex-row md:items-center md:gap-[5vw]"
      >
        <header className="shrink-0 md:w-[44vw]">
          <p className="label-mono text-muted">{t.work.label}</p>
          <h2 id="work-title" className="text-display-lg mt-6 font-bold uppercase">
            {t.work.titleA}
            <br />
            {t.work.titleB}
          </h2>
          <p className="text-paper/70 mt-8 max-w-sm text-lg leading-snug">{t.work.blurb}</p>
          <p className="label-mono text-accent mt-10 hidden items-center gap-3 md:flex">
            {t.work.scroll} <span aria-hidden="true">→</span>
          </p>
        </header>

        {works.map((project, i) => (
          <TransitionLink
            key={project.slug}
            href={`/projects/${project.slug}`}
            label={project.title}
            data-card
            data-cursor={t.cursor.view}
            className="group block shrink-0 md:w-[min(58vw,820px)]"
          >
            <div className="bg-ink-soft relative aspect-[16/10] overflow-hidden rounded-sm">
              <div data-parallax className="absolute inset-0 scale-[1.22]">
                <Image
                  src={project.cover}
                  alt={`${project.title} — preview`}
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="ease-expo object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
              </div>
              <span className="label-mono bg-ink/70 absolute top-4 left-4 rounded-full px-3 py-1 backdrop-blur">
                {padIndex(i + 1)}
              </span>
            </div>

            <div className="mt-5 flex items-start justify-between gap-6">
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
        {t.work.layouts.slice(0, LOCKED_COUNT).map((layout, i) => (
          <div
            key={layout}
            data-card
            aria-disabled="true"
            className="shrink-0 cursor-not-allowed select-none md:w-[min(46vw,640px)]"
          >
            <div className="border-line bg-ink-soft/60 relative flex aspect-[16/10] flex-col items-center justify-center gap-5 overflow-hidden rounded-sm border border-dashed">
              <svg
                viewBox="0 0 24 24"
                className="text-muted size-14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
              </svg>
              <span className="label-mono text-muted">{t.work.locked}</span>
              <span className="label-mono bg-ink/70 absolute top-4 left-4 rounded-full px-3 py-1 backdrop-blur">
                {padIndex(works.length + i + 1)}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-muted text-[clamp(1.5rem,2.6vw,2.75rem)] leading-none font-semibold tracking-tight">
                {t.work.lockedTitle} {padIndex(works.length + i + 1)}
              </h3>
              <p className="label-mono text-muted mt-3 normal-case">
                {t.work.planned}: {layout}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="absolute right-[var(--gutter)] bottom-8 left-[var(--gutter)] hidden items-center gap-6 md:flex"
        aria-hidden="true"
      >
        <span className="label-mono tabular-nums">
          <span data-counter>01</span> / {padIndex(total)}
        </span>
        <span className="bg-line relative h-px flex-1">
          <span data-progress className="bg-accent absolute inset-0 origin-left scale-x-0" />
        </span>
      </div>
    </section>
  );
}
