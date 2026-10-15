import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/game/tokens';

export default function RootLayout() {
  return <SafeAreaProvider>
    <StatusBar style="light" />
    <Stack screenOptions={{ headerShown: false, animation: 'none', gestureEnabled: false,
      contentStyle: { backgroundColor: colors.deep } }}>
      <Stack.Screen name="index" options={{ title: 'TWO SIDES · The Missing Envelope' }} />
    </Stack>
  </SafeAreaProvider>;
}
