import { router, useLocalSearchParams } from 'expo-router';
import { CollectionOffer } from '@/components/collection-offer';

const sources = ['library', 'locked_case'] as const;

export default function AfterMidnightOffer() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const known = sources.find(item => item === source) ?? 'direct';
  return <CollectionOffer source={known} onClose={() => router.canGoBack() ? router.back() : router.replace('/')} />;
}
