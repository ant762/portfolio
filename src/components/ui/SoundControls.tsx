'use client';

import { useSound } from '@/hooks/useSound';
import { useI18n } from '@/i18n/useI18n';
import { setMusic, setSfx } from '@/lib/sound';
import { cn } from '@/lib/utils';

function Bars({ active }: { active: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn('w-[2px] bg-current', active ? 'eq-bar' : 'h-[3px]')}
          style={active ? { animationDelay: `${i * 0.17}s` } : undefined}
        />
      ))}
    </span>
  );
}

function Pointer({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
      <path
        d="M2 1l8 5-3.5.8L5.5 10.5z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dois interruptores independentes: música e efeitos (efeitos + cliques). */
export function SoundControls({ className }: { className?: string }) {
  const { music, sfx } = useSound();
  const { t } = useI18n();

  const base =
    'flex items-center gap-2 py-1 transition-colors [&[aria-pressed=false]]:opacity-55 hover:text-spark hover:opacity-100';

  return (
    <div className={cn('flex items-center gap-4', className)} role="group" aria-label={t.ui.music}>
      <button
        type="button"
        aria-pressed={music}
        aria-label={music ? t.ui.musicOn : t.ui.musicOff}
        onClick={() => setMusic(!music)}
        className={base}
      >
        <Bars active={music} />
        <span className="hidden sm:inline">{t.ui.music}</span>
      </button>
      <button
        type="button"
        aria-pressed={sfx}
        aria-label={sfx ? t.ui.effectsOn : t.ui.effectsOff}
        onClick={() => setSfx(!sfx)}
        className={base}
      >
        <Pointer active={sfx} />
        <span className="hidden sm:inline">{t.ui.effects}</span>
      </button>
    </div>
  );
}
