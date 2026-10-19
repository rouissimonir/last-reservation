import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// Small, decorative motion primitives. Nothing here is essential: with `reduced` set every
// primitive renders its final state at once, and each one keeps its content as real text.
const native = Platform.OS !== 'web';
const run = (animation: Animated.CompositeAnimation) => { animation.start(); return () => animation.stop(); };

// Fades and rises into place, optionally after a delay, so a screen can build up in stages.
export function Entrance({ children, reduced, delay = 0, distance = 12, duration = 380, style }: {
  children: ReactNode; reduced: boolean; delay?: number; distance?: number; duration?: number; style?: StyleProp<ViewStyle>;
}) {
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));
  useEffect(() => {
    if (reduced) { progress.setValue(1); return; }
    progress.setValue(0);
    return run(Animated.timing(progress, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: native }));
  }, [progress, reduced, delay, duration]);
  return <Animated.View style={[style, { opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }]}>{children}</Animated.View>;
}

// Springs up from small, for stars and badges.
export function PopIn({ children, reduced, delay = 0, from = 0.3, style, onLand }: {
  children: ReactNode; reduced: boolean; delay?: number; from?: number; style?: StyleProp<ViewStyle>; onLand?: () => void;
}) {
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const land = useRef(onLand);
  useEffect(() => { land.current = onLand; });
  useEffect(() => {
    if (reduced) { progress.setValue(1); return; }
    progress.setValue(0);
    return run(Animated.sequence([
      Animated.delay(delay),
      Animated.spring(progress, { toValue: 1, friction: 5, tension: 120, useNativeDriver: native }),
    ]));
  }, [progress, reduced, delay]);
  useEffect(() => {
    if (reduced || !land.current) return;
    const id = setTimeout(() => land.current?.(), delay + 120);
    return () => clearTimeout(id);
  }, [reduced, delay]);
  return <Animated.View style={[style, { opacity: progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' }),
    transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [from, 1] }) }] }]}>{children}</Animated.View>;
}

// A rubber stamp coming down: large and tilted, then pressed into the page.
export function Stamp({ children, reduced, delay = 0, tilt = -6, style, onLand }: {
  children: ReactNode; reduced: boolean; delay?: number; tilt?: number; style?: StyleProp<ViewStyle>; onLand?: () => void;
}) {
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const land = useRef(onLand);
  useEffect(() => { land.current = onLand; });
  useEffect(() => {
    if (reduced) { progress.setValue(1); return; }
    progress.setValue(0);
    return run(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, { toValue: 1, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: native }),
    ]));
  }, [progress, reduced, delay]);
  useEffect(() => {
    if (reduced || !land.current) return;
    const id = setTimeout(() => land.current?.(), delay + 400);
    return () => clearTimeout(id);
  }, [reduced, delay]);
  // The scale overshoots below 1 at the moment of impact, then settles.
  const scale = progress.interpolate({ inputRange: [0, 0.82, 0.92, 1], outputRange: [2.3, 0.94, 1.03, 1] });
  return <Animated.View style={[style, {
    opacity: progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' }),
    transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: [`${tilt - 14}deg`, `${tilt}deg`] }) }, { scale }] }]}>{children}</Animated.View>;
}

// Shakes sideways each time `trigger` increases; a gentle “not quite” that never blocks play.
export function Shake({ children, reduced, trigger, style }: {
  children: ReactNode; reduced: boolean; trigger: number; style?: StyleProp<ViewStyle>;
}) {
  const [x] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced || trigger === 0) return;
    const step = (to: number) => Animated.timing(x, { toValue: to, duration: 55, easing: Easing.linear, useNativeDriver: native });
    return run(Animated.sequence([step(-9), step(9), step(-6), step(6), step(-3), step(0)]));
  }, [x, reduced, trigger]);
  return <Animated.View style={[style, { transform: [{ translateX: x }] }]}>{children}</Animated.View>;
}

// A short pulse each time `trigger` changes, used when a choice is selected.
export function Pulse({ children, reduced, trigger, active = true, style }: {
  children: ReactNode; reduced: boolean; trigger: unknown; active?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduced || !active) return;
    return run(Animated.sequence([
      Animated.timing(scale, { toValue: 1.035, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 160, useNativeDriver: native }),
    ]));
  }, [scale, reduced, trigger, active]);
  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

// A bright band that sweeps once across its parent (the parent must clip with overflow: 'hidden').
export function Shine({ reduced, delay = 0, width = 190, repeat = 1 }: { reduced: boolean; delay?: number; width?: number; repeat?: number }) {
  const [sweep] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) return;
    sweep.setValue(0);
    const pass = () => Animated.sequence([
      Animated.timing(sweep, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
      Animated.delay(700),
      Animated.timing(sweep, { toValue: 0, duration: 0, useNativeDriver: native }),
    ]);
    return run(Animated.sequence([Animated.delay(delay), ...Array.from({ length: repeat }, pass)]));
  }, [sweep, reduced, delay, repeat]);
  if (reduced) return null;
  return <Animated.View aria-hidden pointerEvents="none" style={[s.shine, { width: width * 0.16,
    opacity: sweep.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.3, 0.3, 0] }),
    transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.4, width * 1.1] }) }, { rotate: '18deg' }] }]} />;
}

// A one-off burst of gold flecks around a centre point, for a hint-free solve.
const FLECKS = 16;
export function Sparkles({ reduced, delay = 0, radius = 120, color = '#F2CF7A' }: { reduced: boolean; delay?: number; radius?: number; color?: string }) {
  const flecks = useMemo(() => Array.from({ length: FLECKS }, (_, i) => {
    const angle = (i / FLECKS) * Math.PI * 2 + (i % 2 ? 0.2 : 0);
    const reach = radius * (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.78 : 0.58);
    return { dx: Math.cos(angle) * reach, dy: Math.sin(angle) * reach, size: i % 3 === 0 ? 9 : 6, lag: (i % 4) * 45 };
  }), [radius]);
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) return;
    progress.setValue(0);
    return run(Animated.sequence([Animated.delay(delay),
      Animated.timing(progress, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: native })]));
  }, [progress, reduced, delay]);
  if (reduced) return null;
  return <View aria-hidden pointerEvents="none" style={s.sparkles}>
    {flecks.map((f, i) => {
      const lag = f.lag / 1100;
      return <Animated.View key={i} style={{ position: 'absolute', width: f.size, height: f.size, backgroundColor: color,
        opacity: progress.interpolate({ inputRange: [0, lag, lag + 0.12, 1], outputRange: [0, 0, 1, 0], extrapolate: 'clamp' }),
        transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, f.dx] }) },
          { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, f.dy] }) },
          { rotate: '45deg' }, { scale: progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1.1, 0.2] }) }] }} />;
    })}
  </View>;
}

const s = StyleSheet.create({
  shine: { position: 'absolute', top: -40, bottom: -40, left: 0, backgroundColor: '#FFF4CF' },
  sparkles: { position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
});
