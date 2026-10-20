import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { Copy, Label, ReadingContext } from './game-ui';
import { Entrance, PopIn, Shine, Sparkles, Stamp } from './motion';
import { CaseRating, deductionTitle, hintsText, MAX_STARS, Stars, Tier, tierInfo } from '@/game/rating';
import { colors as c, serif } from '@/game/tokens';
import { useSound } from '@/sound/sound-provider';

const native = Platform.OS !== 'web';
export const tierColor: Record<Tier, string> = { perfect: c.gold, sharp: c.silver, steady: c.bronze, solved: c.slate };
const sealWord: Record<Tier, string> = { perfect: 'PERFECT', sharp: 'SHARP', steady: 'STEADY', solved: 'SOLVED' };

function Star({ filled, size, color, reduced, entrance, delay, onLand }: {
  filled: boolean; size: number; color: string; reduced: boolean; entrance: boolean; delay: number; onLand?: () => void;
}) {
  const glyph = <Text style={[s.glyph, { fontSize: size, lineHeight: size * 1.25, color }]}>★</Text>;
  return <View style={{ width: size * 1.15, height: size * 1.25, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={[s.glyph, { fontSize: size, lineHeight: size * 1.25, color: 'rgba(193,192,184,0.22)' }]}>★</Text>
    <View style={StyleSheet.absoluteFill}>
      {entrance ? (filled && <PopIn reduced={reduced} delay={delay} from={0.1} onLand={onLand} style={s.litCell}>{glyph}</PopIn>)
        : <FadeLit filled={filled} reduced={reduced}>{glyph}</FadeLit>}
    </View>
  </View>;
}

// A lit star that dims with a small shrink when a hint costs it.
function FadeLit({ filled, reduced, children }: { filled: boolean; reduced: boolean; children: ReactNode }) {
  const [level] = useState(() => new Animated.Value(filled ? 1 : 0));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; level.setValue(filled ? 1 : 0); return; }
    if (reduced) { level.setValue(filled ? 1 : 0); return; }
    const animation = filled
      ? Animated.spring(level, { toValue: 1, friction: 5, tension: 140, useNativeDriver: native })
      : Animated.timing(level, { toValue: 0, duration: 320, easing: Easing.in(Easing.cubic), useNativeDriver: native });
    animation.start();
    return () => animation.stop();
  }, [level, filled, reduced]);
  return <Animated.View style={[s.litCell, { opacity: level,
    transform: [{ scale: level.interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) }] }]}>{children}</Animated.View>;
}

// Stars out of `max`. With `entrance` each earned star pops in turn (with a chime); otherwise the
// row simply reflects `stars` and animates when it drops.
export function StarRow({ stars, max = MAX_STARS, size = 20, color = c.gold, entrance = false, delay = 0, chime = false }: {
  stars: number; max?: number; size?: number; color?: string; entrance?: boolean; delay?: number; chime?: boolean;
}) {
  const { reducedMotion } = useContext(ReadingContext);
  const { cue } = useSound();
  return <View aria-hidden style={s.row}>
    {Array.from({ length: max }, (_, i) => <Star key={i} filled={i < stars} size={size} color={color} reduced={reducedMotion}
      entrance={entrance} delay={delay + i * 220} onLand={chime ? () => cue('star') : undefined} />)}
  </View>;
}

// One deduction's result: stars plus plain words, so the rating never depends on the glyphs.
export function DeductionResult({ hints, stars, entrance = false, delay = 0 }: { hints: number; stars: Stars; entrance?: boolean; delay?: number }) {
  return <View style={s.result}>
    <StarRow stars={stars} entrance={entrance} delay={delay} chime={entrance} color={stars === 3 ? c.gold : stars === 0 ? c.slate : stars === 2 ? c.silver : c.bronze} />
    <View style={s.resultText}>
      <Text style={s.resultTitle}>{deductionTitle[stars]} · {stars} of {MAX_STARS} stars</Text>
      <Text style={s.resultSub}>{hintsText(hints)} used</Text>
    </View>
  </View>;
}

