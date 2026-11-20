'use client';

import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/scroll';

/** Scroll inercial (Lenis) sincronizado com o ticker do GSAP e o ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    // Recalcula pins/medidas depois que fontes e imagens assentam.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
