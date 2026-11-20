'use client';

import { useSyncExternalStore } from 'react';
import { getReadyServerSnapshot, getReadySnapshot, subscribeReady } from '@/lib/ready';

export function useSiteReady(): boolean {
  return useSyncExternalStore(subscribeReady, getReadySnapshot, getReadyServerSnapshot);
}
