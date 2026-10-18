import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import AfterMidnightOffer from '../../src/app/after-midnight';
import { initialPurchaseState, PurchaseState } from '../../src/monetization/purchase-state';

const mockRestore = jest.fn(async () => {});
const mockValue = {
  state: { ...initialPurchaseState, offer: { status: 'unavailable', reason: 'web' } } as PurchaseState,
  access: { entitlements: [] as string[], devPreview: false },
  storeUnavailable: true, purchase: jest.fn(async () => {}), restore: mockRestore,
  retryOffer: jest.fn(), dismiss: jest.fn(),
};
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  router: { canGoBack: () => true, back: jest.fn(), replace: jest.fn(), dismissTo: jest.fn() },
}));
jest.mock('../../src/monetization/purchases-provider', () => ({ usePurchases: () => mockValue }));
jest.mock('../../src/monetization/config', () => ({ purchaseConfig: {}, safeLink: () => null }));

beforeEach(() => {
  jest.clearAllMocks();
  mockValue.state = { ...initialPurchaseState, offer: { status: 'unavailable', reason: 'web' } };
  mockValue.access = { entitlements: [], devPreview: false };
});

describe('collection navigation uses the named destination', () => {
  it('Back to the cases dismisses to the library rather than the previous Help screen', async () => {
    await render(<AfterMidnightOffer />);
    await fireEvent.press(screen.getByRole('button', { name: 'Back to the cases' }));
    expect(router.dismissTo).toHaveBeenCalledWith('/');
    expect(router.back).not.toHaveBeenCalled();
  });

  it('Close still returns to the preceding screen', async () => {
    await render(<AfterMidnightOffer />);
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.dismissTo).not.toHaveBeenCalled();
  });

  it('owned Choose a case returns to the library; the web preview cannot buy or restore', async () => {
    const view = await render(<AfterMidnightOffer />);
    expect(screen.queryByRole('button', { name: /Unlock all 3/ })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Restore Purchases' }));
    expect(mockRestore).not.toHaveBeenCalled();
    mockValue.state = { ...mockValue.state, entitlements: ['after_midnight_collection'], entitlementsKnown: true };
    mockValue.access = { entitlements: ['after_midnight_collection'], devPreview: false };
    await view.rerender(<AfterMidnightOffer />);
    await fireEvent.press(screen.getByRole('button', { name: 'Choose a case' }));
    expect(router.dismissTo).toHaveBeenCalledWith('/');
  });
});
