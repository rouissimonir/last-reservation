import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { effectsVolume, musicVolume, SoundPreferences } from './preferences';

export type Cue = 'tap' | 'select' | 'page' | 'handoff' | 'confirm' | 'wrong' | 'hint' | 'solved';
const EFFECTS: Record<Cue, number> = {
  tap: require('../../assets/audio/tap.wav'),
  select: require('../../assets/audio/select.wav'),
  page: require('../../assets/audio/page.wav'),
  handoff: require('../../assets/audio/handoff.wav'),
  confirm: require('../../assets/audio/confirm.wav'),
  wrong: require('../../assets/audio/wrong.wav'),
  hint: require('../../assets/audio/hint.wav'),
  solved: require('../../assets/audio/solved.wav'),
};
// Effects sit slightly apart so the louder moments (a confirmed deduction) stay gentle.
const CUE_GAIN: Record<Cue, number> = { tap: 0.55, select: 0.6, page: 0.7, handoff: 0.7, confirm: 0.8, wrong: 0.65, hint: 0.7, solved: 0.85 };
const HAPTIC: Record<Cue, () => Promise<void>> = {
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
  select: () => Haptics.selectionAsync(),
  page: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  handoff: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  confirm: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  wrong: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  hint: () => Haptics.selectionAsync(),
  solved: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};

// Owns the native players outside React. Sound is decorative: every failure is swallowed.
export class SoundEngine {
  private music: AudioPlayer;
  private effects = new Map<Cue, AudioPlayer>();
  private fade: ReturnType<typeof setInterval> | null = null;
  private preferences: SoundPreferences;
  private loaded = false;
  private active: boolean;
  // Browsers refuse audio before the first tap, so web music waits for a gesture.
  private gestured = Platform.OS !== 'web';

  constructor(initial: SoundPreferences, active: boolean) {
    this.preferences = initial;
    this.active = active;
    // Ambient session: follows the silent switch and mixes with the players' own audio.
    void setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false }).catch(() => {});
    this.music = createAudioPlayer(require('../../assets/audio/bellweather-nocturne.wav'));
    this.music.loop = true;
    this.music.volume = 0;
    // Load the short effects up front so the first tap answers instantly.
    (Object.keys(EFFECTS) as Cue[]).forEach(name => this.effects.set(name, createAudioPlayer(EFFECTS[name])));
  }

  setPreferences(p: SoundPreferences, loaded: boolean) {
    this.preferences = p;
    this.loaded = loaded;
    this.applyMusic();
  }
  setActive(active: boolean) {
    this.active = active;
    this.applyMusic();
  }

  cue(name: Cue) {
    if (!this.gestured) { this.gestured = true; this.applyMusic(); }
    if (this.preferences.haptics && Platform.OS !== 'web') void HAPTIC[name]().catch(() => {});
    const volume = effectsVolume(this.preferences) * CUE_GAIN[name];
    const player = this.effects.get(name);
    if (volume <= 0 || !player) return;
    try {
      player.volume = volume;
      void player.seekTo(0).catch(() => {});
      player.play();
    } catch { /* ignore */ }
  }

  // Ease the soundtrack in and out instead of cutting it.
  private applyMusic() {
    const player = this.music;
    const target = this.loaded && this.active && this.gestured ? musicVolume(this.preferences) : 0;
    if (this.fade) clearInterval(this.fade);
    try {
      if (target > 0 && !player.playing) { player.volume = 0; player.play(); }
    } catch { return; }
    const start = player.volume, steps = 20;
    let step = 0;
    this.fade = setInterval(() => {
      step++;
      player.volume = start + (target - start) * step / steps;
      if (step >= steps) {
        if (this.fade) clearInterval(this.fade);
        this.fade = null;
        if (target === 0 && player.playing) player.pause();
      }
    }, 60);
  }

  release() {
    if (this.fade) clearInterval(this.fade);
    this.music.remove();
    this.effects.forEach(p => p.remove());
    this.effects.clear();
  }
}
