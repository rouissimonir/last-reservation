import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CollectionOffer } from '@/components/collection-offer';
import { initialPurchaseState, PurchaseState } from '@/monetization/purchase-state';

const mockPurchase = jest.fn(async () => {});
const mockValue = {
  state: { ...initialPurchaseState, offer: { status: 'ready', offer: { packageId: '$rc_lifetime', priceString: '5,99 €' } } } as PurchaseState,
  access: { entitlements: [], devPreview: false }, storeUnavailable: false,
  purchase: mockPurchase, restore: jest.fn(async () => {}), retryOffer: jest.fn(),
};
jest.mock('@/monetization/purchases-provider', () => ({ usePurchases: () => mockValue }));
jest.mock('@/monetization/config', () => ({ purchaseConfig: {}, safeLink: () => null }));

test('unlock uses the store-localized price and one-time terms; pending cannot start another purchase', async () => {
  const view = await render(<CollectionOffer source="library" onClose={jest.fn()} onCases={jest.fn()} />);
  const label = 'Unlock all 3 — 5,99 €';
  expect(screen.getByText('Includes the three After Midnight cases. Future collections sold separately.')).toBeTruthy();
  expect(screen.queryByText(/Three longer/)).toBeNull();
  expect(screen.queryByText(/\$4\.99/)).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: label }));
  expect(mockPurchase).toHaveBeenCalledTimes(1);
  mockValue.state = { ...mockValue.state, activity: 'pending' };
  await view.rerender(<CollectionOffer source="library" onClose={jest.fn()} onCases={jest.fn()} />);
  expect(screen.getByText('Waiting for approval…')).toBeTruthy();
  expect(screen.getByRole('button', { name: label }).props.accessibilityState.disabled).toBe(true);
  await fireEvent.press(screen.getByRole('button', { name: label }));
  expect(mockPurchase).toHaveBeenCalledTimes(1);
});
