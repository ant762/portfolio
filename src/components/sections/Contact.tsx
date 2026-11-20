'use client';

import { useRef, useState } from 'react';
import { Magnetic } from '@/components/ui/Magnetic';
import { SplitWords } from '@/components/ui/SplitWords';
import { site, socials } from '@/data/site';
import { useI18n } from '@/i18n/useI18n';
import { prefersReducedMotion, reveal, useGSAP } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/scroll';

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const socialHandle = (label: string, fallback: string) =>
    label === 'LinkedIn' ? t.socials.linkedin : fallback;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      reveal(
        '[data-word]',
        { yPercent: 115 },
        {
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-contact-title]', start: 'top 80%' },
        },
      );
      reveal(
        '[data-contact-fade]',
        { y: 40, autoAlpha: 0 },
        {
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-contact-body]', start: 'top 85%' },
        },
      );
      reveal(
        '[data-cta]',
        { scale: 0 },
        {
          duration: 1.4,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: '[data-cta]', start: 'top 90%' },
        },
      );
    },
    { scope: rootRef, dependencies: [t] },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section
      ref={rootRef}
      id="contact"
      className="px-gutter flex min-h-svh flex-col justify-between pt-[clamp(6rem,12vw,12rem)] pb-8"
    >
      <div>
        <p className="label-mono text-muted">{t.contact.label}</p>
        <h2 data-contact-title className="text-display-lg mt-6 max-w-[14ch] font-bold uppercase">
          <SplitWords text={t.contact.title} />
        </h2>
      </div>

      <div data-contact-body className="mt-16 grid gap-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p data-contact-fade className="label-mono text-muted">
            {t.contact.prompt}
          </p>
          <div data-contact-fade className="mt-3 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="decoration-line hover:decoration-accent text-[clamp(1.4rem,3.2vw,3rem)] font-semibold tracking-tight underline underline-offset-8 transition-colors"
            >
              {site.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="label-mono border-line hover:border-accent hover:text-accent rounded-full border px-4 py-2 transition-colors"
              aria-live="polite"
            >
              {copied ? t.contact.copied : t.contact.copy}
            </button>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-px md:max-w-xl">
            {socials
              .filter((s) => s.label !== 'Email')
              .map((social) => (
                <li key={social.label} data-contact-fade className="border-line border-t">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4"
                  >
                    <span>
                      <span className="block text-xl font-semibold tracking-tight">
                        {social.label}
                      </span>
                      <span className="label-mono text-muted">
                        {socialHandle(social.label, social.handle)}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="ease-expo group-hover:text-accent text-2xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="md:col-span-5 md:justify-self-end">
          <Magnetic strength={0.4}>
            <a
              data-cta
              href={`mailto:${site.email}`}
              className="group bg-accent text-on-accent ease-expo flex size-[clamp(10rem,22vw,18rem)] flex-col items-center justify-center gap-2 rounded-full transition-transform duration-700 hover:scale-105"
            >
              <span className="text-[clamp(1.2rem,2.2vw,2rem)] font-bold tracking-tight uppercase">
                {t.contact.getInTouch}
              </span>
              <span
                aria-hidden="true"
                className="ease-expo text-4xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <footer className="label-mono border-line text-paper mt-24 flex items-center justify-between border-t pt-6">
        <p>Maik</p>
        <button
          type="button"
          onClick={() => scrollToTarget(0, { duration: 2 })}
          className="hover:text-accent text-right transition-colors"
        >
          {t.contact.backToTop}
        </button>
      </footer>
    </section>
  );
}
