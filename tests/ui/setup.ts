import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-safe-area-context', () =>
  jest.requireActual<{ default: unknown }>('react-native-safe-area-context/jest/mock').default);

// Native audio and haptics have no Jest runtime. Players are recorded so tests can inspect them.
jest.mock('expo-audio', () => {
  const players: unknown[] = [];
  return {
    __players: players,
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    createAudioPlayer: jest.fn((source: unknown) => {
      const player = {
        source, volume: 1, loop: false, playing: false,
        play: jest.fn(() => { player.playing = true; }),
        pause: jest.fn(() => { player.playing = false; }),
        seekTo: jest.fn(() => Promise.resolve()),
        remove: jest.fn(),
      };
      players.push(player);
      return player;
    }),
  };
});
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy', Rigid: 'rigid', Soft: 'soft' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));
