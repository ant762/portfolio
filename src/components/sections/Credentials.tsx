'use client';

import { useRef } from 'react';
import { credentials } from '@/data/site';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

export function Credentials() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        const line = row.querySelector('[data-line]');
        const text = row.querySelectorAll('[data-row-text]');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 90%' },
        });
        tl.from(line, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.4,
          ease: 'expo.inOut',
        }).from(text, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 }, '-=1');
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="credentials-title"
      className="px-gutter pb-[clamp(6rem,12vw,12rem)]"
    >
      <div className="mb-12 flex items-end justify-between">
        <h2 id="credentials-title" className="label-mono text-muted">
          (04) Credentials
        </h2>
      </div>

      <ul>
        {credentials.map((item, i) => (
          <li key={`${item.label}-${item.detail}`} data-row className="group relative">
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
                  {item.label}
                </span>
              </span>
              <span className="col-span-2 overflow-hidden md:col-span-1">
                <span data-row-text className="block">
                  <span className="ease-expo block text-[clamp(1.5rem,3.4vw,3.25rem)] leading-tight font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-3">
                    {item.detail}
                  </span>
                </span>
              </span>
            </div>
          </li>
        ))}
        <li className="bg-line h-px" aria-hidden="true" />
      </ul>
    </section>
  );
}
