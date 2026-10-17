import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { createPreferencesQueue, DEFAULT_PREFERENCES, loadPreferences, SoundPreferences } from './preferences';
import { Cue, SoundEngine } from './sound-engine';

export type { Cue } from './sound-engine';

type SoundContextValue = {
  preferences: SoundPreferences;
  status: 'loading' | 'ready' | 'invalid' | 'unavailable';
  saveError: boolean;
  update: (change: Partial<SoundPreferences>) => void;
  cue: (cue: Cue) => void;
};
// Without a provider (isolated component tests) every cue is silent.
const SoundContext = createContext<SoundContextValue>({
  preferences: DEFAULT_PREFERENCES, status: 'ready', saveError: false, update: () => {}, cue: () => {},
});
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [status, setStatus] = useState<SoundContextValue['status']>('loading');
  const [saveError, setSaveError] = useState(false);
  const current = useRef(preferences);
  const write = useRef(createPreferencesQueue(AsyncStorage));
  const engine = useRef<SoundEngine | null>(null);

  useEffect(() => {
    const sound = new SoundEngine(DEFAULT_PREFERENCES, AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
    engine.current = sound;
    let cancelled = false;
    void loadPreferences(AsyncStorage).then(result => {
      if (cancelled) return;
      if (result.kind === 'loaded' || result.kind === 'empty') {
        current.current = result.preferences;
        setPreferences(result.preferences);
        setStatus('ready');
      } else {
        // An unreadable choice is never guessed at: stay quiet until the player chooses again.
        current.current = { ...DEFAULT_PREFERENCES, music: false };
        setPreferences(current.current);
        setStatus(result.kind);
      }
      sound.setPreferences(current.current, true);
    });
    const appState = AppState.addEventListener('change', next => sound.setActive(next === 'active'));
    return () => {
      cancelled = true;
      appState.remove();
      sound.release();
      engine.current = null;
    };
  }, []);

  const update = useCallback((change: Partial<SoundPreferences>) => {
    const next = { ...current.current, ...change };
    current.current = next;
    setPreferences(next);
    // An explicit choice is permission to replace an unreadable preferences record.
    setStatus('ready');
    engine.current?.setPreferences(next, true);
    void write.current(next).then(() => setSaveError(false)).catch(() => setSaveError(true));
  }, []);
  const cue = useCallback((name: Cue) => engine.current?.cue(name), []);

  const value = useMemo(() => ({ preferences, status, saveError, update, cue }), [preferences, status, saveError, update, cue]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
