'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { getProjectsByCategory } from '@/data/projects';
import { useI18n } from '@/i18n/useI18n';
import { gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { padIndex } from '@/lib/utils';

const environments = getProjectsByCategory('environment');

/**
 * Lista editorial: ao passar o mouse numa linha, uma prévia segue o cursor
 * (com inclinação proporcional à velocidade) e as demais linhas escurecem.
 */
export function Environments() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const preview = previewRef.current;
      if (!root || !preview) return;

      if (!prefersReducedMotion()) {
        gsap.utils.toArray<HTMLElement>('[data-env-row]').forEach((row) => {
          const line = row.querySelector('[data-line]');
          const parts = row.querySelectorAll('[data-row-text]');
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 92%' } })
            .fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, transformOrigin: 'left', duration: 1.3, ease: 'expo.inOut' },
            )
            .fromTo(
              parts,
              { yPercent: 110 },
              { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 },
              '-=0.9',
            );
        });
      }

      if (!hasFinePointer()) return;

      const images = gsap.utils.toArray<HTMLElement>('[data-preview-image]', preview);
      const list = root.querySelector<HTMLElement>('[data-env-list]');
      const rows = gsap.utils.toArray<HTMLElement>('[data-env-row]');
      if (!list) return;

      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      gsap.set(images, { autoAlpha: 0 });

      const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
      const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
      const rotate = gsap.quickTo(preview, 'rotation', { duration: 0.5, ease: 'power3' });

      let lastX = 0;
      let pointer: { x: number; y: number } | null = null;
      let active = -1;
      const track = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        pointer = { x: event.clientX, y: event.clientY };
      };
      window.addEventListener('pointermove', track, { passive: true });

      const onMove = (event: MouseEvent) => {
        x(event.clientX);
        y(event.clientY);
        rotate(gsap.utils.clamp(-9, 9, (event.clientX - lastX) * 0.25));
        lastX = event.clientX;
      };

      const show = (index: number) => {
        // Entrou por scroll (sem mousemove): ancora a prévia no cursor antes de mostrar.
        if (active === -1 && pointer) {
          gsap.set(preview, { x: pointer.x, y: pointer.y });
          x(pointer.x);
          y(pointer.y);
        }
        active = index;
        images.forEach((img, i) => {
          gsap.to(img, {
            autoAlpha: i === index ? 1 : 0,
            clipPath: i === index ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
            duration: 0.6,
            ease: 'expo.out',
            overwrite: true,
          });
        });
        gsap.to(preview, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'expo.out',
          overwrite: 'auto',
        });
        rows.forEach((row, i) => gsap.to(row, { opacity: i === index ? 1 : 0.25, duration: 0.4 }));
      };

      const hide = () => {
        active = -1;
        gsap.to(preview, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'expo.in',
          overwrite: 'auto',
        });
        gsap.to(rows, { opacity: 1, duration: 0.4 });
      };

      const cleanups = rows.map((row, i) => {
        const enter = () => show(i);
        row.addEventListener('mouseenter', enter);
        row.addEventListener('focusin', enter);
        return () => {
          row.removeEventListener('mouseenter', enter);
          row.removeEventListener('focusin', enter);
        };
      });

      list.addEventListener('mouseleave', hide);
      list.addEventListener('focusout', hide);
      list.addEventListener('mousemove', onMove);

      // Scroll sem mover o mouse não dispara mouseenter/leave: reavalia sob o cursor.
      let raf = 0;
      const onScroll = () => {
        if (raf || !pointer) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (!pointer) return;
          const row = document
            .elementFromPoint(pointer.x, pointer.y)
            ?.closest<HTMLElement>('[data-env-row]');
          const idx = row ? rows.indexOf(row) : -1;
          if (idx === -1) {
            if (active !== -1) hide();
          } else if (idx !== active) {
            show(idx);
          }
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        cleanups.forEach((fn) => fn());
        list.removeEventListener('mouseleave', hide);
        list.removeEventListener('focusout', hide);
        list.removeEventListener('mousemove', onMove);
        window.removeEventListener('pointermove', track);
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(raf);
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="environments"
      aria-labelledby="env-title"
      className="px-gutter py-[clamp(6rem,14vw,14rem)]"
    >
      <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="label-mono text-muted">{t.environments.label}</p>
          <h2 id="env-title" className="text-display-lg mt-6 font-bold uppercase">
            {t.environments.titleA}
            <br />
            {t.environments.titleB}
          </h2>
        </div>
        <p className="text-paper/70 max-w-sm text-lg leading-snug md:col-span-4 md:justify-self-end">
          {t.environments.blurb.replace('{n}', String(environments.length))}
        </p>
      </div>

      <ul data-env-list>
        {environments.map((project, i) => (
          <li key={project.slug} data-env-row className="relative">
            <span data-line className="bg-line absolute inset-x-0 top-0 h-px" />
            <TransitionLink
              href={`/projects/${project.slug}`}
              label={project.title}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-3 py-7 md:grid-cols-[4rem_1fr_minmax(0,22rem)_3rem] md:py-9"
            >
              <span className="overflow-hidden">
                <span data-row-text className="label-mono text-muted block">
                  {padIndex(i + 1)}
                </span>
              </span>
              <span className="overflow-hidden">
                <span data-row-text className="block">
                  <span className="ease-expo block text-[clamp(1.9rem,5.2vw,5.5rem)] leading-[1] font-semibold tracking-tighter transition-transform duration-700 group-hover:translate-x-4">
                    {project.title}
                  </span>
                </span>
              </span>
              <span className="hidden overflow-hidden md:block">
                <span data-row-text className="label-mono text-muted block text-right">
                  {project.tags.slice(0, 3).join(' · ')}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ease-expo group-hover:text-accent justify-self-end text-3xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>

              {/* Miniatura para telas sem hover (touch) */}
              <span className="relative col-span-3 aspect-[16/8] overflow-hidden rounded-sm [@media(hover:hover)_and_(pointer:fine)]:hidden">
                <Image src={project.cover} alt="" fill sizes="100vw" className="object-cover" />
              </span>
            </TransitionLink>
          </li>
        ))}
        <li className="bg-line h-px" aria-hidden="true" />
      </ul>

      {/* Prévia que segue o cursor */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-[clamp(14rem,22vw,22rem)] w-[clamp(20rem,30vw,32rem)] overflow-hidden rounded-sm [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        {environments.map((project) => (
          <Image
            key={project.slug}
            data-preview-image
            src={project.cover}
            alt=""
            fill
            sizes="32rem"
            className="object-cover"
          />
        ))}
      </div>
    </section>
  );
}
