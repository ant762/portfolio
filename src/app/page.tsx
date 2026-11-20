import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Credentials } from '@/components/sections/Credentials';
import { Environments } from '@/components/sections/Environments';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { Work } from '@/components/sections/Work';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <Environments />
      <About />
      <Credentials />
      <Contact />
    </>
  );
}
