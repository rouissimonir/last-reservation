const ROUTES = new Set(['/', '/help', '/after-midnight']);
const SOURCES = new Set(['library', 'locked_case']);
const SCHEME = 'lastreservation:';

// External native URLs reach Router's query parser. Rebuild a small canonical path instead of
// passing untrusted encoded input to it. No case state, entitlement or arbitrary query is accepted.
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  if (typeof path !== 'string' || path.length > 4096 || /[\u0000-\u0020\u007f]/.test(path) || path.startsWith('//')) return '/';
  try {
    // Reject malformed UTF-8/percent escapes with the built-in decoder, never the dependency's
    // permissive recursive fallback. Do not forward this decoded string to another decoder.
    decodeURIComponent(path);
    const relative = !/^[A-Za-z][A-Za-z\d+.-]*:/.test(path);
    const url = new URL(path, 'https://native-route.invalid/');
    if (url.username || url.password || url.port && url.protocol === SCHEME) return '/';
    let pathname = url.pathname;
    if (!relative) {
      if (url.protocol === SCHEME) {
        if (url.hostname) {
          if (!['help', 'after-midnight'].includes(url.hostname) || pathname !== '' && pathname !== '/') return '/';
          pathname = `/${url.hostname}`;
        }
      } else if (url.protocol === 'exp:' || url.protocol === 'exps:') {
        // Expo's transport host is not an app route; only the path after /--/ is relevant.
        if (pathname.startsWith('/--/')) pathname = pathname.slice(3);
      } else return '/';
    }
    pathname = decodeURIComponent(pathname);
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    if (!ROUTES.has(pathname)) return '/';
    const source = url.searchParams.get('source');
    return pathname === '/after-midnight' && source && SOURCES.has(source) ? `${pathname}?source=${source}` : pathname;
  } catch { return '/'; }
}
