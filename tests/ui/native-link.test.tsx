import { describe, expect, it, jest } from '@jest/globals';
import { getLinkingConfig } from 'expo-router/build/getLinkingConfig';
import { getRoutes } from 'expo-router/build/getRoutes';
import type { RequireContext } from 'expo-router/build/types';

import { redirectSystemPath } from '../../src/app/+native-intent';

const mockNativeListeners = new Set<(event: { url: string }) => void | Promise<void>>();
jest.mock('expo-linking', () => ({
  ...jest.requireActual<object>('expo-linking'),
  addEventListener: jest.fn((_type: string, listener: (event: { url: string }) => void | Promise<void>) => {
    mockNativeListeners.add(listener);
    return { remove: () => { mockNativeListeners.delete(listener); } };
  }),
}));

function routeFixture() {
  const context = Object.assign((key: string) => key === './+native-intent.ts' ? { redirectSystemPath } : { default: () => null }, {
    keys: () => ['./index.tsx', './help.tsx', './after-midnight.tsx', './+native-intent.ts'],
    resolve: (key: string) => key, id: 'native-intent-fixture',
  }) as RequireContext;
  const routes = getRoutes(context, { platform: 'ios', skipGenerated: true });
  if (!routes) throw new Error('Router did not construct the fixture route tree');
  return { routes, context };
}

describe('installed Expo Router native-intent registration', () => {
  it('passes initial native URLs through the actual registered filter before state parsing', async () => {
    const { routes, context } = routeFixture();
    for (const [input, expected] of [
      ['lastreservation:///help', '/help'],
      ['lastreservation://after-midnight?source=library&premium=1', '/after-midnight?source=library'],
      [`lastreservation:///after-midnight?bad=${'%FF'.repeat(5000)}`, '/'],
    ]) {
      const linking = getLinkingConfig(routes, context, () => { throw new Error('Not needed for initial URL filtering'); }, {
        serverUrl: input, skipGenerated: true, sitemap: false, notFound: false,
      });
      expect(await linking.getInitialURL?.()).toBe(expected);
    }
  });

  it('filters foreground native link events through Router and unsubscribes its native listener', async () => {
    const { routes, context } = routeFixture();
    const linking = getLinkingConfig(routes, context, () => { throw new Error('Not needed for event filtering'); }, {
      skipGenerated: true, sitemap: false, notFound: false,
    });
    const listener = jest.fn<(url: string) => void>();
    const stop = linking.subscribe?.(listener);
    expect(mockNativeListeners.size).toBe(1);
    await Promise.all([...mockNativeListeners].map(callback => callback({ url: 'lastreservation://after-midnight?source=locked_case&premium=1' })));
    expect(listener).toHaveBeenCalledWith('/after-midnight?source=locked_case');
    if (typeof stop !== 'function') throw new Error('Router did not provide subscription cleanup');
    stop();
    expect(mockNativeListeners.size).toBe(0);
  });
});
