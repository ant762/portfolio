'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { setSiteReady } from '@/lib/ready';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import { padIndex } from '@/lib/utils';

const MIN_DURATION = 2.2;

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const counter = counterRef.current;
      const bar = barRef.current;
      if (!root || !counter || !bar) return;

      lockScroll('preloader');

      const finish = () => {
        gsap.set(root, { display: 'none' });
        unlockScroll('preloader');
      };

      if (prefersReducedMotion()) {
        setSiteReady(true);
        gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      const progress = { value: 0 };
      const fontsReady = document.fonts?.ready ?? Promise.resolve();

      const tl = gsap.timeline({ paused: true, onComplete: finish });
      tl.from('[data-pre-line]', {
        yPercent: 110,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
      })
        .to(
          progress,
          {
            value: 100,
            duration: MIN_DURATION,
            ease: 'power2.inOut',
            onUpdate: () => {
              counter.textContent = padIndex(Math.round(progress.value), 3);
            },
          },
          0.1,
        )
        .to(bar, { scaleX: 1, duration: MIN_DURATION, ease: 'power2.inOut' }, 0.1)
        .to('[data-pre-line]', {
          yPercent: -110,
          duration: 0.7,
          ease: 'expo.in',
          stagger: 0.05,
        })
        .to(
          root,
          {
            yPercent: -100,
            borderBottomLeftRadius: '50% 16vh',
            borderBottomRightRadius: '50% 16vh',
            duration: 1.1,
            ease: 'expo.inOut',
          },
          '>-0.35',
        )
        .call(() => setSiteReady(true), [], '>-0.55');

      void fontsReady.then(() => tl.play());
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="preloader bg-ink px-gutter text-paper fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden py-8"
    >
      <div className="label-mono flex items-start justify-between">
        <span className="overflow-hidden">
          <span data-pre-line className="block">
            ant762 — Portfolio
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-pre-line className="text-muted block">
            Loading experience
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="overflow-hidden">
          <p data-pre-line className="label-mono text-muted max-w-48">
            Fullstack Developer
            <br />
            Level Designer
          </p>
        </div>
        <div className="overflow-hidden">
          <span
            ref={counterRef}
            data-pre-line
            className="block font-bold tracking-tighter tabular-nums"
            style={{ fontSize: 'clamp(6rem, 24vw, 26rem)', lineHeight: 0.8 }}
          >
            000
          </span>
        </div>
      </div>

      <div className="bg-line absolute inset-x-0 bottom-0 h-1">
        <div ref={barRef} className="bg-accent h-full origin-left scale-x-0" />
      </div>
    </div>
  );
}
