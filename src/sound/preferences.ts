// App-wide sound and feel preferences. Stored under their own key, never inside a case save,
// so case progress formats and keys are untouched.
export const PREFERENCES_KEY = 'two-sides/preferences/v1';
export const VOLUME_LEVELS = 5;

export type SoundPreferences = {
  music: boolean; musicLevel: number;
  effects: boolean; effectsLevel: number;
  haptics: boolean;
};
// On by default, quietly: music sits well under speech so players can still talk over it.
export const DEFAULT_PREFERENCES: SoundPreferences = { music: true, musicLevel: 2, effects: true, effectsLevel: 3, haptics: true };

export type PreferencesLoad = { kind: 'loaded' | 'empty'; preferences: SoundPreferences } | { kind: 'invalid' | 'unavailable' };
type Store = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<unknown> };

const level = (v: unknown) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= VOLUME_LEVELS;
export function decodePreferences(raw: string | null): PreferencesLoad {
  if (raw === null) return { kind: 'empty', preferences: { ...DEFAULT_PREFERENCES } };
  try {
    const p = JSON.parse(raw);
    if (!p || typeof p.music !== 'boolean' || typeof p.effects !== 'boolean' || typeof p.haptics !== 'boolean' ||
      !level(p.musicLevel) || !level(p.effectsLevel)) return { kind: 'invalid' };
    return { kind: 'loaded', preferences: { music: p.music, musicLevel: p.musicLevel, effects: p.effects, effectsLevel: p.effectsLevel, haptics: p.haptics } };
  } catch { return { kind: 'invalid' }; }
}

export async function loadPreferences(store: Store): Promise<PreferencesLoad> {
  try { return decodePreferences(await store.getItem(PREFERENCES_KEY)); }
  catch { return { kind: 'unavailable' }; }
}

// Writes run in order so a slow earlier write never replaces a later choice.
export function createPreferencesQueue(store: Store) {
  let tail: Promise<unknown> = Promise.resolve();
  return (p: SoundPreferences): Promise<void> => {
    const snapshot = JSON.stringify(p);
    if (decodePreferences(snapshot).kind !== 'loaded') return Promise.reject(new Error('Refusing invalid preferences'));
    const write = tail.catch(() => undefined).then(() => store.setItem(PREFERENCES_KEY, snapshot)).then(() => undefined);
    tail = write;
    return write;
  };
}

// Music peaks quieter than effects; level 0 is silent but keeps the switch's meaning separate.
export const musicVolume = (p: SoundPreferences) => p.music ? 0.7 * p.musicLevel / VOLUME_LEVELS : 0;
export const effectsVolume = (p: SoundPreferences) => p.effects ? p.effectsLevel / VOLUME_LEVELS : 0;
