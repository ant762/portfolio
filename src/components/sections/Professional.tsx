'use client';

import { useRef } from 'react';
import pkg from '../../../package.json';
import { skillGroups } from '@/data/site';
import { useI18n } from '@/i18n/useI18n';
import { gsap, prefersReducedMotion, useGSAP, reveal } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

const toEntries = (deps: Record<string, string>) =>
  Object.entries(deps)
    .filter(([name]) => !name.startsWith('@types/') && name !== 'eslint-config-next')
    .map(([name, version]) => ({ name, version: version.replace(/^[^\d]*/, '') }));

const stack = [...toEntries(pkg.dependencies), ...toEntries(pkg.devDependencies)];

export function Professional() {
  const rootRef = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const p = t.professional;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        const line = row.querySelector('[data-line]');
        const text = row.querySelectorAll('[data-row-text]');
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 90%' } })
          .fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut' },
          )
          .fromTo(
            text,
            { yPercent: 110 },
            { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.08 },
            '-=1',
          );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        reveal(
          el,
          { y: 40, autoAlpha: 0 },
          {
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [t] },
  );

  return (
    <section
      ref={rootRef}
      id="professional"
      aria-labelledby="professional-title"
      className="px-gutter pb-[clamp(6rem,12vw,12rem)]"
    >
      <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <p className="label-mono text-muted md:col-span-3">{p.label}</p>
        <h2 id="professional-title" className="text-display-lg font-bold uppercase md:col-span-9">
          {p.title}
        </h2>
      </div>

      {/* Linha do tempo */}
      <ul>
        {p.timeline.map((item, i) => (
          <li key={`${item.period}-${item.title}`} data-row className="group relative">
            <span data-line className="bg-line absolute inset-x-0 top-0 h-px" />
            <span
              aria-hidden="true"
              className="bg-accent ease-expo absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
            />
            <div className="group-hover:text-on-accent relative grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 py-6 transition-colors duration-500 md:grid-cols-[4rem_14rem_1fr] md:py-8">
              <span className="overflow-hidden">
                <span
                  data-row-text
                  className="label-mono text-muted group-hover:text-on-accent/70 block"
                >
                  {padIndex(i + 1)}
                </span>
              </span>
              <span className="overflow-hidden">
                <span data-row-text className="label-mono block">
                  {p.kinds[item.kind as keyof typeof p.kinds]}
                  <span className="text-muted group-hover:text-on-accent/70 mt-1 block">
                    {item.period}
                  </span>
                </span>
              </span>
              <span className="col-span-2 overflow-hidden md:col-span-1">
                <span data-row-text className="block">
                  <span className="ease-expo block text-[clamp(1.4rem,3vw,2.75rem)] leading-tight font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-3">
                    {item.title}
                  </span>
                  {item.org ? (
                    <span className="label-mono mt-2 block normal-case">{item.org}</span>
                  ) : null}
                  <span className="label-mono text-muted group-hover:text-on-accent/70 mt-3 flex flex-wrap gap-x-5 gap-y-1 normal-case">
                    {item.bullets.map((bullet) => (
                      <span key={bullet}>— {bullet}</span>
                    ))}
                  </span>
                </span>
              </span>
            </div>
          </li>
        ))}
        <li className="bg-line h-px" aria-hidden="true" />
      </ul>

      {/* Skills (README do GitHub) */}
      <div className="mt-[clamp(5rem,10vw,10rem)] grid gap-10 md:grid-cols-12">
        <div data-reveal className="md:col-span-4">
          <p className="label-mono text-muted">{p.skillsLabel}</p>
          <h3 className="text-display-md mt-4 font-bold uppercase">{p.skillsTitle}</h3>
        </div>
        <dl className="md:col-span-8">
          {skillGroups.map((group) => (
            <div
              key={group.key}
              data-reveal
              className="border-line grid gap-3 border-t py-5 md:grid-cols-[14rem_1fr]"
            >
              <dt className="label-mono text-muted">{p.groups[group.key]}</dt>
              <dd>
                <ul className="label-mono flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="border-line rounded-full border px-3 py-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
          <div className="bg-line h-px" aria-hidden="true" />
        </dl>
      </div>

      {/* Stack & práticas — lido do package.json deste projeto */}
      <div className="mt-[clamp(5rem,10vw,10rem)] grid gap-10 md:grid-cols-12">
        <div data-reveal className="md:col-span-4">
          <p className="label-mono text-muted">{p.stackLabel}</p>
          <h3 className="text-display-md mt-4 font-bold uppercase">{p.stackTitle}</h3>
          <p className="text-paper/70 mt-6 max-w-sm text-lg leading-snug">{p.stackBlurb}</p>
        </div>

        <div className="md:col-span-8">
          <ul>
            {stack.map(({ name, version }) => (
              <li
                key={name}
                data-reveal
                className="border-line grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t py-4 md:grid-cols-[16rem_1fr_auto]"
              >
                <span className="font-semibold tracking-tight">{name}</span>
                <span className="text-muted order-3 col-span-2 md:order-none md:col-span-1">
                  {p.stackRoles[name] ?? ''}
                </span>
                <span className="label-mono text-muted tabular-nums">v{version}</span>
              </li>
            ))}
            <li className="bg-line h-px" aria-hidden="true" />
          </ul>

          <p data-reveal className="label-mono text-muted mt-14">
            {p.practicesLabel}
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2">
            {p.practices.map((practice) => (
              <li key={practice} data-reveal className="flex gap-3 leading-snug">
                <span className="text-accent" aria-hidden="true">
                  ✠
                </span>
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
