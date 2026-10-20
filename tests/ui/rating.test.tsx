import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, AppState } from 'react-native';

import { Investigation } from '../../src/components/investigation';
import { LaunchSequence, resetLaunchSequenceForTests } from '../../src/components/launch-sequence';
import { rounds } from '../../src/game/case';
import { initialPurchaseState } from '../../src/monetization/purchase-state';

const mockPurchaseState = { ...initialPurchaseState, entitlementsKnown: true };
jest.mock('expo-router', () => ({
  useIsFocused: () => true,
  useFocusEffect: (callback: () => (() => void)) => {
    const { useEffect } = jest.requireActual<typeof import('react')>('react');
    useEffect(() => callback(), [callback]);
  },
  router: { push: jest.fn() },
}));
jest.mock('../../src/monetization/purchases-provider', () => ({
  usePurchases: () => ({ access: { entitlements: [], devPreview: false }, state: mockPurchaseState }),
}));

const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));

// Plays The Missing Envelope through the real screens, taking hints[i] hints before answering round i.
async function playCase(hints: number[], { wrongFirst = false } = {}) {
  await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
  await playFromCover(hints, { wrongFirst });
}
async function playFromCover(hints: number[], { wrongFirst = false } = {}) {
  await fireEvent.press(await screen.findByRole('button', { name: 'Open the case' }));
  await press('Meet your two roles →');
  await press('We’ve chosen our roles →');
  for (let i = 0; i < rounds.length; i++) {
    await press('I’m ready'); await press('Hide evidence & continue');
    await press('I’m ready'); await press('Hide evidence & continue');
    for (let h = 0; h < (hints[i] ?? 0); h++) await press(new RegExp(`Reveal (solution )?hint.* ${h + 1} of 3`));
    if (wrongFirst) {
      await press(new RegExp(rounds[i].options.find(o => o !== rounds[i].correct)!));
      await press('Confirm our deduction →');
      expect(screen.getByText(/wrong answers never cost stars/)).toBeTruthy();
    }
    await press(new RegExp(rounds[i].options.find(o => o === rounds[i].correct)!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await press('Confirm our deduction →');
    await press(i < rounds.length - 1 ? 'Open the next chapter →' : 'Read the resolution →');
  }
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  jest.spyOn(AppState, 'addEventListener').mockImplementation(() => ({ remove: () => {} }));
});
afterEach(() => { jest.restoreAllMocks(); });

describe('hint-based rating, through the real screens', () => {
  it('shows what a hint costs before it is taken, and updates the stars when it is', async () => {
    await render(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Open the case' }));
    await press('Meet your two roles →');
    await press('We’ve chosen our roles →');
    await press('I’m ready'); await press('Hide evidence & continue');
    await press('I’m ready'); await press('Hide evidence & continue');
    expect(screen.getByText(/^3 of 3 · Solve it without hints/)).toBeTruthy();
    await press('Reveal hint 1 of 3. Costs one star.');
    expect(screen.getByText(/^2 of 3 · 1 hint revealed/)).toBeTruthy();
    await press('Reveal hint 2 of 3. Costs one star.');
    expect(screen.getByText(/^1 of 3 · 2 hints revealed/)).toBeTruthy();
    await press('Reveal solution hint, 3 of 3. Costs one star.');
    expect(screen.getByText(/^0 of 3 · Solution hint revealed/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Reveal/ })).toBeNull();
  });

  it('a hint-free solve is a Perfect Deduction, with every deduction rated Flawless', async () => {
    await render(<Investigation />);
    await playCase([]);
    expect(screen.getByText('Perfect Deduction')).toBeTruthy();
    expect(screen.getByText(/Detective score 100 · 9 of 9 stars · No hints used/)).toBeTruthy();
    expect(screen.getAllByText(/^Flawless · No hints$/)).toHaveLength(3);
  });

  it('one hint and two hints feel different from none and from each other', async () => {
    const one = await render(<Investigation />);
    await playCase([0, 1]);
    expect(screen.getByText('Sharp Minds')).toBeTruthy();
    expect(screen.queryByText('Perfect Deduction')).toBeNull();
    expect(screen.getByText(/Detective score 89 · 8 of 9 stars · 1 hint used/)).toBeTruthy();
    expect(screen.getByText('Sharp · 1 hint')).toBeTruthy();
    await one.unmount();

    await AsyncStorage.clear();
    await render(<Investigation />);
    await playCase([1, 1]);
    expect(screen.getByText('Steady Hands')).toBeTruthy();
    expect(screen.getByText(/Detective score 78 · 7 of 9 stars · 2 hints used/)).toBeTruthy();
  });

  it('shows the deduction’s own rating when it is confirmed', async () => {
    await render(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Open the case' }));
    await press('Meet your two roles →');
    await press('We’ve chosen our roles →');
    await press('I’m ready'); await press('Hide evidence & continue');
    await press('I’m ready'); await press('Hide evidence & continue');
    await press('Reveal hint 1 of 3. Costs one star.');
    await press(new RegExp(rounds[0].correct));
    await press('Confirm our deduction →');
    expect(screen.getByText('CONFIRMED')).toBeTruthy();
    expect(screen.getByText(/^Sharp · 2 of 3 stars$/)).toBeTruthy();
    expect(screen.getByText('1 hint used')).toBeTruthy();
  });

  it('wrong answers never lower a rating', async () => {
    await render(<Investigation />);
    await playCase([], { wrongFirst: true });
    expect(screen.getByText('Perfect Deduction')).toBeTruthy();
  });

  it('the rating is kept on the case card in the library', async () => {
    await render(<Investigation />);
    await playCase([1]);
    await press('Choose your next mystery');
    expect(await screen.findByText(/Sharp Minds · score 89 · 1 hint/)).toBeTruthy();
  });

  it('adds nothing to the save: reopening the finished case reproduces the same rating', async () => {
    const first = await render(<Investigation />);
    await playCase([2]);
    await first.unmount();
    await render(<Investigation />);
    await fireEvent.press(await screen.findByRole('button', { name: 'Open The Missing Envelope' }));
    await fireEvent.press(await screen.findByRole('button', { name: 'Continue investigation' }));
    expect(screen.getByText('Steady Hands')).toBeTruthy();
    expect(screen.getByText(/2 hints used/)).toBeTruthy();
  });
});

describe('personal best', () => {
  const replay = async () => {
    await press('Play the case again…');
    await press('Yes, reset this case');
  };

  it('survives replays: a better run is announced, a worse one keeps the best', async () => {
    await render(<Investigation />);
    await playCase([1]);
    expect(await screen.findByText('Your best: Sharp Minds, score 89. Solved once.')).toBeTruthy();
    await replay();
    await playFromCover([]);
    expect(await screen.findByText('New personal best for this case.')).toBeTruthy();
    await replay();
    await playFromCover([3, 3, 3]);
    expect(await screen.findByText('Your best: Perfect Deduction, score 100. Solved 3 times.')).toBeTruthy();
    await press('Choose your next mystery');
    expect(await screen.findByText('Best: Perfect Deduction · score 100 · No hints · solved 3 times')).toBeTruthy();
    expect(JSON.parse((await AsyncStorage.getItem('two-sides/the-missing-envelope/record/v1'))!)).toMatchObject({ solves: 3, bestScore: 100, bestHints: 0 });
  });

  it('never replaces an unreadable record', async () => {
    await AsyncStorage.setItem('two-sides/the-missing-envelope/record/v1', '{damaged');
    await render(<Investigation />);
    await playCase([]);
    expect(screen.getByText('Perfect Deduction')).toBeTruthy();
    expect(screen.queryByText(/Your best|New personal best/)).toBeNull();
    expect(await AsyncStorage.getItem('two-sides/the-missing-envelope/record/v1')).toBe('{damaged');
  });
});

describe('game-start sequence', () => {
  beforeEach(() => { resetLaunchSequenceForTests(); });

  it('is skipped entirely with reduced motion', async () => {
    await render(<LaunchSequence />);
    await act(async () => {});
    expect(screen.queryByRole('button', { name: /Skip the introduction/ })).toBeNull();
  });

  it('plays when motion is allowed, and a tap skips it for the rest of the session', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const view = await render(<LaunchSequence />);
    expect(await screen.findByRole('button', { name: /TWO SIDES. The Bellweather Files. Skip the introduction/ })).toBeTruthy();
    expect(screen.getByText('TWO')).toBeTruthy();
    expect(screen.getByText('SIDES')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: /Skip the introduction/ }));
    await waitFor(() => expect(screen.queryByRole('button', { name: /Skip the introduction/ })).toBeNull(), { timeout: 3000 });
    await view.unmount();
    await render(<LaunchSequence />);
    await act(async () => {});
    expect(screen.queryByRole('button', { name: /Skip the introduction/ })).toBeNull();
  });
});
