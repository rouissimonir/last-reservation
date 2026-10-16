// Store-facing types and a pure reducer for the collection offer. No SDK types leak in here,
// so the state machine is tested without a native build.
export type UnavailableReason = 'web' | 'expo-go' | 'not-configured' | 'no-offering' | 'store-error';
export type Offer = { packageId: string; priceString: string };
export type Failure = 'network' | 'store' | 'not-allowed' | 'already-owned' | 'unknown';
export type EntitlementSnapshot = { ids: string[]; sandbox: boolean };
export type PurchaseOutcome =
  | { kind: 'success'; snapshot: EntitlementSnapshot }
  | { kind: 'cancelled' } | { kind: 'pending' }
  | { kind: 'failed'; failure: Failure };

export interface PurchaseService {
  // Null when a real store connection can be attempted. Otherwise nothing can be bought here.
  readonly unavailable: UnavailableReason | null;
  start(onChange: (snapshot: EntitlementSnapshot) => void): Promise<() => void>;
  refresh(): Promise<EntitlementSnapshot>;
  loadOffer(offeringId: string): Promise<Offer | null>;
  purchase(offeringId: string, packageId: string): Promise<PurchaseOutcome>;
  restore(): Promise<EntitlementSnapshot>;
}

export type OfferState = { status: 'loading' } | { status: 'ready'; offer: Offer } | { status: 'unavailable'; reason: UnavailableReason };
export type Activity = 'idle' | 'purchasing' | 'restoring' | 'pending' | 'cancelled' | 'failed' | 'unverified'
  | 'purchased' | 'restored' | 'nothing-restored' | 'restore-failed';
export type PurchaseState = {
  offer: OfferState; activity: Activity; failure: Failure | null;
  // Verified entitlement ids from the store SDK (including its own offline cache). Never from AsyncStorage.
  entitlements: string[]; entitlementsKnown: boolean; sandbox: boolean;
};
export type PurchaseAction =
  | { type: 'offer-loading' } | { type: 'offer-loaded'; offer: Offer } | { type: 'offer-unavailable'; reason: UnavailableReason }
  | { type: 'entitlements'; snapshot: EntitlementSnapshot; entitlementId: string }
  | { type: 'purchase-started' } | { type: 'purchase-finished'; outcome: PurchaseOutcome; entitlementId: string }
  | { type: 'restore-started' } | { type: 'restore-finished'; snapshot: EntitlementSnapshot; entitlementId: string }
  | { type: 'restore-failed' } | { type: 'dismiss' };

export const initialPurchaseState: PurchaseState = {
  offer: { status: 'loading' }, activity: 'idle', failure: null, entitlements: [], entitlementsKnown: false, sandbox: false,
};
const busy = (s: PurchaseState) => s.activity === 'purchasing' || s.activity === 'restoring';

export function purchaseReducer(s: PurchaseState, a: PurchaseAction): PurchaseState {
  switch (a.type) {
    case 'offer-loading': return s.offer.status === 'ready' ? s : { ...s, offer: { status: 'loading' } };
    case 'offer-loaded': return { ...s, offer: { status: 'ready', offer: a.offer } };
    case 'offer-unavailable': return { ...s, offer: { status: 'unavailable', reason: a.reason } };
    case 'entitlements': {
      // Listener and resume refreshes are authoritative: a refund or revocation removes access here.
      const owned = a.snapshot.ids.includes(a.entitlementId);
      const activity = owned && (s.activity === 'pending' || s.activity === 'unverified') ? 'purchased' : s.activity;
      return { ...s, entitlements: [...a.snapshot.ids], entitlementsKnown: true, sandbox: a.snapshot.sandbox, activity };
    }
    case 'purchase-started':
      if (busy(s) || s.offer.status !== 'ready') return s;
      return { ...s, activity: 'purchasing', failure: null };
    case 'purchase-finished': {
      if (s.activity !== 'purchasing') return s;
      const o = a.outcome;
      if (o.kind === 'cancelled') return { ...s, activity: 'cancelled' };
      if (o.kind === 'pending') return { ...s, activity: 'pending' };
      if (o.kind === 'failed') return { ...s, activity: 'failed', failure: o.failure };
      const owned = o.snapshot.ids.includes(a.entitlementId);
      return { ...s, entitlements: [...o.snapshot.ids], entitlementsKnown: true, sandbox: o.snapshot.sandbox,
        activity: owned ? 'purchased' : 'unverified' };
    }
    case 'restore-started':
      if (busy(s)) return s;
      return { ...s, activity: 'restoring', failure: null };
    case 'restore-finished': {
      if (s.activity !== 'restoring') return s;
      const owned = a.snapshot.ids.includes(a.entitlementId);
      return { ...s, entitlements: [...a.snapshot.ids], entitlementsKnown: true, sandbox: a.snapshot.sandbox,
        activity: owned ? 'restored' : 'nothing-restored' };
    }
    case 'restore-failed': return s.activity === 'restoring' ? { ...s, activity: 'restore-failed' } : s;
    case 'dismiss': return busy(s) ? s : { ...s, activity: 'idle', failure: null };
  }
}

// Maps a RevenueCat error (by its stable string code) to an outcome. Codes are from
// PURCHASES_ERROR_CODE in @revenuecat/purchases-typescript-internal.
export function outcomeFromStoreError(error: unknown): PurchaseOutcome {
  const e = (error ?? {}) as { code?: unknown; userCancelled?: unknown };
  const code = typeof e.code === 'string' ? e.code : String(e.code ?? '');
  if (code === '1' || e.userCancelled === true) return { kind: 'cancelled' };
  if (code === '20') return { kind: 'pending' };
  if (code === '10' || code === '35' || code === '32') return { kind: 'failed', failure: 'network' };
  if (code === '3' || code === '19') return { kind: 'failed', failure: 'not-allowed' };
  if (code === '6') return { kind: 'failed', failure: 'already-owned' };
  if (code === '2' || code === '4' || code === '5' || code === '8' || code === '23') return { kind: 'failed', failure: 'store' };
  return { kind: 'failed', failure: 'unknown' };
}
