import { useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';

export function usePrivacy(conceal: () => void, handleBack = true) {
  useEffect(() => {
    const state = AppState.addEventListener('change', next => { if (next !== 'active') conceal(); });
    const back = handleBack ? BackHandler.addEventListener('hardwareBackPress', () => { conceal(); return true; }) : null;
    return () => { state.remove(); back?.remove(); };
  }, [conceal, handleBack]);
}
