import { useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';

export function usePrivacy(conceal: () => void) {
  useEffect(() => {
    const state = AppState.addEventListener('change', next => { if (next !== 'active') conceal(); });
    const back = BackHandler.addEventListener('hardwareBackPress', () => { conceal(); return true; });
    return () => { state.remove(); back.remove(); };
  }, [conceal]);
}
