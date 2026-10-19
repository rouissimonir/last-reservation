import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { HotelBackdrop, useMotionPreference } from './game-ui';
import { colors as c, serif } from '@/game/tokens';

const native = Platform.OS !== 'web';
// The title card plays once each time the app starts, not on every return to the library.
let played = false;
export const resetLaunchSequenceForTests = () => { played = false; };

// Game start: the hotel backdrop settles, a brass rule draws, then TWO and SIDES slide in from
// opposite edges around the slash. A tap skips it; reduced motion never shows it. Nothing here is
// needed to play, and no case content can be on screen yet (this runs before the library).
export function LaunchSequence() {
  const { reduced, known } = useMotionPreference();
  const [done, setDone] = useState(played);
  const [root] = useState(() => new Animated.Value(1));
  const [rule] = useState(() => new Animated.Value(0));
  const [badge] = useState(() => new Animated.Value(0));
  const [left] = useState(() => new Animated.Value(0));
  const [right] = useState(() => new Animated.Value(0));
  const [slash] = useState(() => new Animated.Value(0));
  const [tagline] = useState(() => new Animated.Value(0));
  const [zoom] = useState(() => new Animated.Value(0));
  const timeline = useRef<Animated.CompositeAnimation | null>(null);

  // Reduced motion never shows the card; it is derived rather than set from an effect.
  const hidden = done || (known && reduced);
  const finish = () => { played = true; setDone(true); };
  useEffect(() => { if (known && reduced) played = true; }, [known, reduced]);
  useEffect(() => {
    if (hidden || !known) return;
    const t = (value: Animated.Value, toValue: number, duration: number, delay = 0, easing = Easing.out(Easing.cubic)) =>
      Animated.timing(value, { toValue, duration, delay, easing, useNativeDriver: native });
    timeline.current = Animated.sequence([
      Animated.parallel([
        t(zoom, 1, 2900, 0, Easing.out(Easing.quad)),
        t(badge, 1, 500, 100),
        t(rule, 1, 700, 300),
        t(left, 1, 600, 600),
        t(right, 1, 600, 600),
        t(slash, 1, 450, 850, Easing.out(Easing.back(2))),
        t(tagline, 1, 600, 1350),
      ]),
      Animated.delay(450),
      t(root, 0, 450, 0, Easing.inOut(Easing.quad)),
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

  const rise = (value: Animated.Value, from: number) => ({
    opacity: value, transform: [{ translateX: value.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
  });
  return <Animated.View style={[s.overlay, { opacity: root }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="TWO SIDES. The Bellweather Files. Skip the introduction." onPress={skip} style={s.fill}>
      <Animated.View aria-hidden style={[s.fill, { transform: [{ scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] }) }] }]}>
        <HotelBackdrop cover />
      </Animated.View>
      <View aria-hidden style={[s.fill, s.scrim]} />
      <View style={s.center}>
        <Animated.View aria-hidden style={[s.badge, { opacity: badge, transform: [{ rotate: '45deg' }, { scale: badge.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }]}>
          <Text style={s.badgeText}>BH</Text>
        </Animated.View>
        <View style={s.wordmark}>
          <Animated.Text style={[s.word, rise(left, -48)]}>TWO</Animated.Text>
          <Animated.Text style={[s.slash, { opacity: slash, transform: [{ scale: slash.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }] }]}>/</Animated.Text>
          <Animated.Text style={[s.word, rise(right, 48)]}>SIDES</Animated.Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22, paddingHorizontal: 20 },
  badge: { borderWidth: 1, borderColor: c.brass, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  badgeText: { fontFamily: serif, fontSize: 16, color: c.brass, transform: [{ rotate: '-45deg' }] },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  word: { color: c.ivory, fontSize: 38, lineHeight: 46, letterSpacing: 6, fontWeight: '600' },
  slash: { color: c.brass, fontSize: 44, lineHeight: 52, fontWeight: '300' },
  rule: { width: 190, height: 1, backgroundColor: c.brass },
  taglines: { alignItems: 'center', gap: 6 },
  series: { color: c.brass, fontFamily: serif, fontSize: 15, lineHeight: 22, letterSpacing: 3 },
  tagline: { color: c.ivory, fontSize: 10, lineHeight: 16, letterSpacing: 2.5 },
});
