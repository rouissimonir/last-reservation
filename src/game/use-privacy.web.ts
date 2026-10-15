import { useEffect } from 'react';

export function usePrivacy(conceal: () => void) {
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
