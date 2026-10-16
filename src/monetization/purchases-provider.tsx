import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { addAnalyticsSink, track } from '../analytics/analytics';
import { Access, isDevPreviewEnabled } from './access';
import { AFTER_MIDNIGHT } from './catalogue';
import { purchaseConfig } from './config';
import { createSnapshotGate, initialPurchaseState, PurchaseState, purchaseReducer } from './purchase-state';
import { createPurchaseService } from './service';

type PurchasesValue = {
  state: PurchaseState; access: Access; storeUnavailable: boolean;
  purchase: () => Promise<void>; restore: () => Promise<void>; retryOffer: () => void; dismiss: () => void;
};
const PurchasesContext = createContext<PurchasesValue | null>(null);
const ENTITLEMENT = AFTER_MIDNIGHT.entitlementId as string;
const OFFERING = AFTER_MIDNIGHT.offeringId as string;
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => createPurchaseService(), []);
  const devPreview = isDevPreviewEnabled(isDev, purchaseConfig.devPreviewFlag);
  const [state, dispatch] = useReducer(purchaseReducer, initialPurchaseState);
  const current = useRef(state);
  useEffect(() => { current.current = state; }, [state]);
  // Synchronous: set before the first await, so a double tap cannot start a second store call.
  const [gate] = useState(createSnapshotGate);

  const loadOffer = useCallback(() => {
    if (service.unavailable) { dispatch({ type: 'offer-unavailable', reason: service.unavailable }); return; }
    dispatch({ type: 'offer-loading' });
    service.loadOffer(OFFERING).then(offer => dispatch(offer ? { type: 'offer-loaded', offer } : { type: 'offer-unavailable', reason: 'no-offering' }))
      .catch(() => dispatch({ type: 'offer-unavailable', reason: 'store-error' }));
  }, [service]);
  const refresh = useCallback(() => {
    if (service.unavailable) return;
    // A failed refresh leaves the last verified state in place; the SDK's own cache covers offline play.
    const ticket = gate.begin();
    service.refresh().then(snapshot => {
      if (gate.accept(ticket)) dispatch({ type: 'entitlements', snapshot, entitlementId: ENTITLEMENT });
    }).catch(() => undefined);
  }, [service, gate]);

  useEffect(() => {
    if (!isDev) return;
    return addAnalyticsSink(event => console.info('[analytics]', event.name, event));
  }, []);
  useEffect(() => {
    let alive = true;
    let stop = () => undefined as void;
    if (service.unavailable) { dispatch({ type: 'offer-unavailable', reason: service.unavailable }); return; }
    service.start(snapshot => { if (!alive) return; gate.advance(); dispatch({ type: 'entitlements', snapshot, entitlementId: ENTITLEMENT }); })
      .then(unsubscribe => {
        if (!alive) { unsubscribe(); return; }
        stop = unsubscribe;
        refresh();
        loadOffer();
      })
      .catch(() => { if (alive) dispatch({ type: 'offer-unavailable', reason: 'store-error' }); });
    // Coming back from the store sheet, Settings or the background re-reads entitlements, which picks up
    // completed pending purchases and reconciles refunds or revocations.
    const sub = AppState.addEventListener('change', next => {
      if (next !== 'active') return;
      refresh();
      if (current.current.offer.status === 'unavailable') loadOffer();
    });
    return () => { alive = false; stop(); sub.remove(); };
  }, [service, refresh, loadOffer, gate]);

  const purchase = useCallback(async () => {
    const s = current.current;
    if (gate.busy || s.offer.status !== 'ready' || s.activity === 'purchasing' || s.activity === 'restoring') return;
    const { packageId } = s.offer.offer;
    gate.hold();
    dispatch({ type: 'purchase-started' });
    track({ name: 'purchase_started', collection_id: AFTER_MIDNIGHT.id });
    const outcome = await service.purchase(OFFERING, packageId).catch(() => ({ kind: 'failed', failure: 'unknown' } as const));
    gate.release();
    dispatch({ type: 'purchase-finished', outcome, entitlementId: ENTITLEMENT });
    if (outcome.kind === 'success' && outcome.snapshot.ids.includes(ENTITLEMENT)) {
      track({ name: 'purchase_verified', collection_id: AFTER_MIDNIGHT.id, sandbox: outcome.snapshot.sandbox });
    } else {
      const reason = outcome.kind === 'failed' ? outcome.failure : outcome.kind === 'success' ? 'unverified' : outcome.kind;
      track({ name: 'purchase_failed', collection_id: AFTER_MIDNIGHT.id, reason });
    }
  }, [service, gate]);
  const restore = useCallback(async () => {
    const s = current.current;
    if (service.unavailable || gate.busy || s.activity === 'purchasing' || s.activity === 'restoring') return;
    gate.hold();
    dispatch({ type: 'restore-started' });
    try {
      const snapshot = await service.restore();
      gate.release();
      dispatch({ type: 'restore-finished', snapshot, entitlementId: ENTITLEMENT });
      if (snapshot.ids.includes(ENTITLEMENT)) track({ name: 'purchase_restored', collection_id: AFTER_MIDNIGHT.id, sandbox: snapshot.sandbox });
    } catch { gate.release(); dispatch({ type: 'restore-failed' }); }
  }, [service, gate]);

  const value = useMemo<PurchasesValue>(() => ({
    state, access: { entitlements: state.entitlements, devPreview }, storeUnavailable: service.unavailable !== null,
    purchase, restore, retryOffer: loadOffer, dismiss: () => dispatch({ type: 'dismiss' }),
  }), [state, devPreview, service, purchase, restore, loadOffer]);
  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases(): PurchasesValue {
  const value = useContext(PurchasesContext);
  if (!value) throw new Error('usePurchases needs PurchasesProvider');
  return value;
}
