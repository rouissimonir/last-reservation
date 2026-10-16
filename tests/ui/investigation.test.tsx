import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, AppState, AppStateStatus } from 'react-native';

import { Investigation } from '../../src/components/investigation';
import { CASE_ID, rounds } from '../../src/game/case';
import { getCase } from '../../src/game/cases';
import { freshProgress } from '../../src/game/engine';
import { loadProgress, saveKey, SAVE_KEY } from '../../src/game/storage';
import type { Access } from '../../src/monetization/access';
import { initialPurchaseState } from '../../src/monetization/purchase-state';

let mockFocused = true;
let mockAccess: Access = { entitlements: [], devPreview: false };
const mockPurchaseState = { ...initialPurchaseState, entitlementsKnown: true };
jest.mock('expo-router', () => ({
  useIsFocused: () => mockFocused,
  useFocusEffect: (callback: () => (() => void)) => {
    const { useEffect } = jest.requireActual<typeof import('react')>('react');
    const focused = mockFocused;
    useEffect(() => focused ? callback() : undefined, [callback, focused]);
  },
  router: { push: jest.fn() },
}));
jest.mock('../../src/monetization/purchases-provider', () => ({
  usePurchases: () => ({ access: mockAccess, state: mockPurchaseState }),
}));

const appEvents = new Set<(state: AppStateStatus) => void>();
async function openPrivate(caseId = CASE_ID) {
  const item = getCase(caseId);
  await fireEvent.press(await screen.findByRole('button', { name: `Open ${item.title}` }));
  await fireEvent.press(await screen.findByRole('button', { name: 'Open the case' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Meet your two roles →' }));
  await fireEvent.press(screen.getByRole('button', { name: 'We’ve chosen our roles →' }));
  expect(screen.queryByText(item.rounds[0].evidence.A.title, { includeHiddenElements: true })).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'I’m ready' }));
  expect(screen.getByText(item.rounds[0].evidence.A.title)).toBeTruthy();
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith(saveKey(caseId), expect.any(String)));
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  mockFocused = true;
  mockAccess = { entitlements: [], devPreview: false };
  appEvents.clear();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
    appEvents.add(handler);
    return { remove: () => { appEvents.delete(handler); } };
  });
});
afterEach(() => { jest.restoreAllMocks(); });

describe('real investigation component privacy and save boundaries', () => {
  it('unmounts a private sheet on route focus loss without an AppState event; return requires readiness', async () => {
    const view = await render(<Investigation />);
    await openPrivate();
    const before = await loadProgress(AsyncStorage);
    expect(before.kind).toBe('loaded');
    if (before.kind === 'loaded') expect(before.progress.read).toEqual(freshProgress().read);

    mockFocused = false;
    await view.rerender(<Investigation />);
    expect(screen.queryByText(rounds[0].evidence.A.title, { includeHiddenElements: true })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Hide evidence & continue', includeHiddenElements: true })).toBeNull();

    mockFocused = true;
    await view.rerender(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Continue investigation' }));
    expect(screen.getByRole('button', { name: 'I’m ready' })).toBeTruthy();
    expect(screen.queryByText(rounds[0].evidence.A.title, { includeHiddenElements: true })).toBeNull();
    expect(await loadProgress(AsyncStorage)).toEqual(before);
  });

  it('unmounts revoked premium evidence; a later grant starts at the cover without changing the save', async () => {
    const id = 'the-room-never-booked';
    const title = getCase(id).rounds[0].evidence.A.title;
    mockAccess = { entitlements: ['after_midnight_collection'], devPreview: false };
    const view = await render(<Investigation />);
    await openPrivate(id);
    const before = await loadProgress(AsyncStorage, id);

    mockAccess = { entitlements: [], devPreview: false };
    await view.rerender(<Investigation />);
    expect(screen.queryByText(title, { includeHiddenElements: true })).toBeNull();
    expect(screen.getByRole('button', { name: 'See the collection' })).toBeTruthy();
    mockAccess = { entitlements: ['after_midnight_collection'], devPreview: false };
    await view.rerender(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Continue investigation' }));
    expect(screen.getByRole('button', { name: 'I’m ready' })).toBeTruthy();
    expect(screen.queryByText(title, { includeHiddenElements: true })).toBeNull();
    expect(await loadProgress(AsyncStorage, id)).toEqual(before);
  });

  it('conceals on native inactivity without marking the private sheet read', async () => {
    await render(<Investigation />);
    await openPrivate();
    const before = await loadProgress(AsyncStorage);
    await act(async () => { appEvents.forEach(handler => handler('inactive')); });
    expect(screen.queryByText(rounds[0].evidence.A.title, { includeHiddenElements: true })).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue investigation' })).toBeTruthy();
    expect(await loadProgress(AsyncStorage)).toEqual(before);
  });

  it('lets a damaged save return to the library or play unsaved without replacing the data', async () => {
    const damaged = '{not a valid save';
    await AsyncStorage.setItem(SAVE_KEY, damaged);
    await render(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Choose another case' }));
    expect(await screen.findByText('Choose your case.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Play without saving' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Open the case' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Meet your two roles →' }));
    await fireEvent.press(screen.getByRole('button', { name: 'We’ve chosen our roles →' }));
    expect(await AsyncStorage.getItem(SAVE_KEY)).toBe(damaged);
    expect(screen.getByText('Playing without saving. Your existing save is untouched.')).toBeTruthy();
  });
});
