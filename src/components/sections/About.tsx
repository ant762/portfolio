'use client';

import { useRef } from 'react';
import { SplitWords } from '@/components/ui/SplitWords';
import { getProjectsByCategory } from '@/data/projects';
import { credentials, site } from '@/data/site';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

const stats = [
  { value: getProjectsByCategory('programming').length, label: 'Systems & code projects' },
  { value: getProjectsByCategory('environment').length, label: 'Environment studies' },
  { value: 3, label: 'Spoken languages' },
  { value: credentials.filter((c) => c.label === 'Certification').length, label: 'Certifications' },
] as const;

export function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Parágrafo "acende" palavra por palavra conforme o scroll.
      const words = gsap.utils.toArray<HTMLElement>('[data-scrub-word]');
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-about-text]',
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: true,
        },
      });

      gsap.from('[data-stat]', {
        y: 48,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '[data-stats]', start: 'top 85%' },
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const state = { value: 0 };
        el.textContent = padIndex(0);
        gsap.to(state, {
          value: target,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = padIndex(Math.round(state.value));
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="about" className="px-gutter py-[clamp(6rem,14vw,14rem)]">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="label-mono text-muted md:col-span-3">(03) About</p>

        <div className="md:col-span-9">
          <p
            data-about-text
            className="text-[clamp(1.75rem,4.1vw,4.25rem)] leading-[1.1] font-medium tracking-tight"
          >
            <SplitWords text={site.about} mask={false} attr="data-scrub-word" />
          </p>
        </div>
      </div>

      <dl data-stats className="mt-[clamp(4rem,9vw,9rem)] grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} data-stat className="border-line border-t pt-5 pr-6">
            <dt className="label-mono text-muted order-2 mt-4">{stat.label}</dt>
            <dd
              data-count={stat.value}
              className="font-bold tracking-tighter tabular-nums"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)', lineHeight: 0.9 }}
            >
              {padIndex(stat.value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
