'use client';

import { useRef } from 'react';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useSiteReady } from '@/hooks/useSiteReady';
import { site } from '@/data/site';
import { useI18n } from '@/i18n/useI18n';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-top">
          <span data-char className="inline-block will-change-transform">
            {char}
          </span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const { t } = useI18n();
  const time = useLocalTime(site.timezone);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const chars = gsap.utils.toArray<HTMLElement>('[data-char]');
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

      if (!ready) {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 24 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
        .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.8);

      // Parallax de saída: o título sobe e some enquanto a página rola.
      gsap.to('[data-hero-title]', {
        yPercent: -22,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-meta]', {
        y: -60,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '50% top', scrub: true },
      });
    },
    { scope: rootRef, dependencies: [ready] },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className="px-gutter relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 pb-8"
    >
      <div data-hero-meta className="label-mono flex items-start justify-between gap-6">
        <p data-hero-fade className="text-muted max-w-xs">
          {t.hero.role}
          <br />
          {t.hero.role2}
        </p>
        <p data-hero-fade className="flex items-center gap-3">
          <span className="pulse-dot bg-accent size-2 rounded-full" aria-hidden="true" />
          {t.hero.availability}
        </p>
      </div>

      <h1
        data-hero-title
        className="text-display-xl font-bold uppercase will-change-transform"
        style={{ fontSize: 'clamp(4rem, 26vw, 28rem)' }}
        aria-label={site.firstName}
      >
        <span aria-hidden="true" className={ready ? 'glitch block' : 'block'}>
          <Chars text={site.firstName.toUpperCase()} />
        </span>
      </h1>

      <div
        data-hero-meta
        className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <p data-hero-fade className="text-paper/80 max-w-sm text-lg leading-snug md:text-xl">
          <span className="text-paper">
            {t.hero.greeting} {site.firstName}.
          </span>{' '}
          {t.hero.tagline}
        </p>

        <div data-hero-fade className="label-mono text-muted flex items-center gap-4">
          <span className="bg-line relative block h-12 w-px overflow-hidden" aria-hidden="true">
            <span className="scroll-line bg-accent absolute inset-0" />
          </span>
          {t.hero.scroll}
        </div>

        <p data-hero-fade className="label-mono text-muted text-right">
          {site.location} · GMT−3
          <br />
          <span className="text-paper">{time}</span>
        </p>
      </div>
    </section>
  );
}
