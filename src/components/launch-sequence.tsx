import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HotelBackdrop, useMotionPreference } from './game-ui';
import { colors as c, serif } from '@/game/tokens';

const native = Platform.OS !== 'web';
// The title card plays once each time the app starts, not on every return to the library.
let played = false;
export const resetLaunchSequenceForTests = () => { played = false; };

const leftLeaf = require('../../assets/brand/v2/launch/left.png');
const rightLeaf = require('../../assets/brand/v2/launch/right.png');
const EMBLEM = 176;
// The seam's foot on the 1024px mark (x 518, y 918): the ivory leaf swings from there like a door.
const HINGE = '50.6% 89.6%';

// Game start: the keyhole emblem appears whole, its ivory leaf swings open, drifts on the light
// and then settles slowly back into place while TWO and SIDES glide in with it. The seam flares
// as the two sides meet, then the brass rule and tagline follow. A tap skips it; reduced motion
// never shows it. Nothing here is needed to play, and no case content can be on screen yet.
export function LaunchSequence() {
  const { reduced, known } = useMotionPreference();
  const [done, setDone] = useState(played);
  const [root] = useState(() => new Animated.Value(1));
  const [appear] = useState(() => new Animated.Value(0));
  // One value walks the leaf through its keyframes: 0 closed, 1 swung open, 2 drifting, 3 home.
  const [leaf] = useState(() => new Animated.Value(0));
  const [seam] = useState(() => new Animated.Value(0));
  const [rule] = useState(() => new Animated.Value(0));
  const [tagline] = useState(() => new Animated.Value(0));
  const [zoom] = useState(() => new Animated.Value(0));
  const timeline = useRef<Animated.CompositeAnimation | null>(null);

  // Reduced motion never shows the card; it is derived rather than set from an effect.
  const hidden = done || (known && reduced);
  const finish = () => { played = true; setDone(true); };
  useEffect(() => { if (known && reduced) played = true; }, [known, reduced]);
  useEffect(() => {
    if (hidden || !known) return;
    const t = (value: Animated.Value, toValue: number, duration: number, easing = Easing.out(Easing.cubic), delay = 0) =>
      Animated.timing(value, { toValue, duration, delay, easing, useNativeDriver: native });
    timeline.current = Animated.sequence([
      Animated.parallel([
        t(zoom, 1, 4600, Easing.out(Easing.quad)),
        Animated.sequence([
          t(appear, 1, 450),
          t(leaf, 1, 650, Easing.out(Easing.cubic)),
          t(leaf, 2, 700, Easing.inOut(Easing.sin)),
          t(leaf, 3, 1500, Easing.inOut(Easing.cubic)),
          Animated.parallel([
            Animated.sequence([t(seam, 1, 180, Easing.out(Easing.quad)), t(seam, 0, 520, Easing.in(Easing.quad))]),
            t(rule, 1, 550),
            t(tagline, 1, 550, Easing.out(Easing.cubic), 150),
          ]),
        ]),
      ]),
      Animated.delay(450),
      t(root, 0, 400, Easing.inOut(Easing.quad)),
    ]);
    timeline.current.start(({ finished }) => { if (finished) finish(); });
    return () => timeline.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, known]);

  const skip = () => {
    timeline.current?.stop();
    Animated.timing(root, { toValue: 0, duration: 180, useNativeDriver: native }).start(finish);
  };
  if (hidden) return null;
  // Until the motion preference is known, cover the library quietly rather than flash it.
  if (!known) return <View pointerEvents="none" aria-hidden style={[s.overlay, s.plain]} />;

  const keyframes = (outputRange: number[] | string[]) =>
    leaf.interpolate({ inputRange: [0, 1, 2, 3], outputRange: outputRange as number[] });
  // The words arrive over the leaf's slow return, so they land in place together.
  const word = (from: number) => ({
    opacity: leaf.interpolate({ inputRange: [2, 2.45, 3], outputRange: [0, 0.65, 1], extrapolate: 'clamp' }),
    transform: [{ translateX: leaf.interpolate({ inputRange: [2, 3], outputRange: [from, 0], extrapolate: 'clamp' }) }],
  });
  return <Animated.View style={[s.overlay, { opacity: root }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="TWO SIDES. The Bellweather Files. Skip the introduction." onPress={skip} style={s.fill}>
      <Animated.View aria-hidden style={[s.fill, { transform: [{ scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] }) }] }]}>
        <HotelBackdrop cover />
      </Animated.View>
      <View aria-hidden style={[s.fill, s.scrim]} />
      <View style={s.center}>
        <Animated.View aria-hidden style={[s.emblem, {
          opacity: appear, transform: [{ scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
        }]}>
          <Animated.View style={[s.seam, { opacity: seam, transform: [{ scaleY: seam.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }]}>
            <LinearGradient colors={['rgba(242,207,122,0)', 'rgba(242,207,122,0.85)', 'rgba(242,207,122,0)']}
              start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
          <Image source={rightLeaf} resizeMode="contain" style={s.leaf} />
          <Animated.Image source={leftLeaf} resizeMode="contain" style={[s.leaf, {
            transformOrigin: HINGE,
            transform: [
              { translateX: keyframes([0, -8, -28, 0]) },
              { translateY: keyframes([0, -4, -16, 0]) },
              { rotate: keyframes(['0deg', '-26deg', '-14deg', '0deg']) },
            ],
          }]} />
        </Animated.View>
        <View style={s.wordmark}>
          <Animated.Text style={[s.word, word(-44)]}>TWO</Animated.Text>
          <Animated.Text style={[s.slash, { opacity: leaf.interpolate({ inputRange: [2.6, 3], outputRange: [0, 1], extrapolate: 'clamp' }) }]}>/</Animated.Text>
          <Animated.Text style={[s.word, word(44)]}>SIDES</Animated.Text>
        </View>
        <Animated.View aria-hidden style={[s.rule, { transform: [{ scaleX: rule }] }]} />
        <Animated.View style={[s.taglines, { opacity: tagline, transform: [{ translateY: tagline.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
          <Text style={s.series}>THE BELLWEATHER FILES</Text>
          <Text style={s.tagline}>A SHARED PHONE MYSTERY</Text>
        </Animated.View>
      </View>
    </Pressable>
  </Animated.View>;
}

const s = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 100, backgroundColor: c.deep },
  plain: { backgroundColor: c.deep },
  fill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  scrim: { backgroundColor: 'rgba(9,18,27,0.62)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 20 },
  emblem: { width: EMBLEM, height: EMBLEM, marginBottom: 4 },
  leaf: { position: 'absolute', top: 0, left: 0, width: EMBLEM, height: EMBLEM },
  seam: { position: 'absolute', top: EMBLEM * 0.1, bottom: EMBLEM * 0.1, left: EMBLEM * 0.506 - 22, width: 44 },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  word: { color: c.ivory, fontSize: 38, lineHeight: 46, letterSpacing: 6, fontWeight: '600' },
  slash: { color: c.brass, fontSize: 44, lineHeight: 52, fontWeight: '300' },
  rule: { width: 190, height: 1, backgroundColor: c.brass },
  taglines: { alignItems: 'center', gap: 6 },
  series: { color: c.brass, fontFamily: serif, fontSize: 15, lineHeight: 22, letterSpacing: 3 },
  tagline: { color: c.ivory, fontSize: 10, lineHeight: 16, letterSpacing: 2.5 },
});
