import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import { verifiedEntitlements } from './access';
import { purchaseConfig } from './config';
import { EntitlementSnapshot, outcomeFromStoreError, PurchaseService } from './purchase-state';
import { unavailableService } from './unavailable';

const snapshot = (info: CustomerInfo): EntitlementSnapshot => verifiedEntitlements(info);
let configured = false;

// RevenueCat on iOS and Android. Requires a development or release build: in Expo Go the SDK only
// offers its JavaScript preview mocks, which must never unlock anything, so Expo Go is unavailable.
export function createPurchaseService(): PurchaseService {
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return unavailableService('expo-go');
  const apiKey = Platform.OS === 'ios' ? purchaseConfig.iosApiKey : Platform.OS === 'android' ? purchaseConfig.androidApiKey : undefined;
  if (!apiKey) return unavailableService('not-configured');
  const storePlatform = Platform.OS;
  const packages = new Map<string, PurchasesPackage>();

  return {
    unavailable: null,
    async start(onChange) {
      if (!configured) {
        // INFORMATIONAL verification lets access.ts refuse entitlements whose signature fails.
        Purchases.configure({ apiKey, entitlementVerificationMode: Purchases.ENTITLEMENT_VERIFICATION_MODE.INFORMATIONAL });
        configured = true;
      }
      const listener = (info: CustomerInfo) => onChange(snapshot(info));
      Purchases.addCustomerInfoUpdateListener(listener);
      return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
    },
    // getCustomerInfo serves the SDK's cached, signed info offline and refreshes it when online.
    refresh: async () => snapshot(await Purchases.getCustomerInfo()),
    async loadOffer(offeringId) {
      // Rejected/replaced offers must not leave an old purchasable package cached.
      packages.clear();
      const offerings = await Purchases.getOfferings();
      // Only the named offering: never fall back to "current", which could sell a different product.
      const offering = offerings.all[offeringId];
      const item = offering?.lifetime;
      // This screen promises a single one-time unlock. A sole monthly package is not a
      // substitute. Apple exposes NON_CONSUMABLE under StoreKit 2; Google exposes the
      // NON_SUBSCRIPTION category (consumability is configured in the store/dashboard).
      if (!item || offering.availablePackages.length !== 1 || item.identifier !== '$rc_lifetime' ||
        item.packageType !== 'LIFETIME' || offering.availablePackages[0].identifier !== item.identifier ||
        offering.availablePackages[0].product.identifier !== item.product.identifier ||
        item.product.productCategory !== 'NON_SUBSCRIPTION' || item.product.subscriptionPeriod !== null ||
        (storePlatform === 'ios' && item.product.productType !== 'NON_CONSUMABLE') ||
        (storePlatform === 'android' && !['UNKNOWN', 'NON_CONSUMABLE'].includes(item.product.productType)) ||
        !item.product.priceString.trim()) return null;
      packages.set(`${offeringId}:${item.identifier}`, item);
      return { packageId: item.identifier, priceString: item.product.priceString };
    },
    async purchase(offeringId, packageId) {
      const item = packages.get(`${offeringId}:${packageId}`);
      if (!item) return { kind: 'failed', failure: 'store' };
      try {
        const { customerInfo } = await Purchases.purchasePackage(item);
        return { kind: 'success', snapshot: snapshot(customerInfo) };
      } catch (error) { return outcomeFromStoreError(error); }
    },
    restore: async () => snapshot(await Purchases.restorePurchases()),
  };
}
