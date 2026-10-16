// Public build-time configuration. EXPO_PUBLIC_* values are inlined into the bundle, so only
// public identifiers belong here (RevenueCat public SDK keys, public URLs). Never secrets.
// Each must be read with a static `process.env.NAME` expression for Expo to inline it.
export const purchaseConfig = {
  iosApiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
  androidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
  supportUrl: process.env.EXPO_PUBLIC_SUPPORT_URL,
  privacyUrl: process.env.EXPO_PUBLIC_PRIVACY_URL,
  devPreviewFlag: process.env.EXPO_PUBLIC_DEV_PREVIEW_PREMIUM,
};

// Accept only https links, so a malformed value never becomes a tappable link.
export function safeLink(url: string | undefined): string | null {
  if (!url) return null;
  try { return new URL(url).protocol === 'https:' ? url : null; } catch { return null; }
}
