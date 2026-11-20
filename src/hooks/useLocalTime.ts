'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';

/** Hora local de um fuso. Retorna "--:--" até montar (evita mismatch de hidratação). */
export function useLocalTime(timeZone: string): string {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const update = () => setTime(formatTime(new Date(), timeZone));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}
