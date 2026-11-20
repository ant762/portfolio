'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useTransition } from '@/components/providers/TransitionProvider';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  /** Texto exibido no centro da transição enquanto a tela está coberta. */
  label?: string;
};

export function TransitionLink({ href, label, onClick, children, ...rest }: Props) {
  const { navigate } = useTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href, { label });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
