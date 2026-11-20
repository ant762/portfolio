'use client';

import { useRef } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { setSiteReady } from '@/lib/ready';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import { setMusic, setSfx } from '@/lib/sound';
import { padIndex } from '@/lib/utils';

const MIN_DURATION = 2.4; // tempo mínimo de carregamento visível (s)
const FULL_RUN = 3; // segundos para o contador ir de 0 a 100 (proporcional)

export function Preloader() {
  const { t } = useI18n();
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
      const reduced = prefersReducedMotion();
      const gate = root.querySelector<HTMLElement>('[data-pre-gate]');
      const buttons = gsap.utils.toArray<HTMLButtonElement>('[data-pre-enter]', root);
      gsap.set(gate, { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0 });

      const finish = () => {
        gsap.set(root, { display: 'none' });
        unlockScroll('preloader');
      };

      const outro = () => {
        if (reduced) {
          setSiteReady(true);
          gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
          return;
        }
        gsap
          .timeline({ onComplete: finish })
          .to(gate, { autoAlpha: 0, duration: 0.3 })
          .to('[data-pre-line]', { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.05 })
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
      };

      // Clique = gesto do usuário: libera o áudio e inicia a trilha (ou silencia).
      const enter = (withSound: boolean) => {
        buttons.forEach((b) => (b.disabled = true));
        setSfx(withSound);
        setMusic(withSound);
        outro();
      };
      const cleanups = buttons.map((btn) => {
        const handler = () => enter(btn.dataset.sound === 'on');
        btn.addEventListener('click', handler);
        return () => btn.removeEventListener('click', handler);
      });

      // Progresso real: fontes + window.load (imagens/CSS) + tempo mínimo p/ a animação.
      const progress = { value: 0 };
      const paint = () => {
        counter.textContent = padIndex(Math.round(progress.value), 3);
        gsap.set(bar, { scaleX: progress.value / 100 });
      };
      // O contador sobe de forma contínua (nunca salta) e só chega perto de 100 quando
      // fontes e recursos realmente terminaram de carregar.
      const to = (value: number) =>
        gsap.to(progress, {
          value,
          duration: Math.max(0.5, ((value - progress.value) / 100) * FULL_RUN),
          ease: 'power1.inOut',
          onUpdate: paint,
          overwrite: true,
        });

      let fontsDone = false;
      let loadDone = false;
      let minDone = false;
      const check = () => {
        to(15 + (fontsDone ? 35 : 0) + (loadDone ? 35 : 0) + (minDone ? 15 : 0));
        if (fontsDone && loadDone && minDone) {
          // Mostra o botão só depois que o contador terminou de chegar em 100.
          gsap.delayedCall(Math.max(0.2, ((100 - progress.value) / 100) * FULL_RUN) + 0.4, () => {
            gsap.to(gate, { autoAlpha: 1, duration: 0.5 });
            buttons[0]?.focus({ preventScroll: true });
          });
        }
      };

      if (!reduced) {
        gsap.from('[data-pre-line]', {
          yPercent: 110,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
        });
      }
      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        fontsDone = true;
        check();
      });
      if (document.readyState === 'complete') {
        loadDone = true;
      } else {
        window.addEventListener(
          'load',
          () => {
            loadDone = true;
            check();
          },
          { once: true },
        );
      }
      gsap.delayedCall(MIN_DURATION, () => {
        minDone = true;
        check();
      });
      check();

      return () => cleanups.forEach((fn) => fn());
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
            {t.preloader.portfolio}
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-pre-line className="text-muted block">
            {t.preloader.loading}
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="overflow-hidden">
          <p data-pre-line className="label-mono text-muted max-w-48">
            {t.hero.role}
            <br />
            {t.hero.role2}
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

      <div
        data-pre-gate
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-wrap items-center justify-center gap-4 px-6"
      >
        <button
          type="button"
          data-pre-enter
          data-sound="on"
          className="label-mono bg-accent text-on-accent hover:bg-paper hover:text-ink px-8 py-4 transition-colors"
        >
          {t.preloader.enter}
        </button>
        <button
          type="button"
          data-pre-enter
          data-sound="off"
          className="label-mono border-line text-muted hover:text-paper border px-8 py-4 transition-colors"
        >
          {t.preloader.mute}
        </button>
      </div>

      <div className="bg-line absolute inset-x-0 bottom-0 h-1">
        <div ref={barRef} className="bg-accent h-full origin-left" />
      </div>
    </div>
  );
}
