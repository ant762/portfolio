'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Magnetic } from '@/components/ui/Magnetic';
import { useI18n } from '@/i18n/useI18n';
import { gsap, prefersReducedMotion, reveal, useGSAP } from '@/lib/gsap';
import { playSfx, type Sfx } from '@/lib/sound';
import { cn } from '@/lib/utils';

const ACCENT = '#ffffff';
const PAPER = '#f5f5f5';

function Tile({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div
      data-fidget
      data-sfx="own"
      className="border-line bg-ink/40 relative flex min-h-72 flex-col rounded-sm border p-5 backdrop-blur-sm"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="label-mono">{title}</h4>
        <p className="label-mono text-muted text-right normal-case">{hint}</p>
      </div>
      <div className="relative mt-4 flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

/* 1. Spinner: arraste/lance, com inércia e atrito. */
function Spinner({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let angle = 0;
    let vel = 0;
    let last = 0;
    let acc = 0;
    let dragging = false;
    let raf = 0;
    let running = false;

    const render = () => {
      el.style.transform = `rotate(${angle}deg)`;
    };
    const tick = () => {
      if (!dragging) {
        vel *= 0.985;
        angle += vel;
        acc += Math.abs(vel);
      }
      if (acc > 60) {
        acc = 0;
        playSfx('hover');
      }
      render();
      if (dragging || Math.abs(vel) > 0.05) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pointerAngle = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return (
        (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
        Math.PI
      );
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      vel = 0;
      last = pointerAngle(e);
      el.setPointerCapture(e.pointerId);
      start();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const a = pointerAngle(e);
      let d = a - last;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      angle += d;
      vel = d;
      acc += Math.abs(d);
      last = a;
    };
    const up = () => {
      dragging = false;
      start();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      vel = 28;
      start();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('keydown', key);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      tabIndex={0}
      aria-label={label}
      data-cursor="spin"
      className="size-48 cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <svg viewBox="-50 -50 100 100" className="size-full" aria-hidden="true">
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <circle cx="0" cy="-30" r="14" fill="none" stroke={ACCENT} strokeWidth="2" />
            <circle cx="0" cy="-30" r="5" fill={PAPER} />
            <line x1="0" y1="-6" x2="0" y2="-16" stroke={PAPER} strokeWidth="2" opacity="0.6" />
          </g>
        ))}
        <circle r="10" fill="#000000" stroke={PAPER} strokeWidth="2" />
        <circle r="3" fill={ACCENT} />
      </svg>
    </div>
  );
}

/* 2. Plástico-bolha. */
function Bubbles({ reset }: { reset: string }) {
  const [popped, setPopped] = useState<boolean[]>(() => Array.from({ length: 20 }, () => false));
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const all = popped.every(Boolean);

  const pop = (i: number) => {
    if (popped[i]) return;
    setPopped((p) => p.map((v, idx) => (idx === i ? true : v)));
    playSfx('click');
    const el = refs.current[i];
    if (el) {
      gsap.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }
  };
  const again = () => {
    setPopped(Array.from({ length: 20 }, () => false));
    playSfx('on');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-5 gap-2">
        {popped.map((isPopped, i) => (
          <button
            key={i}
            type="button"
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-label={`${i + 1}`}
            aria-pressed={isPopped}
            onPointerEnter={(e) => e.buttons === 1 && pop(i)}
            onClick={() => pop(i)}
            className={cn(
              'size-11 rounded-full border transition-colors duration-300',
              isPopped
                ? 'border-line bg-transparent'
                : 'border-accent/60 bg-accent/25 hover:bg-accent/60 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.5),inset_3px_3px_6px_rgba(255,255,255,0.12)]',
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={again}
        disabled={!all}
        className="label-mono border-line enabled:hover:border-spark enabled:hover:text-spark rounded-full border px-4 py-2 transition-colors disabled:opacity-40"
      >
        {reset}
      </button>
    </div>
  );
}

/* 3. Botão magnético. */
function MagnetButton({ label }: { label: string }) {
  return (
    <Magnetic strength={0.6}>
      <button
        type="button"
        onClick={() => playSfx('hit')}
        className="bg-accent text-on-accent label-mono size-32 rounded-full transition-transform duration-300 active:scale-90"
      >
        {label}
      </button>
    </Magnetic>
  );
}

/* 4. Cartão 3D com brilho que segue o cursor. */
function TiltCard({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(el, {
      rotationY: (px - 0.5) * 30,
      rotationX: (0.5 - py) * 30,
      transformPerspective: 700,
      duration: 0.4,
      ease: 'power3.out',
    });
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (el) gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  };
  return (
    <div
      ref={ref}
      onPointerDown={move}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerUp={leave}
      onPointerCancel={leave}
      className="border-accent/50 relative flex h-44 w-64 touch-pan-y items-end overflow-hidden rounded-sm border p-4"
      style={{
        background:
          'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.45), rgba(0,0,0,0.9) 65%)',
      }}
    >
      <span className="font-gothic text-4xl leading-none">{label}</span>
    </div>
  );
}

/* 5. Explosão de partículas no clique. */
function Burst({ label }: { label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const fire = (e: React.PointerEvent) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    playSfx('whoosh');
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement('span');
      const size = 4 + Math.random() * 7;
      dot.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? '50%' : '1px'};background:${Math.random() > 0.4 ? ACCENT : PAPER};pointer-events:none`;
      el.appendChild(dot);
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 110;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 40,
        rotation: Math.random() * 540 - 270,
        autoAlpha: 0,
        duration: 0.8 + Math.random() * 0.6,
        ease: 'power3.out',
        onComplete: () => dot.remove(),
      });
    }
  };
  return (
    <div
      ref={box}
      onPointerDown={fire}
      className="label-mono text-muted border-line relative flex size-full min-h-52 cursor-crosshair items-center justify-center overflow-hidden rounded-sm border border-dashed select-none"
    >
      {label}
    </div>
  );
}

/* 6. Texto que embaralha ao passar o cursor. */
const GLYPHS = '█▓▒░#%&@$ΞΩ∆✠';
function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const timer = useRef(0);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const run = () => {
    window.clearInterval(timer.current);
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame++;
      setOut(
        text
          .split('')
          .map((ch, i) =>
            ch === ' ' || i < frame / 2
              ? ch
              : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ch),
          )
          .join(''),
      );
      if (frame / 2 >= text.length) {
        window.clearInterval(timer.current);
        setOut(text);
      }
    }, 35);
    playSfx('hover');
  };
  return (
    <button
      type="button"
      onPointerEnter={run}
      onFocus={run}
      className="font-display hover:text-spark text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-tight uppercase transition-colors"
      aria-label={text}
    >
      <span aria-hidden="true">{out}</span>
    </button>
  );
}

/* 7. Interruptores com mola. */
function Switch() {
  const [on, setOn] = useState(false);
  const knob = useRef<HTMLSpanElement>(null);
  const toggle = () => {
    const next = !on;
    setOn(next);
    playSfx(next ? 'on' : 'off');
    if (knob.current) {
      gsap.to(knob.current, { x: next ? 36 : 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={cn(
        'h-9 w-[4.5rem] rounded-full border p-1 transition-colors duration-300',
        on ? 'border-accent bg-accent/30' : 'border-line bg-transparent',
      )}
    >
      <span
        ref={knob}
        className={cn(
          'block size-6 rounded-full transition-colors duration-300',
          on ? 'bg-accent' : 'bg-paper',
        )}
      />
    </button>
  );
}

/* 8. Combo clicker. */
function Combo({ label, unit }: { label: string; unit: string }) {
  const [count, setCount] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const click = () => {
    const next = count + 1;
    setCount(next);
    if (btn.current) {
      gsap.fromTo(
        btn.current,
        { scale: 0.86 },
        { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' },
      );
    }
    if (next % 10 === 0) {
      playSfx('hit');
      if (root.current) {
        gsap.fromTo(root.current, { x: -8 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.15)' });
      }
    } else {
      playSfx('click');
    }
  };
  return (
    <div ref={root} className="flex flex-col items-center gap-3">
      <span
        className={cn(
          'font-display text-7xl leading-none font-bold tabular-nums transition-colors',
          count > 0 && count % 10 === 0 && 'text-accent',
        )}
      >
        {count}
      </span>
      <span className="label-mono text-muted">{label}</span>
      <button
        ref={btn}
        type="button"
        onClick={click}
        className="border-accent text-accent hover:bg-accent hover:text-on-accent label-mono rounded-full border px-8 py-3 transition-colors"
      >
        + {unit}
      </button>
    </div>
  );
}

/* 9. Gravidade: clique para soltar bolas que quicam. */
interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
}
function Gravity({ clear, countLabel }: { clear: string; countLabel: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);
  const raf = useRef(0);
  const size = useRef({ w: 300, h: 220 });
  const [count, setCount] = useState(0);

  const start = useRef<() => void>(() => undefined);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      cv.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.current = { w: r.width, h: r.height };
    };
    fit();
    function loop() {
      const cv = canvas.current;
      const ctx = cv?.getContext('2d');
      if (!cv || !ctx) return;
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);
      let moving = false;
      for (const b of balls.current) {
        b.vy += 0.35;
        b.x += b.vx;
        b.y += b.vy;
        if (b.y + b.r > h) {
          b.y = h - b.r;
          if (Math.abs(b.vy) > 1.2) playSfx('hover');
          b.vy *= -0.78;
          b.vx *= 0.94;
        }
        if (b.x - b.r < 0 || b.x + b.r > w) {
          b.x = Math.min(Math.max(b.x, b.r), w - b.r);
          b.vx *= -0.85;
        }
        if (Math.abs(b.vy) > 0.4 || Math.abs(b.vx) > 0.05 || b.y + b.r < h - 1) moving = true;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.c;
        ctx.fill();
      }
      raf.current = moving ? requestAnimationFrame(loop) : 0;
    }
    start.current = () => {
      if (!raf.current) raf.current = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const drop = (e: React.PointerEvent) => {
    const cv = canvas.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    if (balls.current.length >= 40) balls.current.shift();
    balls.current.push({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      vx: (Math.random() - 0.5) * 6,
      vy: -2 - Math.random() * 3,
      r: 7 + Math.random() * 10,
      c: Math.random() > 0.45 ? ACCENT : PAPER,
    });
    setCount(balls.current.length);
    start.current();
  };
  const wipe = () => {
    balls.current = [];
    setCount(0);
    canvas.current?.getContext('2d')?.clearRect(0, 0, size.current.w, size.current.h);
  };

  return (
    <div className="flex size-full flex-col gap-3">
      <canvas
        ref={canvas}
        onPointerDown={drop}
        className="border-line h-52 w-full cursor-pointer touch-none rounded-sm border"
        aria-label={countLabel}
      />
      <div className="label-mono text-muted flex items-center justify-between">
        <span className="tabular-nums">
          {count} {countLabel}
        </span>
        <button type="button" onClick={wipe} className="hover:text-spark transition-colors">
          {clear}
        </button>
      </div>
    </div>
  );
}

/* 10. Pads de som (efeitos procedurais do site). */
function Pads() {
  const pads: Sfx[] = ['click', 'hover', 'whoosh', 'hit'];
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const hit = (sfx: Sfx, i: number) => {
    playSfx(sfx);
    const el = refs.current[i];
    if (el) {
      gsap.fromTo(
        el,
        { backgroundColor: ACCENT, scale: 0.92 },
        { backgroundColor: 'rgba(255,255,255,0.12)', scale: 1, duration: 0.6, ease: 'power3.out' },
      );
    }
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      {pads.map((sfx, i) => (
        <button
          key={sfx}
          type="button"
          ref={(el) => {
            refs.current[i] = el;
          }}
          onPointerDown={() => hit(sfx, i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') hit(sfx, i);
          }}
          className="label-mono border-accent/50 bg-accent/10 size-24 rounded-sm border"
        >
          {sfx}
        </button>
      ))}
    </div>
  );
}

export function Playground() {
  const { t } = useI18n();
  const p = t.playground;
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      reveal(
        '[data-feature]',
        { y: 30, autoAlpha: 0 },
        {
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-features]', start: 'top 85%' },
        },
      );
      reveal(
        '[data-fidget]',
        { y: 40, autoAlpha: 0 },
        {
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-fidgets]', start: 'top 85%' },
        },
      );
    },
    { scope: rootRef, dependencies: [t] },
  );

  const f = p.fidgets;
  return (
    <section ref={rootRef} className="px-gutter pb-[clamp(5rem,12vw,12rem)]">
      <div className="grid gap-12 md:grid-cols-12">
        <p className="label-mono text-muted md:col-span-3">{p.label}</p>
        <div className="md:col-span-9">
          <h3 className="text-display-md font-bold uppercase">{p.title}</h3>
          <p className="text-paper/80 mt-8 max-w-3xl text-xl leading-snug">{p.intro}</p>
          <p className="text-muted mt-4 max-w-3xl text-lg leading-snug">{p.later}</p>
        </div>
      </div>

      <div data-features className="mt-16 md:ml-[25%]">
        <p className="label-mono text-muted">{p.featuresTitle}</p>
        <ul className="mt-4">
          {p.features.map((item, i) => (
            <li
              key={item.title}
              data-feature
              className="border-line grid gap-2 border-t py-5 md:grid-cols-[3rem_16rem_1fr]"
            >
              <span className="label-mono text-muted tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xl font-semibold tracking-tight">{item.title}</span>
              <span className="text-paper/70">{item.text}</span>
            </li>
          ))}
          <li className="border-line border-t" aria-hidden="true" />
        </ul>
      </div>

      <div data-fidgets className="mt-[clamp(4rem,9vw,8rem)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono text-muted">{p.fidgetsLabel}</p>
            <h3 className="text-display-md mt-3 font-bold uppercase">{p.fidgetsTitle}</h3>
          </div>
          <p className="label-mono text-muted max-w-sm text-right normal-case">{p.fidgetsHint}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile title={f.spinner.title} hint={f.spinner.hint}>
            <Spinner label={f.spinner.title} />
          </Tile>
          <Tile title={f.bubbles.title} hint={f.bubbles.hint}>
            <Bubbles reset={p.ui.reset} />
          </Tile>
          <Tile title={f.magnet.title} hint={f.magnet.hint}>
            <MagnetButton label={f.magnet.title} />
          </Tile>
          <Tile title={f.tilt.title} hint={f.tilt.hint}>
            <TiltCard label="ant762" />
          </Tile>
          <Tile title={f.burst.title} hint={f.burst.hint}>
            <Burst label={f.burst.hint} />
          </Tile>
          <Tile title={f.scramble.title} hint={f.scramble.hint}>
            <Scramble text="ANT762" />
          </Tile>
          <Tile title={f.switches.title} hint={f.switches.hint}>
            <div className="flex flex-col gap-4">
              <Switch />
              <Switch />
              <Switch />
            </div>
          </Tile>
          <Tile title={f.combo.title} hint={f.combo.hint}>
            <Combo label={p.ui.combo} unit={p.ui.hit} />
          </Tile>
          <Tile title={f.gravity.title} hint={f.gravity.hint}>
            <Gravity clear={p.ui.clear} countLabel={p.ui.balls} />
          </Tile>
          <Tile title={f.pads.title} hint={f.pads.hint}>
            <Pads />
          </Tile>
        </div>
      </div>
    </section>
  );
}
