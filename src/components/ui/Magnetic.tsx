'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, hasFinePointer, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: ReactNode;
  /** 0 a 1: quanto o elemento acompanha o cursor. */
  strength?: number;
  className?: string;
}

/** Faz o conteúdo "grudar" no cursor quando ele se aproxima. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !hasFinePointer()) return;

      const x = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      const y = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });

      const onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        x((event.clientX - (rect.left + rect.width / 2)) * strength);
        y((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        x(0);
        y(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      {children}
    </div>
  );
}
