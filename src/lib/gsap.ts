import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Se o scroll pular o trigger inteiro (links do menu, restauração), a animação ainda toca:
  // sem isso o conteúdo ficava preso no estado inicial (invisível).
  ScrollTrigger.defaults({ toggleActions: 'play play play none' });
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function hasFinePointer(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export { gsap, ScrollTrigger, useGSAP };

const FROM_KEYS = new Set([
  'x',
  'y',
  'xPercent',
  'yPercent',
  'autoAlpha',
  'opacity',
  'scale',
  'scaleX',
  'scaleY',
  'rotation',
]);

/**
 * `from` com destino explícito (identidade). `gsap.from` lê o destino do estado atual do
 * elemento; se esse estado já estiver escondido (re-render, refresh), o elemento ficava
 * preso invisível. Aqui o fim da animação é sempre o estado visível.
 */
export function reveal(
  targets: gsap.TweenTarget,
  from: gsap.TweenVars,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  const to: gsap.TweenVars = {};
  for (const key of Object.keys(from)) {
    if (!FROM_KEYS.has(key)) continue;
    to[key] = key === 'autoAlpha' || key === 'opacity' || key.startsWith('scale') ? 1 : 0;
  }
  return gsap.fromTo(targets, from, { ...to, ...vars });
}
