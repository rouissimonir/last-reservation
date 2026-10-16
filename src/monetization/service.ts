import { PurchaseService } from './purchase-state';
import { unavailableService } from './unavailable';

// Web build. react-native-purchases is deliberately not imported here: native store purchases
// cannot be made or verified in a browser.
export function createPurchaseService(): PurchaseService { return unavailableService('web'); }
