import { useEffect } from 'react';

// The second argument matches the native signature; the web has no hardware back button.
export function usePrivacy(conceal: () => void, _handleBack = true) {
  useEffect(() => {
    const hidden = () => { if (document.hidden) conceal(); };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', conceal);
    window.addEventListener('blur', conceal);
    return () => {
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pagehide', conceal);
      window.removeEventListener('blur', conceal);
    };
  }, [conceal]);
}
