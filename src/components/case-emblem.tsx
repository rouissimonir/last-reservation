import { useContext } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { EnvelopeArt, ReadingContext } from './game-ui';
import { Emblem } from '@/game/presentation';

const illustrations: Record<Emblem, ImageSourcePropType> = {
  envelope: require('../../assets/art/optimized/case-envelope.png'),
  ledger: require('../../assets/art/covers/optimized/reservation-ledger.png'),
  piano: require('../../assets/art/covers/optimized/silent-piano.png'),
  mask: require('../../assets/art/covers/optimized/masquerade-mask.png'),
  'music-box': require('../../assets/art/covers/optimized/music-box.png'),
  key: require('../../assets/art/covers/optimized/room-key.png'),
  telephone: require('../../assets/art/covers/optimized/midnight-telephone.png'),
  frame: require('../../assets/art/covers/optimized/portrait-frame.png'),
};

// Decorative only: native Text carries every title, clue and action. Asset provenance and
// generation prompts are recorded in assets/art/covers/PROMPTS.md.
export function CaseEmblem({ emblem, small = false }: { emblem: Emblem; small?: boolean }) {
  const { compact } = useContext(ReadingContext);
  if (emblem === 'envelope' && !small) return <EnvelopeArt />;
  return <View aria-hidden pointerEvents="none" style={[s.stage, { height: small ? 92 : compact ? 176 : 220 }]}>
    <Image source={illustrations[emblem]} resizeMode="contain" style={s.image} />
  </View>;
}

const s = StyleSheet.create({
  stage: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});
