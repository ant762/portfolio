import type Lenis from 'lenis';

let lenis: Lenis | null = null;
const locks = new Set<string>();

function apply(): void {
  if (typeof document === 'undefined') return;
  const locked = locks.size > 0;
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
  apply();
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Trava o scroll por um motivo nomeado (preloader, menu...). Vários motivos podem coexistir. */
export function lockScroll(reason: string): void {
  locks.add(reason);
  apply();
}

export function unlockScroll(reason: string): void {
  locks.delete(reason);
  apply();
}

interface ScrollOptions {
  immediate?: boolean;
  offset?: number;
  duration?: number;
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  { immediate = false, offset = 0, duration = 1.5 }: ScrollOptions = {},
): void {
  if (lenis) {
    lenis.scrollTo(target, {
      immediate,
      offset,
      duration,
      force: true,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
    return;
  }

  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior, block: 'start' });
}
