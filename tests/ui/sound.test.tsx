import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { SoundSettings } from '@/components/sound-settings';
import { PREFERENCES_KEY } from '@/sound/preferences';
import { SoundProvider } from '@/sound/sound-provider';

type AnyMock = ReturnType<typeof jest.fn>;
type MockPlayer = { source: unknown; volume: number; loop: boolean; playing: boolean; play: AnyMock; pause: AnyMock };
const players = (jest.requireMock('expo-audio') as { __players: MockPlayer[] }).__players;
const music = () => players.find(p => p.loop)!;
const stored = async () => JSON.parse((await AsyncStorage.getItem(PREFERENCES_KEY)) ?? 'null');

beforeEach(async () => {
  players.length = 0;
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
const renderSettings = () => render(<SoundProvider><SoundSettings /></SoundProvider>);
const slow = { timeout: 4000 };

test('music fades in quietly by default and turning it off is saved', async () => {
  await renderSettings();
  await waitFor(() => expect(music().play).toHaveBeenCalled());
  await waitFor(() => expect(music().volume).toBeCloseTo(0.28), slow);
  expect(music().volume).toBeLessThanOrEqual(0.3);

  await fireEvent.press(screen.getByText('Music: On'));
  expect(screen.getByText('Music: Off')).toBeTruthy();
  await waitFor(() => expect(music().pause).toHaveBeenCalled(), slow);
  expect(music().volume).toBe(0);
  await waitFor(async () => expect((await stored()).music).toBe(false));
});

test('saved choices are honoured on launch and haptics can be turned off', async () => {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify({ music: false, musicLevel: 2, effects: true, effectsLevel: 3, haptics: true }));
  await renderSettings();
  expect(await screen.findByText('Music: Off')).toBeTruthy();
  expect(music().play).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText('Haptics: On'));
  (Haptics.selectionAsync as unknown as AnyMock).mockClear();
  await fireEvent.press(screen.getByLabelText('Raise effects volume'));
  expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  expect(screen.getByText('Effects volume · 4 of 5')).toBeTruthy();
  await waitFor(async () => expect(await stored()).toMatchObject({ haptics: false, effectsLevel: 4 }));
});

test('an unreadable preferences record is kept, and music stays off until the player chooses', async () => {
  await AsyncStorage.setItem(PREFERENCES_KEY, '{broken');
  await renderSettings();
  expect(await screen.findByText(/could not be read/)).toBeTruthy();
  expect(music().play).not.toHaveBeenCalled();
  expect(await AsyncStorage.getItem(PREFERENCES_KEY)).toBe('{broken');
  await fireEvent.press(screen.getByText('Music: Off'));
  await waitFor(async () => expect((await stored()).music).toBe(true));
  await waitFor(() => expect(music().play).toHaveBeenCalled());
});
