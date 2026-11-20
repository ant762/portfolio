'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import { setSiteReady } from '@/lib/ready';
import { playSfx } from '@/lib/sound';
import { getLenis, lockScroll, scrollToTarget, unlockScroll } from '@/lib/scroll';

interface NavigateOptions {
  label?: string;
}

interface TransitionContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>');
  return ctx;
}

const BAR_COUNT = 6;
const SAFETY_TIMEOUT_MS = 4000;

/**
 * Transição de rota: barras cobrem a tela, o Next troca a página por baixo
 * e as barras se abrem revelando o novo conteúdo.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  const busy = useRef(false);
  const pendingHash = useRef('');
  const safetyTimer = useRef<number | undefined>(undefined);
  const lastPath = useRef(pathname);

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    const bars = barsRef.current?.children;
    const label = labelRef.current;
    if (!overlay || !bars || !label) return;

    window.clearTimeout(safetyTimer.current);

    const finish = () => {
      gsap.set(overlay, { display: 'none' });
      busy.current = false;
      unlockScroll('transition');
    };

    // Estado novo: topo da página (ou âncora pedida), medidas atualizadas.
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    if (pendingHash.current) {
      scrollToTarget(pendingHash.current, { immediate: true });
      pendingHash.current = '';
    }

    if (prefersReducedMotion()) {
      setSiteReady(true);
      finish();
      return;
    }

    gsap
      .timeline({ onComplete: finish })
      .to(label, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' })
      .call(() => setSiteReady(true), [], '-=0.1')
      .to(
        bars,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'expo.inOut',
          stagger: { each: 0.05, from: 'end' },
        },
        '<',
      );
  }, []);

  const navigate = useCallback(
    (href: string, { label = '' }: NavigateOptions = {}) => {
      if (busy.current) return;

      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;

      if (samePage) {
        if (url.hash) {
          scrollToTarget(url.hash);
          window.history.pushState(null, '', `${url.pathname}${url.hash}`);
        } else {
          scrollToTarget(0);
        }
        return;
      }

      const overlay = overlayRef.current;
      const bars = barsRef.current?.children;
      const labelEl = labelRef.current;
      if (!overlay || !bars || !labelEl) {
        router.push(href);
        return;
      }

      busy.current = true;
      pendingHash.current = url.hash;
      lockScroll('transition');
      labelEl.textContent = label;
      playSfx('whoosh');

      // Se por algum motivo a rota não trocar, não deixa a tela presa.
      safetyTimer.current = window.setTimeout(reveal, SAFETY_TIMEOUT_MS);

      // O "palco" só é escondido quando as barras já cobriram a tela inteira.
      const go = () => {
        setSiteReady(false);
        router.push(`${url.pathname}${url.search}`);
      };

      if (prefersReducedMotion()) {
        go();
        return;
      }

      gsap.set(overlay, { display: 'block' });
      gsap.set(labelEl, { autoAlpha: 0, y: 24 });
      gsap
        .timeline({ onComplete: go })
        .fromTo(
          bars,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.75,
            ease: 'expo.inOut',
            stagger: { each: 0.05, from: 'start' },
          },
        )
        .to(labelEl, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'expo.out' }, '-=0.35');
    },
    [reveal, router],
  );

  // Quando a rota efetivamente muda, abre as barras.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (!busy.current) return;
    // Dois frames para o layout da nova página assentar antes de revelar.
    requestAnimationFrame(() => requestAnimationFrame(reveal));
  }, [pathname, reveal]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] hidden"
      >
        <div ref={barsRef} className="absolute inset-0 flex">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div key={i} className="h-full flex-1 bg-[#141414]" />
          ))}
        </div>
        <p
          ref={labelRef}
          className="text-display-md px-gutter text-paper absolute inset-0 flex items-center justify-center text-center font-bold tracking-tight uppercase opacity-0"
        />
      </div>
    </TransitionContext.Provider>
  );
}
