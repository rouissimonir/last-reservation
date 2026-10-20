import { View } from 'react-native';
import { Investigation } from '@/components/investigation';
import { LaunchSequence } from '@/components/launch-sequence';
import Head from 'expo-router/head';

export default function HomeScreen() {
  return <><Head><title>TWO SIDES: Co-op Mystery</title></Head>
    <View style={{ flex: 1 }}><Investigation /><LaunchSequence /></View></>;
}
