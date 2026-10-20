// Generates every sound in assets/audio from code. No samples, recordings or third-party audio
// are used, so the output is original work covered by this repository's licence.
// Usage: npm run audio:generate   (write files)
//        npm run audio:check      (regenerate in memory and compare with the committed files)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RATE = 22050;
const OUT = join(__dirname, '..', 'assets', 'audio');
const TAU = Math.PI * 2;

// Deterministic noise so regeneration is byte-identical.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296 * 2 - 1;
  };
}
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const NOTE: Record<string, number> = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const n = (name: string) => { const m = /^([A-G][b#]?)(-?\d)$/.exec(name)!; return NOTE[m[1]] + (Number(m[2]) + 1) * 12; };

type Buf = Float32Array;
// Adds a voice into a buffer; with wrap=true the tail continues at the start (seamless loops).
function add(buf: Buf, start: number, voice: (t: number) => number, seconds: number, wrap: boolean) {
  const s0 = Math.round(start * RATE);
  const len = Math.round(seconds * RATE);
  for (let i = 0; i < len; i++) {
    let j = s0 + i;
    if (j >= buf.length) { if (!wrap) break; j %= buf.length; }
    buf[j] += voice(i / RATE);
  }
}

// Instruments -------------------------------------------------------------------------------
const env = (t: number, a: number, d: number) => t < a ? t / a : Math.exp(-(t - a) / d);
function electricPiano(freq: number, vel: number) {
  // Two-operator FM with a decaying index: a soft tine piano.
  return (t: number) => {
    const index = 1.6 * Math.exp(-t * 3.2) + 0.25;
    const mod = Math.sin(TAU * freq * t) * index;
    const body = Math.sin(TAU * freq * t + mod);
    const bell = Math.sin(TAU * freq * 4.0 * t) * 0.05 * Math.exp(-t * 9);
    return (body + bell) * env(t, 0.006, 1.25) * vel;
  };
}
function pad(freq: number, vel: number, length: number) {
  return (t: number) => {
    const a = Math.min(1, t / 1.6) * Math.min(1, Math.max(0, (length - t) / 1.4));
    const w = Math.sin(TAU * freq * t) + 0.32 * Math.sin(TAU * freq * 2.003 * t) + 0.12 * Math.sin(TAU * freq * 2.997 * t)
      + 0.5 * Math.sin(TAU * freq * 1.004 * t + 1.3);
    return w * a * vel * (0.85 + 0.15 * Math.sin(TAU * 0.21 * t));
  };
}
function bass(freq: number, vel: number) {
  return (t: number) => {
    const pluck = Math.sin(TAU * freq * t) + 0.28 * Math.sin(TAU * freq * 2 * t) * Math.exp(-t * 6);
    return pluck * env(t, 0.012, 0.55) * vel;
  };
}
function bell(freq: number, vel: number, decay = 1.1) {
  return (t: number) => {
    const mod = Math.sin(TAU * freq * 3.5 * t) * 1.4 * Math.exp(-t * 2.2);
    return (Math.sin(TAU * freq * t + mod) + 0.2 * Math.sin(TAU * freq * 2 * t)) * env(t, 0.003, decay) * vel;
  };
}
function noiseVoice(seed: number, shape: (t: number) => number, cutoff: number, highpass = 0) {
  const r = rng(seed);
  let lp = 0, hp = 0, prev = 0;
  const k = 1 - Math.exp(-TAU * cutoff / RATE);
  const kh = highpass ? Math.exp(-TAU * highpass / RATE) : 0;
  return (t: number) => {
    lp += k * (r() - lp);
    let v = lp;
    if (highpass) { hp = kh * (hp + v - prev); prev = v; v = hp; }
    return v * shape(t);
  };
}

// Effects -----------------------------------------------------------------------------------
function lowpass(buf: Buf, cutoff: number, passes = 1) {
  const k = 1 - Math.exp(-TAU * cutoff / RATE);
  let y = 0;
  for (let p = 0; p < passes; p++) for (let i = 0; i < buf.length; i++) { y += k * (buf[i] - y); buf[i] = y; }
}
// Small Schroeder hall. Looping material is processed twice so the reverb tail wraps cleanly.
function reverb(buf: Buf, mix: number, loop: boolean, size = 1) {
  const combs = [1557, 1617, 1491, 1422].map(d => ({ d: Math.round(d * size * RATE / 44100), b: new Float32Array(Math.round(d * size * RATE / 44100)), i: 0, f: 0 }));
  const alls = [225, 556].map(d => ({ b: new Float32Array(Math.round(d * RATE / 44100)), i: 0 }));
  const wet = new Float32Array(buf.length);
  for (let pass = 0; pass < (loop ? 2 : 1); pass++) {
    for (let i = 0; i < buf.length; i++) {
      const x = buf[i] * 0.25;
      let y = 0;
      for (const c of combs) {
        const out = c.b[c.i];
        c.f = out * 0.6 + c.f * 0.4;
        c.b[c.i] = x + c.f * 0.83;
        c.i = (c.i + 1) % c.b.length;
        y += out;
      }
      for (const a of alls) {
        const out = a.b[a.i];
        a.b[a.i] = y + out * 0.5;
        a.i = (a.i + 1) % a.b.length;
        y = out - y * 0.5;
      }
      wet[i] = y;
    }
  }
  for (let i = 0; i < buf.length; i++) buf[i] = buf[i] * (1 - mix) + wet[i] * mix * 2.2;
}
function normalize(buf: Buf, peakDb: number) {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const g = Math.pow(10, peakDb / 20) / (peak || 1);
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}
function fadeEdges(buf: Buf, inS: number, outS: number) {
  const a = Math.round(inS * RATE), b = Math.round(outS * RATE);
  for (let i = 0; i < a && i < buf.length; i++) buf[i] *= i / a;
  for (let i = 0; i < b && i < buf.length; i++) buf[buf.length - 1 - i] *= i / b;
}

function wav(buf: Buf): Buffer {
  const data = Buffer.alloc(buf.length * 2);
  for (let i = 0; i < buf.length; i++) data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[i] * 32767))), i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

// "Bellweather Nocturne": a slow D-minor night-hotel loop, 16 bars at 64 BPM (60 seconds).
function nocturne(): Buf {
  const bpm = 64, beat = 60 / bpm, bar = beat * 4, bars = 16;
  const buf = new Float32Array(Math.round(bar * bars * RATE));
  const chords: [string, string[]][] = [
    ['D2', ['F3', 'A3', 'C4', 'E4']], ['Bb1', ['D3', 'A3', 'C4', 'F4']], ['G1', ['Bb2', 'F3', 'A3', 'D4']], ['A1', ['G3', 'C#4', 'F4', 'Bb4']],
    ['D2', ['F3', 'A3', 'C4', 'E4']], ['F1', ['A2', 'E3', 'G3', 'C4']], ['Eb2', ['G3', 'Bb3', 'D4', 'A4']], ['A1', ['G3', 'C#4', 'E4', 'A4']],
    ['Bb1', ['D3', 'A3', 'C4', 'F4']], ['G1', ['Bb2', 'F3', 'A3', 'D4']], ['E2', ['G3', 'Bb3', 'D4', 'F4']], ['A1', ['G3', 'C#4', 'F4', 'Bb4']],
    ['D2', ['F3', 'A3', 'C4', 'E4']], ['Bb1', ['D3', 'F3', 'A3', 'D4']], ['G1', ['Bb2', 'F3', 'A3', 'C4']], ['A1', ['G3', 'D4', 'E4', 'A4']],
  ];
  // Sparse melody: [bar, beat offset, note, length in beats]
  const melody: [number, number, string, number][] = [
    [0, 1.5, 'A4', 1], [0, 2.5, 'D5', 1.5], [1, 0.5, 'C5', 1], [1, 2, 'A4', 2],
    [4, 1.5, 'A4', 1], [4, 2.5, 'E5', 1], [5, 0, 'D5', 1], [5, 1, 'C5', 2], [6, 2, 'Bb4', 1.5], [7, 0.5, 'A4', 3],
    [8, 1, 'F5', 1], [8, 2, 'E5', 1], [9, 0, 'D5', 2], [10, 1.5, 'Bb4', 1], [11, 0, 'C#5', 1], [11, 1.5, 'E5', 2],
    [12, 1.5, 'A4', 1], [12, 2.5, 'D5', 1.5], [13, 1, 'F5', 1], [13, 2, 'E5', 1.5], [14, 1, 'C5', 1.5], [15, 0, 'A4', 3],
  ];
  const piano = new Float32Array(buf.length), padBus = new Float32Array(buf.length), low = new Float32Array(buf.length);
  chords.forEach(([root, voicing], b) => {
    const t0 = b * bar;
    add(low, t0, bass(midi(n(root)), 0.5), bar, true);
    add(low, t0 + beat * 2.5, bass(midi(n(root) + 7), 0.28), bar, true);
    voicing.forEach((note, i) => {
      add(piano, t0 + i * 0.045, electricPiano(midi(n(note)), 0.16), 3.6, true);
      add(piano, t0 + beat * 2 + 0.02 + i * 0.03, electricPiano(midi(n(note)), 0.07), 2.6, true);
      add(padBus, t0, pad(midi(n(note) - 12), 0.035, bar + 0.6), bar + 0.6, true);
    });
  });
  melody.forEach(([b, off, note, len]) => add(piano, b * bar + off * beat, electricPiano(midi(n(note)), 0.2), len * beat + 2.4, true));
  lowpass(padBus, 1400, 2);
  lowpass(low, 700);
  // Brushes on 2 and 4, and a constant soft rain bed.
  const brush = new Float32Array(buf.length);
  for (let b = 0; b < bars; b++) for (const k of [1, 3]) {
    add(brush, b * bar + k * beat, noiseVoice(100 + b * 4 + k, t => env(t, 0.02, 0.11) * 0.05, 5200, 1800), 0.5, true);
  }
  // Render half a second past the loop and crossfade that overhang into the start, so the
  // rain continues without a seam. The 15-second swell divides the loop exactly.
  const xf = Math.round(0.5 * RATE);
  const rainVoice = noiseVoice(7, t => 0.026 * (0.8 + 0.2 * Math.sin(TAU * t / 15)), 3200, 600);
  const longRain = Float32Array.from({ length: buf.length + xf }, (_, i) => rainVoice(i / RATE));
  const rain = longRain.slice(0, buf.length);
  for (let i = 0; i < xf; i++) { const w = i / xf; rain[i] = longRain[i] * w + longRain[buf.length + i] * (1 - w); }
  reverb(piano, 0.38, true, 1.15);
  reverb(padBus, 0.3, true);
  for (let i = 0; i < buf.length; i++) buf[i] = piano[i] + padBus[i] + low[i] + brush[i] + rain[i];
  normalize(buf, -5);
  return buf;
}

function effect(seconds: number, build: (buf: Buf) => void, room = 0.18, peak = -3): Buf {
  const buf = new Float32Array(Math.round(seconds * RATE));
  build(buf);
  if (room) reverb(buf, room, false, 0.7);
  fadeEdges(buf, 0.002, 0.04);
  normalize(buf, peak);
  return buf;
}
const sounds: Record<string, () => Buf> = {
  'bellweather-nocturne': nocturne,
  // A soft felt tap for ordinary buttons.
  tap: () => effect(0.16, b => {
    add(b, 0, t => Math.sin(TAU * 190 * t * (1 - t * 2)) * env(t, 0.001, 0.025), 0.16, false);
    add(b, 0, noiseVoice(11, t => env(t, 0.0005, 0.008) * 0.6, 4200, 900), 0.06, false);
  }, 0.08, -9),
  // A lighter tick when an answer is chosen.
  select: () => effect(0.14, b => {
    add(b, 0, t => Math.sin(TAU * 620 * t) * env(t, 0.001, 0.018) * 0.5, 0.14, false);
    add(b, 0, noiseVoice(12, t => env(t, 0.0005, 0.006) * 0.5, 6000, 2000), 0.05, false);
  }, 0.1, -10),
  // Paper lifting from a folder, for opening a private sheet.
  page: () => effect(0.55, b => {
    const r = rng(21);
    add(b, 0, noiseVoice(22, t => Math.sin(Math.PI * Math.min(1, t / 0.42)) * (0.6 + 0.4 * Math.abs(r())) * 0.7, 3600, 700), 0.45, false);
  }, 0.1, -8),
  // A folder closing, for hiding evidence and the handoff.
  handoff: () => effect(0.6, b => {
    add(b, 0, noiseVoice(31, t => Math.sin(Math.PI * Math.min(1, t / 0.22)) * 0.5, 2600, 400), 0.22, false);
    add(b, 0.2, t => Math.sin(TAU * 95 * t) * env(t, 0.002, 0.07), 0.4, false);
    add(b, 0.2, noiseVoice(32, t => env(t, 0.001, 0.02) * 0.4, 1800), 0.1, false);
  }, 0.16, -7),
  // A gentle rising fifth when a deduction is confirmed.
  confirm: () => effect(2.2, b => {
    add(b, 0, bell(midi(n('D5')), 0.5, 0.9), 2.2, false);
    add(b, 0.13, bell(midi(n('A5')), 0.45, 1.0), 2.0, false);
    add(b, 0.13, bell(midi(n('F#5')), 0.18, 0.8), 2.0, false);
  }, 0.3, -6),
  // Two muted knocks: not this one, try again. Deliberately unpunishing.
  wrong: () => effect(0.5, b => {
    for (const at of [0, 0.13]) {
      add(b, at, t => Math.sin(TAU * 150 * t) * env(t, 0.002, 0.05), 0.25, false);
      add(b, at, noiseVoice(41 + at * 100, t => env(t, 0.001, 0.012) * 0.35, 1500), 0.08, false);
    }
  }, 0.12, -9),
  // One soft celesta note when a hint is revealed.
  hint: () => effect(1.4, b => add(b, 0, bell(midi(n('E5')), 0.5, 0.7), 1.4, false), 0.32, -10),
  // Case closed: a stamp, then a resolving D major chord.
  solved: () => effect(3.6, b => {
    add(b, 0, t => Math.sin(TAU * 80 * t) * env(t, 0.002, 0.09), 0.4, false);
    add(b, 0, noiseVoice(51, t => env(t, 0.001, 0.03) * 0.5, 2000), 0.15, false);
    ['D4', 'F#4', 'A4', 'C#5', 'E5'].forEach((note, i) => add(b, 0.35 + i * 0.09, electricPiano(midi(n(note)), 0.22), 3.2, false));
    add(b, 0.8, bell(midi(n('A5')), 0.2, 1.2), 2.6, false);
  }, 0.35, -5),
  // A bright two-note chime as each star of a rating lands.
  star: () => effect(0.9, b => {
    add(b, 0, bell(midi(n('A5')), 0.45, 0.45), 0.9, false);
    add(b, 0.06, bell(midi(n('E6')), 0.28, 0.4), 0.8, false);
  }, 0.25, -11),
  // A hint-free solve: the stamp, then a rising D-major arpeggio of bells with a sparkling top.
  perfect: () => effect(4.6, b => {
    add(b, 0, t => Math.sin(TAU * 80 * t) * env(t, 0.002, 0.09), 0.4, false);
    add(b, 0, noiseVoice(61, t => env(t, 0.001, 0.03) * 0.5, 2000), 0.15, false);
    ['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5'].forEach((note, i) => add(b, 0.3 + i * 0.11, bell(midi(n(note)), 0.38, 1.4), 3.6, false));
    ['D3', 'A3', 'D4', 'F#4', 'A4'].forEach((note, i) => add(b, 0.95 + i * 0.05, electricPiano(midi(n(note)), 0.2), 3.4, false));
    [['D6', 1.5], ['A5', 1.75], ['F#6', 2.0]].forEach(([note, at]) => add(b, at as number, bell(midi(n(note as string)), 0.16, 1.1), 2.4, false));
  }, 0.4, -4),
};

const check = process.argv.includes('--check');
let failed = false;
for (const [name, make] of Object.entries(sounds)) {
  const bytes = wav(make());
  const file = join(OUT, `${name}.wav`);
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  if (check) {
    let existing: Buffer | null = null;
    try { existing = readFileSync(file); } catch { /* reported below */ }
    const same = existing !== null && existing.equals(bytes);
    if (!same) failed = true;
    console.log(`${same ? 'ok     ' : 'DIFFERS'} ${name}.wav ${digest}`);
  } else {
    writeFileSync(file, bytes);
    console.log(`wrote ${name}.wav ${(bytes.length / 1024).toFixed(0)} KB ${digest}`);
  }
}
if (failed) { console.error('Audio assets do not match the generator. Run npm run audio:generate.'); process.exit(1); }
