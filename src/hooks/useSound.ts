'use client';

import { useSyncExternalStore } from 'react';
import {
  getSoundServerSnapshot,
  getSoundSnapshot,
  subscribeSound,
  type SoundState,
} from '@/lib/sound';

export function useSound(): SoundState {
  return useSyncExternalStore(subscribeSound, getSoundSnapshot, getSoundServerSnapshot);
}
