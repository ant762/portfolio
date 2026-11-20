'use client';

import { useSyncExternalStore } from 'react';
import {
  getEverReadySnapshot,
  getReadyServerSnapshot,
  getReadySnapshot,
  subscribeReady,
} from '@/lib/ready';

export function useSiteReady(): boolean {
  return useSyncExternalStore(subscribeReady, getReadySnapshot, getReadyServerSnapshot);
}

/** Verdadeiro após o preloader; permanece verdadeiro durante as transições de rota. */
export function useEverReady(): boolean {
  return useSyncExternalStore(subscribeReady, getEverReadySnapshot, getReadyServerSnapshot);
}
