'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useSiteReady } from '@/hooks/useSiteReady';
import { site } from '@/data/site';
import { useI18n } from '@/i18n/useI18n';
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap';

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
        gsap.set('[data-hero-portrait]', { autoAlpha: 0, scale: 1.08, y: 48 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
        .to(
          '[data-hero-portrait]',
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.9, ease: 'power3.out' },
          0,
        )
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
      // O retrato sobe mais devagar que o título: sensação de profundidade.
      gsap.to('[data-hero-portrait]', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax do mouse (só com ponteiro fino): retrato e nomes andam em sentidos opostos.
      if (!hasFinePointer()) return;
      const depthX = gsap.quickTo('[data-hero-depth]', 'x', { duration: 1.4, ease: 'power3' });
      const depthY = gsap.quickTo('[data-hero-depth]', 'y', { duration: 1.4, ease: 'power3' });
      const nameX = gsap.quickTo('[data-hero-name]', 'x', { duration: 1.4, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        depthX(nx * 28);
        depthY(ny * 16);
        nameX(-nx * 44);
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: rootRef, dependencies: [ready] },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className="px-gutter relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 pb-8"
    >
      <div
        data-hero-meta
        className="label-mono relative z-20 flex items-start justify-between gap-6"
      >
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

      {/* Palco: MAIK atrás do retrato, ANTUNES na frente do corpo, fade na base (o WebGL aparece por trás). */}
      <h1 className="sr-only">{`${site.firstName} ${site.lastName}`}</h1>
      <div
        className="pointer-events-none absolute inset-0 [--hero-fs:clamp(3.25rem,17.5vw,20rem)] md:[--hero-fs:clamp(3.25rem,15vw,20rem)]"
        aria-hidden="true"
      >
        <div
          data-hero-title
          className="text-display-xl px-gutter absolute inset-x-0 top-[calc(38%_-_var(--hero-fs)_*_0.84)] z-0 font-bold uppercase will-change-transform md:top-[calc(44%_-_var(--hero-fs)_*_0.84)]"
          style={{ fontSize: 'var(--hero-fs)', lineHeight: 0.84 }}
        >
          <span data-hero-name className="block w-fit">
            <span className={ready ? 'glitch block' : 'block'}>
              <Chars text={site.firstName.toUpperCase()} />
            </span>
          </span>
        </div>
        <div
          data-hero-title
          className="text-display-xl px-gutter absolute inset-x-0 top-[calc(38%_+_var(--hero-fs)_*_0.1)] z-20 font-bold uppercase will-change-transform md:top-[calc(44%_+_var(--hero-fs)_*_0.14)]"
          style={{ fontSize: 'var(--hero-fs)', lineHeight: 0.84 }}
        >
          <span data-hero-name className="ml-auto block w-fit">
            <span className={ready ? 'glitch block' : 'block'}>
              <Chars text={site.lastName.toUpperCase()} />
            </span>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <div
            data-hero-portrait
            className="relative aspect-[842/1052] h-[70svh] max-w-full md:h-[74svh]"
          >
            <div
              data-hero-depth
              className="absolute inset-0"
              style={{
                maskImage: 'linear-gradient(to bottom, #000 60%, transparent 97%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 60%, transparent 97%)',
              }}
            >
              <Image
                src={site.portrait}
                alt={t.hero.portraitAlt}
                fill
                priority
                sizes="(min-width: 768px) 70svh, 80vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        data-hero-meta
        className="relative z-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
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
