import { loadProgress, saveProgress } from './playerProgress';

type SoundId = 'click' | 'complete' | 'sticker' | 'achievement' | 'daily';

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
): void {
  const ctx = getContext();
  if (!ctx || !isSoundEnabled()) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function isSoundEnabled(): boolean {
  return loadProgress().soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  const p = loadProgress();
  p.soundEnabled = enabled;
  saveProgress(p);
}

export function playSound(id: SoundId): void {
  if (!isSoundEnabled()) return;

  switch (id) {
    case 'click':
      tone(520, 0.08, 'triangle', 0.1);
      break;
    case 'complete':
      tone(523, 0.12, 'sine', 0.12);
      setTimeout(() => tone(659, 0.12, 'sine', 0.12), 100);
      setTimeout(() => tone(784, 0.2, 'sine', 0.14), 200);
      break;
    case 'sticker':
      tone(880, 0.1, 'triangle', 0.12);
      setTimeout(() => tone(1047, 0.15, 'triangle', 0.12), 80);
      break;
    case 'achievement':
      tone(440, 0.1, 'square', 0.08);
      setTimeout(() => tone(554, 0.1, 'square', 0.08), 90);
      setTimeout(() => tone(659, 0.15, 'square', 0.1), 180);
      break;
    case 'daily':
      tone(392, 0.12, 'sine', 0.12);
      setTimeout(() => tone(494, 0.12, 'sine', 0.12), 100);
      setTimeout(() => tone(587, 0.12, 'sine', 0.12), 200);
      setTimeout(() => tone(698, 0.2, 'sine', 0.14), 300);
      break;
  }
}

export function playClickSound(): void {
  playSound('click');
}
