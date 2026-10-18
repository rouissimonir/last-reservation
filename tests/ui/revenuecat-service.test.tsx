import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

import { createPurchaseService } from '@/monetization/service.native';

jest.mock('expo-constants', () => ({ __esModule: true,
  default: { executionEnvironment: 'bare' }, ExecutionEnvironment: { StoreClient: 'storeClient' } }));
jest.mock('@/monetization/config', () => ({ purchaseConfig: {
  iosApiKey: 'appl_fixture_not_a_real_key', androidApiKey: 'goog_fixture_not_a_real_key' } }));
jest.mock('react-native-purchases', () => ({ __esModule: true, default: {
  ENTITLEMENT_VERIFICATION_MODE: { INFORMATIONAL: 'INFORMATIONAL' },
  configure: jest.fn(), addCustomerInfoUpdateListener: jest.fn(), removeCustomerInfoUpdateListener: jest.fn(),
  getOfferings: jest.fn(), getCustomerInfo: jest.fn(), purchasePackage: jest.fn(), restorePurchases: jest.fn(),
} }));

const ENT = 'after_midnight_collection';
const customer = { entitlements: { verification: 'VERIFIED', active: {
  [ENT]: { identifier: ENT, isActive: true, verification: 'VERIFIED', isSandbox: true },
} } };
const config = jest.requireMock<{ purchaseConfig: { iosApiKey?: string; androidApiKey?: string } }>('@/monetization/config').purchaseConfig;
function lifetime(product: object = {}): PurchasesPackage {
  return { identifier: '$rc_lifetime', packageType: 'LIFETIME', product: {
    identifier: 'fixture.after_midnight', priceString: '5,99 €', productCategory: 'NON_SUBSCRIPTION',
    productType: 'NON_CONSUMABLE', subscriptionPeriod: null, ...product,
  } } as unknown as PurchasesPackage;
}
function catalogue(item = lifetime(), extra: PurchasesPackage[] = []) {
  const offering = { identifier: 'after_midnight', lifetime: item, availablePackages: [item, ...extra] } as PurchasesOffering;
  jest.mocked(Purchases.getOfferings).mockResolvedValue({ all: { after_midnight: offering }, current: offering } as PurchasesOfferings);
  return item;
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.replaceProperty(Platform, 'OS', 'ios');
  config.iosApiKey = 'appl_fixture_not_a_real_key';
  config.androidApiKey = 'goog_fixture_not_a_real_key';
  catalogue();
});
afterEach(() => { jest.restoreAllMocks(); });

describe('actual RevenueCat native adapter with the native bridge mocked', () => {
  it('configures once, subscribes/unsubscribes and preserves the store-localized price', async () => {
    const a = createPurchaseService();
    const stop = await a.start(jest.fn());
    const stopB = await createPurchaseService().start(jest.fn());
    expect(Purchases.configure).toHaveBeenCalledTimes(1);
    expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: config.iosApiKey, entitlementVerificationMode: 'INFORMATIONAL' });
    expect(await a.loadOffer('after_midnight')).toEqual({ packageId: '$rc_lifetime', priceString: '5,99 €' });
    stop(); stopB();
    expect(Purchases.removeCustomerInfoUpdateListener).toHaveBeenCalledTimes(2);
  });

  it('rejects subscriptions, consumables, unknown Apple types and multi-product offerings', async () => {
    const service = createPurchaseService();
    for (const product of [
      { productCategory: 'SUBSCRIPTION', productType: 'AUTO_RENEWABLE_SUBSCRIPTION', subscriptionPeriod: 'P1M' },
      { productType: 'CONSUMABLE' }, { productType: 'UNKNOWN' }, { subscriptionPeriod: 'P1Y' }, { priceString: '' },
    ]) {
      catalogue(lifetime(product));
      expect(await service.loadOffer('after_midnight')).toBeNull();
      expect(await service.purchase('after_midnight', '$rc_lifetime')).toEqual({ kind: 'failed', failure: 'store' });
    }
    catalogue(lifetime(), [lifetime()]);
    expect(await service.loadOffer('after_midnight')).toBeNull();
    const monthly = { ...lifetime(), identifier: '$rc_monthly', packageType: 'MONTHLY' } as PurchasesPackage;
    const wrong = { identifier: 'after_midnight', lifetime: null, availablePackages: [monthly] } as PurchasesOffering;
    jest.mocked(Purchases.getOfferings).mockResolvedValue({ all: { after_midnight: wrong }, current: wrong } as PurchasesOfferings);
    expect(await service.loadOffer('after_midnight')).toBeNull();
    expect(Purchases.purchasePackage).not.toHaveBeenCalled();
  });

  it('never falls back to current, scopes purchases to the fetched offering and drops stale quotes', async () => {
    const item = catalogue();
    const service = createPurchaseService();
    await service.loadOffer('after_midnight');
    expect(await service.purchase('another_collection', '$rc_lifetime')).toEqual({ kind: 'failed', failure: 'store' });
    const current = { identifier: 'other', lifetime: item, availablePackages: [item] } as PurchasesOffering;
    jest.mocked(Purchases.getOfferings).mockResolvedValue({ all: {}, current } as PurchasesOfferings);
    expect(await service.loadOffer('after_midnight')).toBeNull();
    expect(await service.purchase('after_midnight', '$rc_lifetime')).toEqual({ kind: 'failed', failure: 'store' });
    expect(Purchases.purchasePackage).not.toHaveBeenCalled();
  });

  it('passes the fetched package to purchase, handles cancellation/pending, and restores verified access', async () => {
    const item = catalogue();
    const service = createPurchaseService();
    await service.loadOffer('after_midnight');
    jest.mocked(Purchases.purchasePackage).mockResolvedValue({ customerInfo: customer } as never);
    expect(await service.purchase('after_midnight', '$rc_lifetime')).toEqual({ kind: 'success', snapshot: { ids: [ENT], sandbox: true } });
    expect(Purchases.purchasePackage).toHaveBeenCalledWith(item);
    jest.mocked(Purchases.purchasePackage).mockRejectedValue({ userCancelled: true, code: '1' });
    expect(await service.purchase('after_midnight', '$rc_lifetime')).toEqual({ kind: 'cancelled' });
    jest.mocked(Purchases.purchasePackage).mockRejectedValue({ code: '20' });
    expect(await service.purchase('after_midnight', '$rc_lifetime')).toEqual({ kind: 'pending' });
    jest.mocked(Purchases.restorePurchases).mockResolvedValue(customer as never);
    expect(await service.restore()).toEqual({ ids: [ENT], sandbox: true });
  });

  it('never starts store calls in Expo Go or without configuration', async () => {
    jest.replaceProperty(Constants, 'executionEnvironment', ExecutionEnvironment.StoreClient);
    expect(createPurchaseService().unavailable).toBe('expo-go');
    jest.restoreAllMocks();
    jest.replaceProperty(Platform, 'OS', 'ios');
    config.iosApiKey = undefined;
    expect(createPurchaseService().unavailable).toBe('not-configured');
    expect(Purchases.configure).not.toHaveBeenCalled();
    expect(Purchases.getOfferings).not.toHaveBeenCalled();
  });

  it('accepts Google non-subscriptions with an unknown subtype, while rejecting explicit consumables', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const service = createPurchaseService();
    catalogue(lifetime({ productType: 'UNKNOWN' }));
    expect(await service.loadOffer('after_midnight')).not.toBeNull();
    catalogue(lifetime({ productType: 'CONSUMABLE' }));
    expect(await service.loadOffer('after_midnight')).toBeNull();
  });
});
