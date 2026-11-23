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
    (_context, contextSafe) => {
      if (prefersReducedMotion()) return;
      // contextSafe: tweens criados em eventos/timers também são revertidos na desmontagem.
      const safe = <T extends (...args: never[]) => void>(fn: T): T =>
        contextSafe ? contextSafe(fn) : fn;

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

      // Glitch do retrato: fatias deslocadas + franja azul + piscada de contraste.
      // Dispara sozinho a cada poucos segundos, ao passar o mouse e ao tocar na foto.
      const portrait = rootRef.current?.querySelector<HTMLElement>('[data-hero-portrait]');
      const base = '[data-glitch="base"]';
      const ghostA = '[data-glitch="a"]';
      const ghostB = '[data-glitch="b"]';
      let busy = false;

      const burst = safe(() => {
        if (busy) return;
        busy = true;
        const band = () => {
          const top = gsap.utils.random(0, 82);
          const height = gsap.utils.random(3, 16);
          return `inset(${top}% 0 ${100 - top - height}% 0)`;
        };
        const tl = gsap.timeline({
          onComplete: () => {
            busy = false;
          },
        });
        for (let k = 0; k < 6; k++) {
          const at = k * 0.055;
          tl.set(ghostA, { autoAlpha: 1, clipPath: band(), x: gsap.utils.random(14, 40) }, at)
            .set(ghostB, { autoAlpha: 1, clipPath: band(), x: gsap.utils.random(-40, -14) }, at)
            .set(
              base,
              {
                x: gsap.utils.random(-7, 7),
                filter:
                  k % 2
                    ? 'grayscale(1) contrast(1.9) brightness(1.25)'
                    : 'grayscale(1) contrast(1.12)',
              },
              at,
            );
        }
        tl.set([ghostA, ghostB], { autoAlpha: 0 }).set(base, { x: 0, clearProps: 'filter' });
      });

      const loop = safe(() => {
        burst();
        gsap.delayedCall(gsap.utils.random(3.5, 7), loop);
      });
      gsap.delayedCall(2.2, loop);

      portrait?.addEventListener('pointerenter', burst);
      portrait?.addEventListener('pointerdown', burst);
      const offGlitch = () => {
        portrait?.removeEventListener('pointerenter', burst);
        portrait?.removeEventListener('pointerdown', burst);
      };

      // Parallax e inclinação 3D do mouse (só com ponteiro fino): retrato e nomes andam em sentidos opostos.
      if (!hasFinePointer()) return offGlitch;
      gsap.set('[data-hero-depth]', { transformPerspective: 900 });
      const depthX = gsap.quickTo('[data-hero-depth]', 'x', { duration: 1.4, ease: 'power3' });
      const depthY = gsap.quickTo('[data-hero-depth]', 'y', { duration: 1.4, ease: 'power3' });
      const tiltY = gsap.quickTo('[data-hero-depth]', 'rotationY', {
        duration: 1.4,
        ease: 'power3',
      });
      const tiltX = gsap.quickTo('[data-hero-depth]', 'rotationX', {
        duration: 1.4,
        ease: 'power3',
      });
      const nameX = gsap.quickTo('[data-hero-name]', 'x', { duration: 1.4, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        depthX(nx * 28);
        depthY(ny * 16);
        tiltY(nx * 9);
        tiltX(-ny * 6);
        nameX(-nx * 44);
      };
      window.addEventListener('pointermove', onMove);
      return () => {
        window.removeEventListener('pointermove', onMove);
        offGlitch();
      };
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
            className="pointer-events-auto relative aspect-[842/1052] h-[70svh] max-w-full md:h-[74svh]"
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
                data-glitch="base"
                src={site.portrait}
                alt={t.hero.portraitAlt}
                fill
                priority
                sizes="(min-width: 768px) 70svh, 80vw"
                className="object-contain object-bottom contrast-[1.12] grayscale"
              />
              {/* Fantasmas do glitch: ficam invisíveis até o surto. */}
              <Image
                data-glitch="a"
                src={site.portrait}
                alt=""
                fill
                sizes="(min-width: 768px) 70svh, 80vw"
                className="pointer-events-none object-contain object-bottom opacity-0 mix-blend-screen [filter:grayscale(1)_sepia(1)_hue-rotate(185deg)_saturate(2.2)_brightness(1.2)]"
              />
              <Image
                data-glitch="b"
                src={site.portrait}
                alt=""
                fill
                sizes="(min-width: 768px) 70svh, 80vw"
                className="pointer-events-none object-contain object-bottom opacity-0 mix-blend-screen brightness-150 grayscale"
              />
              {/* Linhas de varredura, recortadas pela silhueta. */}
              <div
                aria-hidden="true"
                className="portrait-scan pointer-events-none absolute inset-0"
                style={{
                  maskImage: `url(${site.portrait})`,
                  WebkitMaskImage: `url(${site.portrait})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskPosition: 'center bottom',
                  WebkitMaskPosition: 'center bottom',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
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
