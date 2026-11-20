'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useSiteReady } from '@/hooks/useSiteReady';
import { site } from '@/data/site';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

const HeroCanvas = dynamic(
  () => import('@/components/webgl/HeroCanvas').then((m) => m.HeroCanvas),
  {
    ssr: false,
  },
);

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
  const time = useLocalTime(site.timezone);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const chars = gsap.utils.toArray<HTMLElement>('[data-char]');
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

      if (!ready) {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(fades, { autoAlpha: 0, y: 24 });
        gsap.set('[data-pill]', { width: 0 });
        gsap.set('[data-hero-canvas]', { autoAlpha: 0, scale: 1.08 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('[data-hero-canvas]', { autoAlpha: 1, scale: 1, duration: 2.2 }, 0)
        .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.1)
        .to('[data-pill]', { width: '1.15em', duration: 1.4, ease: 'expo.inOut' }, 0.7)
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
      <div data-hero-canvas className="bg-ink absolute inset-0 -z-10">
        <HeroCanvas className="size-full" />
        <div className="from-ink to-ink/60 absolute inset-0 bg-gradient-to-t via-transparent" />
      </div>

      <div data-hero-meta className="label-mono flex items-start justify-between gap-6">
        <p data-hero-fade className="text-muted max-w-56">
          {site.role}
          <br />
          &amp; Level Designer
        </p>
        <p data-hero-fade className="flex items-center gap-3">
          <span className="pulse-dot bg-accent size-2 rounded-full" aria-hidden="true" />
          {site.availability}
        </p>
      </div>

      <h1
        data-hero-title
        className="text-display-xl font-bold uppercase will-change-transform"
        aria-label={site.name}
      >
        <span aria-hidden="true" className="block">
          <Chars text="MAIK" />
          <span
            data-pill
            className="ring-paper/25 relative mx-[0.08em] inline-block h-[0.62em] w-[1.15em] overflow-hidden rounded-full align-baseline ring-1"
          >
            <Image
              src={site.ogImage}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 20vw, 40vw"
              className="object-cover"
            />
          </span>
        </span>
        <span aria-hidden="true" className="block text-right">
          <Chars text="ANTUNES" />
        </span>
      </h1>

      <div
        data-hero-meta
        className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <p data-hero-fade className="text-paper/80 max-w-sm text-lg leading-snug md:text-xl">
          {site.tagline}
        </p>

        <div data-hero-fade className="label-mono text-muted flex items-center gap-4">
          <span className="bg-line relative block h-12 w-px overflow-hidden" aria-hidden="true">
            <span className="scroll-line bg-accent absolute inset-0" />
          </span>
          Scroll
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
