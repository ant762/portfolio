/**
 * Áudio 100% procedural (Web Audio): trilha darkwave + efeitos sonoros.
 * Sem arquivos de áudio => sem licenças, sem download. Padrão: tudo DESLIGADO.
 * O navegador só libera áudio após um gesto do usuário, então o contexto é
 * criado em `unlockAudio()` (chamado pelo SoundProvider no primeiro clique).
 */

export interface SoundState {
  music: boolean;
  sfx: boolean;
}

const STORAGE_KEY = 'ant762:sound';
const BPM = 96;
const STEP = 60 / BPM / 4; // semicolcheia
const LOOKAHEAD = 0.14;

let state: SoundState = { music: false, sfx: false };
const listeners = new Set<() => void>();
const SERVER_STATE: SoundState = { music: false, sfx: false };

export const getSoundSnapshot = (): SoundState => state;
export const getSoundServerSnapshot = (): SoundState => SERVER_STATE;
export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: SoundState): void {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

/** Carrega a preferência salva (só no cliente, depois de hidratar). */
export function initSound(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<SoundState>;
    state = { music: parsed.music === true, sfx: parsed.sfx === true };
    listeners.forEach((l) => l());
  } catch {
    /* ignore */
  }
}

/* ----------------------------- contexto e grafo ---------------------------- */

interface Graph {
  ctx: AudioContext;
  musicBus: GainNode;
  sfxBus: GainNode;
  reverb: ConvolverNode;
  delay: DelayNode;
  noise: AudioBuffer;
}

let graph: Graph | null = null;

function createReverbImpulse(ctx: AudioContext): AudioBuffer {
  const seconds = 2.6;
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
    }
  }
  return buffer;
}

function getGraph(): Graph | null {
  if (graph) return graph;
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);

  const musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);

  const sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.7;
  sfxBus.connect(master);

  const reverb = ctx.createConvolver();
  reverb.buffer = createReverbImpulse(ctx);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.55;
  reverb.connect(reverbGain).connect(musicBus);

  // Delay pontuado com realimentação filtrada (eco típico do darkwave).
  const delay = ctx.createDelay(2);
  delay.delayTime.value = STEP * 3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.42;
  const delayTone = ctx.createBiquadFilter();
  delayTone.type = 'lowpass';
  delayTone.frequency.value = 2200;
  delay.connect(delayTone).connect(feedback).connect(delay);
  delayTone.connect(musicBus);

  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  graph = { ctx, musicBus, sfxBus, reverb, delay, noise };
  return graph;
}

/* -------------------------------- sequenciador ----------------------------- */

const midi = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

// Am – F – C – E (um compasso cada). [baixo, tríade]
const CHORDS: ReadonlyArray<{ bass: number; notes: readonly number[] }> = [
  { bass: 33, notes: [57, 60, 64] },
  { bass: 29, notes: [53, 57, 60] },
  { bass: 36, notes: [55, 60, 64] },
  { bass: 28, notes: [52, 56, 59] },
];
const ARP = [0, 2, 1, 2, 0, 1, 2, 1] as const;

let timer: number | null = null;
let nextTime = 0;
let step = 0;
let playing = false;

