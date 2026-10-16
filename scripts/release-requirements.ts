export type IosReleaseConfig = {
  name?: string; version?: string; icon?: string;
  ios?: { bundleIdentifier?: string; buildNumber?: string; icon?: unknown };
};
type ProductionProfile = { distribution?: string; developmentClient?: boolean; environment?: string; autoIncrement?: boolean; env?: Record<string, string> };

export function isPublicHttps(value: string | undefined): boolean {
  try {
    const u = new URL(value ?? '');
    const host = u.hostname.toLowerCase();
    return u.protocol === 'https:' && !u.username && !u.password && host.includes('.') &&
      !/^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) &&
      !/(^|\.)(example\.(com|org|net)|invalid|test|localhost)$/.test(host) &&
      !host.endsWith('.local') && !host.endsWith('.example');
  } catch { return false; }
}

// Configuration evidence only. A passing result is not proof of store setup, URL contents,
// native purchases, human playtests or App Review acceptance.
export function iosReleaseIssues(config: IosReleaseConfig, env: Record<string, string | undefined>, profile: ProductionProfile | undefined): string[] {
  const issues: string[] = [];
  const id = config.ios?.bundleIdentifier ?? '';
  if (!/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(id) || /^(com\.example|com\.yourname)(\.|$)/i.test(id))
    issues.push('Set the permanent publisher-owned ios.bundleIdentifier in app.json.');
  if (!/^\d+\.\d+\.\d+$/.test(config.version ?? '')) issues.push('Set a numeric major.minor.patch app version.');
  if (!/^\d+(?:\.\d+){0,2}$/.test(config.ios?.buildNumber ?? '')) issues.push('Set the initial ios.buildNumber; EAS production increments subsequent builds.');
  if (!env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY?.startsWith('appl_') || env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY.length < 15)
    issues.push('Configure EXPO_PUBLIC_REVENUECAT_IOS_API_KEY with the Apple public SDK key (not a secret or test-store key).');
  for (const key of ['EXPO_PUBLIC_SUPPORT_URL', 'EXPO_PUBLIC_PRIVACY_URL']) {
    if (!isPublicHttps(env[key])) issues.push(`Configure ${key} with the real public HTTPS page; placeholder/local URLs are rejected.`);
  }
  if (env.EXPO_PUBLIC_DEV_PREVIEW_PREMIUM === '1') issues.push('Unset the premium development preview for release checks.');
  if (!profile || profile.distribution !== 'store' || profile.developmentClient === true || profile.environment !== 'production' ||
    profile.env?.EXPO_PUBLIC_DEV_PREVIEW_PREMIUM !== '0' || profile.autoIncrement !== true)
    issues.push('Use the production EAS store profile, production environment, automatic build increment and preview flag 0.');
  return issues;
}
