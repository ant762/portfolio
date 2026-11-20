'use client';

import { useEffect, useRef, useState } from 'react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Magnetic } from '@/components/ui/Magnetic';
import { SoundControls } from '@/components/ui/SoundControls';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useI18n } from '@/i18n/useI18n';
import { navLinks, site, socials } from '@/data/site';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import { playSfx } from '@/lib/sound';
import { padIndex } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const time = useLocalTime(site.timezone);
  const { t } = useI18n();

  // Esconde ao rolar para baixo, mostra ao rolar para cima.
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const hide = self.direction === 1 && self.scroll() > 240;
          gsap.to(nav, {
            yPercent: hide ? -110 : 0,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });
    },
    { scope: navRef },
  );

  // Timeline do menu (criada uma vez, tocada para frente/trás).
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      gsap.set(menu, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' });
      timeline.current = gsap
        .timeline({ paused: true })
        .set(menu, { visibility: 'visible' })
        .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
        .from(
          '[data-menu-line]',
          { yPercent: 115, duration: 0.9, ease: 'expo.out', stagger: 0.07 },
          '-=0.35',
        )
        .from(
          '[data-menu-fade]',
          { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.05 },
          '-=0.6',
        );
    },
    { scope: menuRef },
  );

  const setMenu = (next: boolean) => {
    setOpen(next);
    playSfx(next ? 'hit' : 'whoosh');
    if (next) lockScroll('menu');
    else unlockScroll('menu');

    const tl = timeline.current;
    if (!tl) return;
    if (prefersReducedMotion()) {
      tl.progress(next ? 1 : 0);
      return;
    }
    if (next) tl.timeScale(1).play();
    else tl.timeScale(1.4).reverse();
  };

  // Fechar com Escape e garantir destravar scroll ao desmontar.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => unlockScroll('menu'), []);

  return (
    <>
      <header
        ref={navRef}
        className="label-mono px-gutter fixed inset-x-0 top-0 z-[85] flex items-center justify-between py-5 text-white mix-blend-difference"
      >
        <TransitionLink
          href="/"
          label={t.ui.home}
          onClick={() => open && setMenu(false)}
          className="font-display text-base font-bold tracking-tight normal-case"
          aria-label={`${site.name} — ${t.ui.home}`}
        >
          {site.handle}
          <span className="opacity-60">.dev</span>
        </TransitionLink>

        <p className="hidden items-center gap-3 md:flex" aria-label={t.ui.localTime}>
          <span className="size-1.5 rounded-full bg-white" />
          São Paulo, BRA — {time}
        </p>

        <div className="flex items-center gap-3.5 sm:gap-6 md:gap-8">
          <SoundControls className="gap-3 sm:gap-4" />
          <LanguageSwitcher className="gap-2 sm:gap-3" />
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => setMenu(!open)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.ui.close : t.ui.menu}
              className="flex items-center gap-3 py-1"
            >
              <span className="relative block h-3 w-6" aria-hidden="true">
                <span
                  className="ease-expo absolute inset-x-0 h-px bg-white transition-all duration-500"
                  style={{ top: open ? '50%' : '0%', rotate: open ? '45deg' : '0deg' }}
                />
                <span
                  className="ease-expo absolute inset-x-0 h-px bg-white transition-all duration-500"
                  style={{ top: open ? '50%' : '100%', rotate: open ? '-45deg' : '0deg' }}
                />
              </span>
              <span className="hidden sm:inline">{open ? t.ui.close : t.ui.menu}</span>
            </button>
          </Magnetic>
        </div>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        inert={!open}
        className="bg-ink px-gutter fixed inset-0 z-[80] flex flex-col justify-between pt-28 pb-8"
      >
        <nav aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <TransitionLink
                  href={link.href}
                  label={t.nav[link.key]}
                  onClick={() => setMenu(false)}
                  data-menu-line
                  className="group flex items-baseline gap-5 py-1 font-bold tracking-tighter uppercase"
                  style={{ fontSize: 'clamp(3rem, 11vw, 10rem)', lineHeight: 0.95 }}
                >
                  <span className="label-mono text-muted font-normal">{padIndex(i + 1)}</span>
                  <span className="ease-expo group-hover:text-spark transition-all duration-500 group-hover:translate-x-4">
                    {t.nav[link.key]}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div data-menu-fade>
            <p className="label-mono text-muted">{t.ui.getInTouch}</p>
            <a
              href={`mailto:${site.email}`}
              className="hover:text-spark text-xl tracking-tight underline-offset-4 hover:underline md:text-3xl"
            >
              {site.email}
            </a>
          </div>
          <ul data-menu-fade className="label-mono flex flex-wrap gap-x-8 gap-y-3">
            {socials
              .filter((s) => s.label !== 'Email')
              .map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-spark inline-flex items-center gap-2 transition-colors"
                  >
                    {social.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
