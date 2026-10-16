import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { PurchasesProvider, usePurchases } from '../../src/monetization/purchases-provider';
import type { EntitlementSnapshot, PurchaseOutcome, PurchaseService } from '../../src/monetization/purchase-state';

const ENT = 'after_midnight_collection';
const locked: EntitlementSnapshot = { ids: [], sandbox: false };
const owned: EntitlementSnapshot = { ids: [ENT], sandbox: true };
let mockService: PurchaseService;
let pushed: (snapshot: EntitlementSnapshot) => void;
let api: ReturnType<typeof usePurchases>;
const unsubscribe = jest.fn();
jest.mock('../../src/monetization/service', () => ({ createPurchaseService: () => mockService }));
jest.mock('../../src/monetization/config', () => ({ purchaseConfig: { devPreviewFlag: undefined } }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
function Probe() {
  api = usePurchases();
  return <View>
    <Text>{`Offer: ${api.state.offer.status}`}</Text>
    <Text>{`Access: ${api.access.entitlements.includes(ENT) ? 'owned' : 'locked'}`}</Text>
    <Text>{`Activity: ${api.state.activity}`}</Text>
  </View>;
}
async function openProvider() {
  const view = await render(<PurchasesProvider><Probe /></PurchasesProvider>);
  await waitFor(() => expect(screen.getByText('Offer: ready')).toBeTruthy());
  return view;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockService = {
    unavailable: null,
    start: jest.fn<PurchaseService['start']>().mockImplementation(async listener => { pushed = listener; return unsubscribe; }),
    loadOffer: jest.fn<PurchaseService['loadOffer']>().mockResolvedValue({ packageId: '$rc_lifetime', priceString: '$4.99' }),
    refresh: jest.fn<PurchaseService['refresh']>().mockResolvedValue(locked),
    purchase: jest.fn<PurchaseService['purchase']>().mockResolvedValue({ kind: 'success', snapshot: owned }),
    restore: jest.fn<PurchaseService['restore']>().mockResolvedValue(owned),
  };
});

describe('mounted purchase provider with a mocked native SDK boundary', () => {
  it('takes one store call for rapid purchase/restore taps and drops a pre-purchase poll', async () => {
    const poll = deferred<EntitlementSnapshot>();
    const sale = deferred<PurchaseOutcome>();
    mockService.refresh = jest.fn<PurchaseService['refresh']>().mockReturnValue(poll.promise);
    mockService.purchase = jest.fn<PurchaseService['purchase']>().mockReturnValue(sale.promise);
    await openProvider();
    let first!: Promise<void>;
    await act(async () => {
      first = api.purchase();
      void api.purchase();
      void api.restore();
    });
    expect(mockService.purchase).toHaveBeenCalledTimes(1);
    expect(mockService.restore).not.toHaveBeenCalled();
    expect(screen.getByText('Activity: purchasing')).toBeTruthy();
    await act(async () => { sale.resolve({ kind: 'success', snapshot: owned }); await first; });
    expect(screen.getByText('Access: owned')).toBeTruthy();
    await act(async () => { poll.resolve(locked); });
    expect(screen.getByText('Access: owned')).toBeTruthy();
  });

  it('updates access on listener revocation and re-grant instead of retaining local ownership', async () => {
    mockService.refresh = jest.fn<PurchaseService['refresh']>().mockResolvedValue(owned);
    await openProvider();
    expect(screen.getByText('Access: owned')).toBeTruthy();
    await act(async () => { pushed(locked); });
    expect(screen.getByText('Access: locked')).toBeTruthy();
    await act(async () => { pushed(owned); });
    expect(screen.getByText('Access: owned')).toBeTruthy();
  });

  it('keeps pending purchases locked and unlocks only after the SDK pushes confirmation', async () => {
    mockService.purchase = jest.fn<PurchaseService['purchase']>().mockResolvedValue({ kind: 'pending' });
    await openProvider();
    await act(async () => { await api.purchase(); });
    expect(screen.getByText('Activity: pending')).toBeTruthy();
    expect(screen.getByText('Access: locked')).toBeTruthy();
    await act(async () => { pushed(owned); });
    expect(screen.getByText('Activity: purchased')).toBeTruthy();
    expect(screen.getByText('Access: owned')).toBeTruthy();
  });

  it('restores through the SDK once and removes its listener when unmounted', async () => {
    const restore = deferred<EntitlementSnapshot>();
    mockService.restore = jest.fn<PurchaseService['restore']>().mockReturnValue(restore.promise);
    const view = await openProvider();
    let first!: Promise<void>;
    await act(async () => { first = api.restore(); void api.restore(); });
    expect(mockService.restore).toHaveBeenCalledTimes(1);
    await act(async () => { restore.resolve(owned); await first; });
    expect(screen.getByText('Activity: restored')).toBeTruthy();
    expect(screen.getByText('Access: owned')).toBeTruthy();
    await view.unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
