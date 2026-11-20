import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface SplitWordsProps {
  text: string;
  className?: string;
  /** Classe extra aplicada a cada palavra animável. */
  wordClassName?: string;
  /** Atributo usado pelos componentes de animação para localizar as palavras. */
  attr?: 'data-word' | 'data-scrub-word';
  /** Esconde o excesso (efeito de "máscara") para animações de subida. */
  mask?: boolean;
}

/**
 * Divide um texto em palavras para animação. O texto completo fica acessível
 * via `sr-only`; as palavras visuais ficam `aria-hidden`.
 */
export function SplitWords({
  text,
  className,
  wordClassName,
  attr = 'data-word',
  mask = true,
}: SplitWordsProps) {
  const words = text.split(' ');
  const dataAttr = { [attr]: '' };

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span
              className={cn(
                'inline-block align-top',
                mask && '-mb-[0.14em] overflow-hidden pb-[0.14em]',
              )}
            >
              <span
                {...dataAttr}
                className={cn('inline-block will-change-transform', wordClassName)}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}
