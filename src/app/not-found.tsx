import { TransitionLink } from '@/components/ui/TransitionLink';

export default function NotFound() {
  return (
    <section className="px-gutter flex min-h-svh flex-col items-start justify-center gap-8">
      <p className="label-mono text-accent">Error 404</p>
      <h1 className="text-display-xl font-bold uppercase">Lost</h1>
      <p className="text-paper/70 max-w-md text-xl">
        This page wandered off the map. Let&apos;s get you back to somewhere familiar.
      </p>
      <TransitionLink
        href="/"
        label="Home"
        className="label-mono bg-accent text-ink rounded-full px-6 py-3 transition-transform hover:scale-105"
      >
        Back home ↗
      </TransitionLink>
    </section>
  );
}
