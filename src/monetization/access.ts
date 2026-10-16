import { Collection, collectionOf } from './catalogue';

// Access is derived, never stored: verified store entitlements plus an optional development preview.
export type Access = { entitlements: readonly string[]; devPreview: boolean };
export const NO_ACCESS: Access = { entitlements: [], devPreview: false };

export function ownsCollection(access: Access, collection: Collection): boolean {
  if (collection.kind === 'free') return true;
  if (access.devPreview) return true;
  return collection.entitlementId !== null && access.entitlements.includes(collection.entitlementId);
}
export const canPlayCase = (access: Access, caseId: string) => ownsCollection(access, collectionOf(caseId));

// The preview needs a development bundle AND an explicit flag. Release bundles are built with
// __DEV__ false, so the flag has no effect there even if it is set by mistake.
export function isDevPreviewEnabled(isDev: unknown, flag: string | undefined): boolean {
  return isDev === true && flag === '1';
}

export type EntitlementLike = { identifier: string; isActive: boolean; isSandbox: boolean; verification?: string };
export type CustomerInfoLike = { entitlements: { active: Record<string, EntitlementLike>; verification?: string } };
const TRUSTED = new Set(['VERIFIED', 'VERIFIED_ON_DEVICE']);

// Only active entitlements whose signature RevenueCat verified are honoured. NOT_REQUESTED and FAILED
// grant nothing, so a tampered or unverified response cannot unlock a paid collection.
export function verifiedEntitlements(info: CustomerInfoLike): { ids: string[]; sandbox: boolean } {
  const ids: string[] = [];
  let sandbox = false;
  for (const [key, item] of Object.entries(info.entitlements.active ?? {})) {
    const verification = item.verification ?? info.entitlements.verification;
    if (!item.isActive || !verification || !TRUSTED.has(verification) || item.identifier !== key) continue;
    ids.push(item.identifier);
    sandbox = sandbox || item.isSandbox;
  }
  return { ids: ids.sort(), sandbox };
}
