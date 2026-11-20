'use client';

import dynamic from 'next/dynamic';

const Atmosphere = dynamic(() => import('./Atmosphere').then((m) => m.Atmosphere), {
  ssr: false,
});

export function AtmosphereLoader() {
  return <Atmosphere />;
}
