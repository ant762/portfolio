'use client';

import { useRef } from 'react';
import { skills } from '@/data/site';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

function Group({ outline }: { outline?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {[...skills, ...skills].map((skill, i) => (
        <span key={`${skill}-${i}`} className="flex items-center">
          <span
            className={cn(
              'px-[0.4em] font-bold tracking-tighter uppercase',
              outline && 'text-outline',
            )}
          >
            {skill}
          </span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray<HTMLElement>('[data-track]');
      const tweens = tracks.map((track, i) => {
        const reverse = i % 2 === 1;
        return gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: 38, ease: 'none', repeat: -1 },
        );
      });

      // A velocidade do scroll acelera o marquee e a direção inverte o sentido.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 220, 7);
          const dir = self.direction;
          tweens.forEach((tween, i) => {
            const sign = (i % 2 === 1 ? -1 : 1) * dir;
            gsap.to(tween, { timeScale: sign * (1 + boost), duration: 0.25, overwrite: true });
            gsap.to(tween, { timeScale: sign, duration: 1.2, delay: 0.25, overwrite: 'auto' });
          });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Technologies"
      className="border-line overflow-hidden border-y py-10 text-[clamp(3.5rem,11vw,10rem)] leading-none"
    >
      <div data-track className="flex w-max">
        <Group />
        <Group />
      </div>
      <div data-track className="mt-2 flex w-max">
        <Group outline />
        <Group outline />
      </div>
    </section>
  );
}
