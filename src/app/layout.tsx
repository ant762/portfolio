import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/cinzel';
import '@fontsource/unifrakturcook/700.css';
import './globals.css';

import { AtmosphereLoader } from '@/components/webgl/AtmosphereLoader';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Preloader } from '@/components/layout/Preloader';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { TransitionProvider } from '@/components/providers/TransitionProvider';
import { LocaleSync } from '@/components/providers/LocaleSync';
import { SoundProvider } from '@/components/providers/SoundProvider';
import { Cursor } from '@/components/ui/Cursor';
import { SkipLink } from '@/components/ui/SkipLink';
import { SITE_URL, site, socials } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.handle}.dev`,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  keywords: ['Fullstack Developer', 'Luau', 'JavaScript', 'TypeScript', 'Next.js', 'Portfolio'],
  alternates: { canonical: '/' },
  icons: { icon: site.ogImage, apple: site.ogImage },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: `${site.handle}.dev`,
    title: site.title,
    description: site.tagline,
    images: [{ url: site.ogImage, width: 800, height: 800, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.tagline,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.handle,
  url: SITE_URL,
  jobTitle: site.role,
  image: `${SITE_URL}${site.ogImage}`,
  email: site.email,
  sameAs: socials.filter((s) => s.href.startsWith('https://')).map((s) => s.href),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{'.preloader{display:none!important}'}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <SkipLink />

        <LocaleSync />
        <SoundProvider />
        <AtmosphereLoader />
        <SmoothScroll>
          <TransitionProvider>
            <Preloader />
            <Cursor />
            <Navbar />
            <main id="main">{children}</main>
          </TransitionProvider>
        </SmoothScroll>

        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
