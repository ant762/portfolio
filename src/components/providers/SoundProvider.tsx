'use client';

import { useEffect } from 'react';
import { initSound, playSfx, setAudioVisible, unlockAudio } from '@/lib/sound';

const OWN_SFX = '[data-sfx="own"]';
const INTERACTIVE = 'a, button, [role="button"], [data-cursor], summary, label';

/** Listeners globais: libera o áudio no 1º gesto, toca clique/hover e pausa com a aba oculta. */
export function SoundProvider() {
  useEffect(() => {
    initSound();

    const onPointerDown = (event: PointerEvent) => {
      unlockAudio();
      // Elementos com som próprio (ex.: fidgets) não recebem o clique genérico por cima.
      if ((event.target as Element | null)?.closest?.(OWN_SFX)) return;
      playSfx('click');
    };
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const el = (event.target as Element | null)?.closest?.(INTERACTIVE);
      if (!el || el.closest(OWN_SFX)) return;
      const from = event.relatedTarget as Node | null;
      if (from && el.contains(from)) return; // ainda dentro do mesmo elemento
      playSfx('hover');
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') unlockAudio();
    };
    const onVisibility = () => setAudioVisible(!document.hidden);

    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('keydown', onKey, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return null;
}
