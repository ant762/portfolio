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
          <span className="text-accent">✠</span>
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
      const BASE = 60; // px/s, independente de quantas tecnologias existem
      const MAX_BOOST = 2.5;
      const pos = tracks.map(() => 0);
      const setters = tracks.map((track) => gsap.quickSetter(track, 'x', 'px'));
      let half = 1;
      let boost = 0;
      let dir = 1;
      let dirTarget = 1;
      let visible = false;

      const measure = () => {
        half = Math.max(1, (tracks[0]?.scrollWidth ?? 2) / 2);
      };
      measure();
      void document.fonts?.ready.then(measure);
      window.addEventListener('resize', measure);

      const tick = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs, 100) / 1000;
        boost += (0 - boost) * Math.min(1, dt * 2.5); // desacelera suavemente
        dir += (dirTarget - dir) * Math.min(1, dt * 6);
        const step = BASE * (1 + boost) * dir * dt;
        tracks.forEach((_, i) => {
          const sign = i % 2 === 1 ? 1 : -1;
          pos[i] = ((pos[i] ?? 0) + sign * step) % half;
          const p = pos[i] ?? 0;
          // mantém x em (-half, 0]: loop contínuo nos dois sentidos
          setters[i]?.(p > 0 ? p - half : p <= -half ? p + half : p);
        });
      };
      gsap.ticker.add(tick);

      // Scroll rápido acelera o marquee; a direção do scroll define o sentido.
      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible = self.isActive;
        },
        onUpdate: (self) => {
          boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 400, MAX_BOOST));
          dirTarget = self.direction;
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('resize', measure);
        trigger.kill();
      };
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
