import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/game/tokens';
import { PurchasesProvider } from '@/monetization/purchases-provider';
import { SoundProvider } from '@/sound/sound-provider';

export default function RootLayout() {
  return <SafeAreaProvider>
    <PurchasesProvider><SoundProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'none', gestureEnabled: false,
        contentStyle: { backgroundColor: colors.deep } }}>
        <Stack.Screen name="index" options={{ title: 'TWO SIDES: Co-op Mystery' }} />
        <Stack.Screen name="after-midnight" options={{ title: 'TWO SIDES · After Midnight Collection' }} />
        <Stack.Screen name="help" options={{ title: 'TWO SIDES · Help & Privacy' }} />
        <Stack.Screen name="settings" options={{ title: 'TWO SIDES · Settings' }} />
      </Stack>
    </SoundProvider></PurchasesProvider>
  </SafeAreaProvider>;
}
