import { EntitlementSnapshot, PurchaseService, UnavailableReason } from './purchase-state';

// Used where no native store can be reached (web, Expo Go, missing keys). Nothing can be bought or
// verified; paid collections stay locked, and no mock success is ever substituted.
export function unavailableService(reason: UnavailableReason): PurchaseService {
  const none: EntitlementSnapshot = { ids: [], sandbox: false };
  return {
    unavailable: reason,
    start: async () => () => undefined,
    refresh: async () => none,
    loadOffer: async () => null,
    purchase: async () => ({ kind: 'failed', failure: 'store' }),
    restore: async () => none,
  };
}