function tone(
  g: Graph,
  type: OscillatorType,
  freq: number,
  t: number,
  dur: number,
  gain: number,
  opts: {
    cutoff?: number;
    attack?: number;
    detune?: number;
    sends?: boolean;
    dest?: AudioNode;
  } = {},
): void {
  const { ctx } = g;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = opts.detune ?? 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(opts.cutoff ?? 2000, t);
  const env = ctx.createGain();
  const attack = opts.attack ?? 0.005;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc
    .connect(filter)
    .connect(env)
    .connect(opts.dest ?? g.musicBus);
  if (opts.sends) {
    env.connect(g.reverb);
    env.connect(g.delay);
  }
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseHit(
  g: Graph,
  t: number,
  dur: number,
  gain: number,
  freq: number,
  type: BiquadFilterType,
  dest?: AudioNode,
): void {
  const src = g.ctx.createBufferSource();
  src.buffer = g.noise;
  src.loop = true;
  const filter = g.ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const env = g.ctx.createGain();
  env.gain.setValueAtTime(gain, t);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src
    .connect(filter)
    .connect(env)
    .connect(dest ?? g.musicBus);
  src.start(t);
  src.stop(t + dur + 0.05);
}

function kick(g: Graph, t: number): void {
  const osc = g.ctx.createOscillator();
  const env = g.ctx.createGain();
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  env.gain.setValueAtTime(0.9, t);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  osc.connect(env).connect(g.musicBus);
  osc.start(t);
  osc.stop(t + 0.35);
}

function scheduleStep(g: Graph, s: number, t: number): void {
  const bar = Math.floor(s / 16) % CHORDS.length;
  const i = s % 16;
  const chord = CHORDS[bar];
  if (!chord) return;

  // Percussão
  if (i === 0 || i === 8 || i === 10) kick(g, t);
  if (i === 4 || i === 12) {
    noiseHit(g, t, 0.18, 0.5, 1800, 'bandpass');
    tone(g, 'triangle', 190, t, 0.1, 0.25);
    noiseHit(g, t, 1.2, 0.08, 1200, 'highpass', g.reverb);
  }
  if (i % 2 === 0) noiseHit(g, t, 0.04, i % 4 === 2 ? 0.22 : 0.12, 7500, 'highpass');

  // Baixo em colcheias, com salto de oitava
  if (i % 2 === 0) {
    const note = chord.bass + (i === 6 || i === 14 ? 12 : 0);
    tone(g, 'sawtooth', midi(note), t, STEP * 1.8, 0.26, { cutoff: 520 });
  }

  // Pad: tríade com três osciladores levemente desafinados por nota
  if (i === 0) {
    for (const n of chord.notes) {
      for (const d of [-9, 0, 9]) {
        tone(g, 'sawtooth', midi(n), t, STEP * 16, 0.035, {
          cutoff: 1100,
          attack: 0.9,
          detune: d,
          sends: true,
        });
      }
    }
  }

  // Arpejo com delay + reverb
  if (i % 2 === 0) {
    const idx = ARP[(i / 2) % ARP.length] ?? 0;
    const note = (chord.notes[idx] ?? 60) + 12;
    tone(g, 'triangle', midi(note), t, STEP * 3, 0.1, { cutoff: 3200, sends: true });
  }
}

function scheduler(): void {
  const g = graph;
  if (!g || !playing) return;
  while (nextTime < g.ctx.currentTime + LOOKAHEAD) {
    scheduleStep(g, step, nextTime);
    nextTime += STEP;
    step = (step + 1) % (16 * CHORDS.length);
  }
}

function startMusic(): void {
  const g = getGraph();
  if (!g || playing) return;
  void g.ctx.resume();
  playing = true;
  step = 0;
  nextTime = g.ctx.currentTime + 0.1;
  g.musicBus.gain.cancelScheduledValues(g.ctx.currentTime);
  g.musicBus.gain.setValueAtTime(g.musicBus.gain.value, g.ctx.currentTime);
  g.musicBus.gain.linearRampToValueAtTime(0.5, g.ctx.currentTime + 2.5);
  timer = window.setInterval(scheduler, 25);
  scheduler();
}

function stopMusic(): void {
  const g = graph;
  if (!g || !playing) return;
  playing = false;
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  g.musicBus.gain.cancelScheduledValues(g.ctx.currentTime);
  g.musicBus.gain.setValueAtTime(g.musicBus.gain.value, g.ctx.currentTime);
  g.musicBus.gain.linearRampToValueAtTime(0, g.ctx.currentTime + 0.8);
}

/* ---------------------------------- efeitos -------------------------------- */

export type Sfx = 'click' | 'hover' | 'whoosh' | 'hit' | 'on' | 'off';

function sfxVoice(name: Sfx): void {
  const g = graph;
  if (!g) return;
  const t = g.ctx.currentTime;
  const dest = g.sfxBus;
  switch (name) {
    case 'click':
      noiseHit(g, t, 0.03, 0.35, 3200, 'highpass', dest);
      tone(g, 'sine', 620, t, 0.07, 0.3, { dest, cutoff: 4000 });
      break;
    case 'hover':
      tone(g, 'sine', 1480, t, 0.05, 0.07, { dest, cutoff: 5000 });
      break;
    case 'whoosh': {
      const src = g.ctx.createBufferSource();
      src.buffer = g.noise;
      src.loop = true;
      const f = g.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(180, t);
      f.frequency.exponentialRampToValueAtTime(2600, t + 0.55);
      const env = g.ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.5, t + 0.3);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      src.connect(f).connect(env).connect(dest);
      src.start(t);
      src.stop(t + 0.9);
      break;
    }
    case 'hit': {
      const osc = g.ctx.createOscillator();
      const env = g.ctx.createGain();
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(38, t + 0.5);
      env.gain.setValueAtTime(0.7, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      osc.connect(env).connect(dest);
      osc.start(t);
      osc.stop(t + 0.75);
      noiseHit(g, t, 0.35, 0.25, 900, 'lowpass', dest);
      break;
    }
    case 'on':
      tone(g, 'triangle', 440, t, 0.12, 0.25, { dest });
      tone(g, 'triangle', 660, t + 0.08, 0.16, 0.25, { dest });
      break;
    case 'off':
      tone(g, 'triangle', 660, t, 0.12, 0.25, { dest });
      tone(g, 'triangle', 330, t + 0.08, 0.18, 0.25, { dest });
      break;
  }
}

let lastHover = 0;

export function playSfx(name: Sfx): void {
  if (!state.sfx || !graph) return;
  if (graph.ctx.state !== 'running') return;
  if (name === 'hover') {
    const now = performance.now();
    if (now - lastHover < 90) return;
    lastHover = now;
  }
  sfxVoice(name);
}

/* ------------------------------- controles --------------------------------- */

/** Chamar dentro de um gesto do usuário. Cria/retoma o contexto e inicia a música salva. */
export function unlockAudio(): void {
  if (!state.music && !state.sfx) return;
  const g = getGraph();
  if (!g) return;
  if (g.ctx.state !== 'running') void g.ctx.resume();
  if (state.music) startMusic();
}

export function setMusic(on: boolean): void {
  commit({ ...state, music: on });
  if (on) {
    startMusic();
  } else {
    stopMusic();
  }
  if (state.sfx) sfxVoice(on ? 'on' : 'off');
}

export function setSfx(on: boolean): void {
  commit({ ...state, sfx: on });
  if (on) {
    const g = getGraph();
    if (g) void g.ctx.resume();
    window.setTimeout(() => sfxVoice('on'), 30);
  }
}

/** Pausa/retoma com a visibilidade da aba (economiza CPU e respeita o usuário). */
export function setAudioVisible(visible: boolean): void {
  const g = graph;
  if (!g) return;
  if (!visible) {
    void g.ctx.suspend();
  } else if (state.music || state.sfx) {
    void g.ctx.resume();
  }
}