// The case-closed seal. It stamps down onto the page; a hint-free solve also gets a halo, a sheen
// and a burst of gold flecks, so a Perfect Deduction feels different from a helped one.
export function CaseSeal({ rating }: { rating: CaseRating }) {
  const { reducedMotion: reduced } = useContext(ReadingContext);
  const { tier } = rating;
  const color = tierColor[tier];
  const perfect = tier === 'perfect';
  const [halo] = useState(() => new Animated.Value(reduced ? 0.4 : 0));
  useEffect(() => {
    if (!perfect || reduced) return;
    halo.setValue(0);
    const animation = Animated.sequence([
      Animated.delay(500),
      Animated.loop(Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
        Animated.timing(halo, { toValue: 0.25, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
      ]), { iterations: 3 }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [halo, perfect, reduced]);
  return <View style={s.sealStage}>
    {perfect && <Animated.View aria-hidden pointerEvents="none" style={[s.halo, { opacity: halo }]} />}
    <Stamp reduced={reduced} delay={250} tilt={-5}>
      <View aria-hidden style={[s.sealOuter, { borderColor: color, backgroundColor: perfect ? 'rgba(242,207,122,0.14)' : 'rgba(9,18,27,0.72)' }]}>
        <View style={[s.sealInner, { borderColor: color }]}>
          <Text style={[s.sealKicker, { color }]}>BELLWEATHER</Text>
          <Text style={[s.sealWord, { color }]}>{sealWord[tier]}</Text>
          <StarRow stars={tierInfo[tier].seal} size={22} color={color} entrance delay={800} chime />
        </View>
        {perfect && <Shine reduced={reduced} delay={950} width={176} repeat={2} />}
      </View>
    </Stamp>
    {perfect && <Sparkles reduced={reduced} delay={640} radius={120} />}
  </View>;
}

// The written result under the seal.
export function CaseResult({ rating }: { rating: CaseRating }) {
  const { reducedMotion: reduced } = useContext(ReadingContext);
  const info = tierInfo[rating.tier];
  return <View style={s.resultBlock}>
    <CaseSeal rating={rating} />
    <Entrance reduced={reduced} delay={900} style={s.resultCopy}>
      <Label>YOUR RATING</Label>
      <Text accessibilityRole="header" style={[s.tierTitle, { color: tierColor[rating.tier] }]}>{info.title}</Text>
      <Copy style={s.center}>{info.blurb}</Copy>
      <Text style={s.score}>Detective score {rating.score} · {rating.stars} of {rating.maxStars} stars · {hintsText(rating.hints)} used</Text>
    </Entrance>
  </View>;
}

const s = StyleSheet.create({
  glyph: { fontFamily: serif, textAlign: 'center', includeFontPadding: false },
  litCell: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  result: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultText: { flex: 1, gap: 1 },
  resultTitle: { color: c.ivory, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  resultSub: { color: c.muted, fontSize: 12, lineHeight: 19 },
  sealStage: { height: 230, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: 'rgba(242,207,122,0.22)' },
  sealOuter: { width: 184, height: 184, borderRadius: 92, borderWidth: 3, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sealInner: { width: 158, height: 158, borderRadius: 79, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  sealKicker: { fontSize: 9, lineHeight: 14, letterSpacing: 2.2, fontWeight: '600' },
  sealWord: { fontFamily: serif, fontSize: 25, lineHeight: 31, letterSpacing: 1.5 },
  resultBlock: { alignItems: 'center', gap: 6, paddingVertical: 4 },
  resultCopy: { alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  tierTitle: { fontFamily: serif, fontSize: 28, lineHeight: 35, textAlign: 'center' },
  center: { textAlign: 'center' },
  score: { color: c.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' },
});
