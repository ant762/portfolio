'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { getProjectsByCategory } from '@/data/projects';
import { socials } from '@/data/site';
import { useI18n } from '@/i18n/useI18n';
import { localizeProject } from '@/i18n/projects';
import { gsap, useGSAP } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

const baseWorks = getProjectsByCategory('programming');
const github = socials.find((s) => s.label === 'GitHub');

/**
 * Showcase horizontal: a seção fica "pinada" e o scroll vertical move a trilha
 * lateralmente. Em telas pequenas (ou movimento reduzido) vira uma lista vertical.
 */
export function Work() {
  const { t, locale } = useI18n();
  const works = useMemo(() => baseWorks.map((p) => localizeProject(p, locale)), [locale]);
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
                const index = Math.min(Math.floor(self.progress * works.length), works.length - 1);
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
          gsap.from(card, {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          });
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

        {github ? (
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={t.cursor.open}
            className="group border-line hover:bg-accent hover:text-on-accent flex shrink-0 flex-col justify-between gap-16 rounded-sm border p-8 transition-colors duration-500 md:h-[62svh] md:w-[28vw]"
          >
            <span className="label-mono text-muted group-hover:text-on-accent/70">
              {t.work.more}
            </span>
            <span className="text-display-md font-bold uppercase">
              {t.work.seeAll}
              <br />
              {t.work.repositories}
              <span className="ease-expo ml-2 inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                ↗
              </span>
            </span>
          </a>
        ) : null}
      </div>

      <div
        className="absolute right-[var(--gutter)] bottom-8 left-[var(--gutter)] hidden items-center gap-6 md:flex"
        aria-hidden="true"
      >
        <span className="label-mono tabular-nums">
          <span data-counter>01</span> / {padIndex(works.length)}
        </span>
        <span className="bg-line relative h-px flex-1">
          <span data-progress className="bg-accent absolute inset-0 origin-left scale-x-0" />
        </span>
      </div>
    </section>
  );
}
