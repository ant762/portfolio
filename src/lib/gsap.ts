import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
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
