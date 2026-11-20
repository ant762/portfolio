'use client';

import { useRef } from 'react';
import { gsap, hasFinePointer, useGSAP } from '@/lib/gsap';

const RING_SIZE = 44;
const RING_SIZE_LINK = 72;
const RING_SIZE_LABEL = 104;

/**
 * Cursor customizado (ponto + anel com inércia).
 * - `data-cursor="Texto"` em qualquer elemento mostra um rótulo dentro do anel.
 * - Links e botões ampliam o anel.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || !hasFinePointer()) return;

    const root = document.documentElement;
    root.classList.add('has-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

    let visible = false;
    let mode = 'default';

    const setMode = (next: string, text = '') => {
      if (next === mode && label.textContent === text) return;
      mode = next;
      label.textContent = text;

      const labelled = next === 'label';
      const linked = next === 'link';
      gsap.to(ring, {
        width: labelled ? RING_SIZE_LABEL : linked ? RING_SIZE_LINK : RING_SIZE,
        height: labelled ? RING_SIZE_LABEL : linked ? RING_SIZE_LINK : RING_SIZE,
        backgroundColor: labelled ? '#d7ff3f' : 'rgba(215,255,63,0)',
        borderColor: labelled ? 'rgba(215,255,63,1)' : 'rgba(240,238,232,0.55)',
        duration: 0.5,
        ease: 'expo.out',
      });
      gsap.to(label, { autoAlpha: labelled ? 1 : 0, duration: 0.25 });
      gsap.to(dot, { scale: labelled ? 0 : linked ? 0.4 : 1, duration: 0.3 });
    };

    const onMove = (event: MouseEvent) => {
      if (!visible) {
        visible = true;
        dotX(event.clientX);
        dotY(event.clientY);
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const custom = target?.closest<HTMLElement>('[data-cursor]');
      if (custom?.dataset.cursor) return setMode('label', custom.dataset.cursor);
      if (target?.closest('a, button, [role="button"], input, textarea')) return setMode('link');
      setMode('default');
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[200]">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderColor: 'rgba(240,238,232,0.55)',
          opacity: 0,
          visibility: 'hidden',
        }}
      >
        <span
          ref={labelRef}
          className="label-mono text-ink font-medium whitespace-nowrap opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="bg-accent fixed top-0 left-0 size-1.5 rounded-full"
        style={{ opacity: 0, visibility: 'hidden' }}
      />
    </div>
  );
}
