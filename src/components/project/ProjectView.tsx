'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { SplitWords } from '@/components/ui/SplitWords';
import { useSiteReady } from '@/hooks/useSiteReady';
import { localizeProject } from '@/i18n/projects';
import { useI18n } from '@/i18n/useI18n';
import { gsap, prefersReducedMotion, useGSAP, reveal } from '@/lib/gsap';
import { isExternal, padIndex } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectViewProps {
  project: Project;
  next: Project;
  position: number;
  total: number;
}

export function ProjectView({ project: base, next: baseNext, position, total }: ProjectViewProps) {
  const { t, locale } = useI18n();
  const project = localizeProject(base, locale);
  const next = localizeProject(baseNext, locale);
  const rootRef = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const hasSecondImage = project.detail !== project.cover;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const words = gsap.utils.toArray<HTMLElement>('[data-hero-title] [data-word]');
      const fades = gsap.utils.toArray<HTMLElement>('[data-fade]');

      if (!ready) {
        gsap.set(words, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 24 });
        gsap.set('[data-cover]', { clipPath: 'inset(100% 0% 0% 0%)' });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to(words, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0)
        .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.3)
        .to(
          '[data-cover]',
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' },
          0.2,
        );

      gsap.utils.toArray<HTMLElement>('[data-parallax-img]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      reveal(
        '[data-overview] [data-word]',
        { yPercent: 115 },
        {
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.015,
          scrollTrigger: { trigger: '[data-overview]', start: 'top 80%' },
        },
      );
      reveal(
        '[data-meta]',
        { y: 36, autoAlpha: 0 },
        {
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-meta]', start: 'top 90%' },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, locale] },
  );

  return (
    <article ref={rootRef}>
      {/* Hero */}
      <header className="px-gutter pt-36 pb-12 md:pt-44">
        <div data-fade className="label-mono text-muted flex items-center justify-between">
          <TransitionLink
            href="/#work"
            label={t.nav.work}
            className="hover:text-accent transition-colors"
          >
            {t.project.back}
          </TransitionLink>
          <span className="tabular-nums">
            {padIndex(position)} / {padIndex(total)}
          </span>
        </div>

        <h1 data-hero-title className="text-display-lg mt-12 max-w-[16ch] font-bold uppercase">
          <SplitWords text={project.headline} />
        </h1>

        <p data-fade className="label-mono text-accent mt-8 flex items-center gap-3">
          <span className="bg-accent size-2 rounded-full" aria-hidden="true" />
          {project.category === 'programming' ? t.project.code : t.project.environment}
        </p>
      </header>

      {/* Capa */}
      <div className="px-gutter">
        <div
          data-cover
          className="bg-ink-soft relative aspect-[16/9] overflow-hidden rounded-sm"
          style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        >
          <div data-parallax-img className="absolute inset-0 scale-[1.2]">
            <Image
              src={project.cover}
              alt={`${project.headline} — cover`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Visão geral */}
      <section className="px-gutter grid gap-12 py-[clamp(5rem,12vw,12rem)] md:grid-cols-12">
        <p className="label-mono text-muted md:col-span-3">{t.project.overview}</p>
        <div className="md:col-span-9">
          <p
            data-overview
            className="text-[clamp(1.5rem,3.2vw,3.25rem)] leading-[1.15] font-medium tracking-tight"
          >
            <SplitWords text={project.description} />
          </p>

          <dl className="mt-16 grid gap-10 sm:grid-cols-2">
            <div data-meta className="border-line border-t pt-5">
              <dt className="label-mono text-muted">{t.project.stack}</dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label-mono border-line rounded-full border px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
            <div data-meta className="border-line border-t pt-5">
              <dt className="label-mono text-muted">{t.project.links}</dt>
              <dd className="mt-4 flex flex-col items-start gap-2">
                {project.links.length === 0 ? (
                  <span className="text-muted">{t.project.private}</span>
                ) : (
                  project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={isExternal(link.href) ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      data-cursor={t.cursor.open}
                      className="group inline-flex items-center gap-3 text-xl font-semibold tracking-tight"
                    >
                      <span className="decoration-line group-hover:decoration-accent underline underline-offset-6 transition-colors">
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ease-expo group-hover:text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        ↗
                      </span>
                    </a>
                  ))
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Imagem de detalhe */}
      {hasSecondImage ? (
        <div className="px-gutter pb-[clamp(5rem,12vw,12rem)]">
          <div className="bg-ink-soft relative aspect-[16/10] overflow-hidden rounded-sm">
            <div data-parallax-img className="absolute inset-0 scale-[1.2]">
              <Image
                src={project.detail}
                alt={`${project.headline} — detail`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Próximo projeto */}
      <TransitionLink
        href={`/projects/${next.slug}`}
        label={next.title}
        data-cursor={t.cursor.next}
        className="group border-line px-gutter relative block overflow-hidden border-t py-[clamp(5rem,12vw,11rem)]"
      >
        <span
          aria-hidden="true"
          className="bg-accent ease-expo absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 group-hover:scale-y-100"
        />
        <span className="group-hover:text-on-accent relative block transition-colors duration-500">
          <span className="label-mono text-muted group-hover:text-on-accent/70 transition-colors duration-500">
            {t.project.next}
          </span>
          <span className="text-display-lg mt-6 block font-bold uppercase">{next.title}</span>
        </span>
      </TransitionLink>
    </article>
  );
}
