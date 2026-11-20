/**
 * "Palco visível": true quando o preloader terminou e nenhuma transição de rota
 * está cobrindo a tela. As animações de entrada das seções esperam este sinal.
 */
let ready = false;
const listeners = new Set<() => void>();

export function setSiteReady(value: boolean): void {
  if (ready === value) return;
  ready = value;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.ready = String(value);
  }
  listeners.forEach((listener) => listener());
}

export function subscribeReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getReadySnapshot = (): boolean => ready;
export const getReadyServerSnapshot = (): boolean => false;
