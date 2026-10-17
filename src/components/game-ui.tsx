import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AccessibilityInfo, Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, TextProps, View } from 'react-native';

import { Evidence, Role } from '@/game/case';
import { colors as c, mono, serif, space } from '@/game/tokens';
import { Cue, useSound } from '@/sound/sound-provider';

export const ReadingContext = createContext<{ largeText: boolean; compact: boolean; reducedMotion: boolean; paperDate?: string }>(
  { largeText: false, compact: false, reducedMotion: true });
export function Copy({ style, ...props }: TextProps) {
  const { largeText } = useContext(ReadingContext);
  return <Text {...props} style={[ui.copy, largeText && ui.largeCopy, style]} />;
}
export function Label({ children, paper = false }: { children: ReactNode; paper?: boolean }) {
  return <Text style={[ui.label, paper && ui.paperLabel]}>{children}</Text>;
}
export function Title({ children }: { children: ReactNode }) {
  return <Text accessibilityRole="header" style={ui.title}>{children}</Text>;
}
// Every press gives a quiet cue (and haptic, when enabled). Pass sound={null} when the caller
// chooses the cue itself, for example after checking an answer.
export function Button({ children, onPress, secondary, disabled = false, selected = false, accessibilityLabel, sound = 'tap' }: {
  children: string; onPress: () => void; secondary?: boolean; disabled?: boolean; selected?: boolean;
  accessibilityLabel?: string; sound?: Cue | null;
}) {
  const [focused, setFocused] = useState(false);
  const { reducedMotion } = useContext(ReadingContext);
  const { cue } = useSound();
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled, selected }} disabled={disabled}
    onPress={() => { if (sound) cue(sound); onPress(); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [ui.button, secondary && ui.secondary, selected && ui.selected,
      focused && ui.focused, disabled && ui.disabled, pressed && !disabled && ui.pressed,
      pressed && !disabled && !reducedMotion && ui.pressedScale]}>
    <View pointerEvents="none" style={[ui.buttonShine, secondary && ui.secondaryShine]} />
    <Text style={[ui.buttonText, secondary && ui.secondaryText, disabled && ui.disabledText]}>{children}</Text>
  </Pressable>;
}
export function TextAction({ children, onPress, sound = 'tap' }: { children: string; onPress: () => void; sound?: Cue | null }) {
  const [focused, setFocused] = useState(false);
  const { cue } = useSound();
  return <Pressable accessibilityRole="button" onPress={() => { if (sound) cue(sound); onPress(); }}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [ui.textAction, pressed && ui.textActionPressed, focused && ui.focused]}>
    <Text style={ui.textActionText}>{children}</Text>
  </Pressable>;
}

export function HotelBackdrop({ cover }: { cover: boolean }) {
  return <View pointerEvents="none" aria-hidden style={StyleSheet.absoluteFill}>
    <Image source={require('../../assets/art/optimized/hotel-desk-background.jpg')}
      resizeMode="cover" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: cover ? 1 : 0.2 }]} />
    {cover ? <LinearGradient
      colors={['rgba(9,18,27,0.10)', 'rgba(9,18,27,0.18)', 'rgba(9,18,27,0.82)', 'rgba(9,18,27,0.94)']}
      locations={[0, 0.27, 0.55, 1]} style={StyleSheet.absoluteFill} /> :
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(9,18,27,0.68)' }]} />}
  </View>;
}

export function EnvelopeArt() {
  const { compact } = useContext(ReadingContext);
  return <View aria-hidden pointerEvents="none" style={[ui.envelopeStage, compact && ui.compactEnvelope]}>
    <Image source={require('../../assets/art/optimized/case-envelope.png')} resizeMode="contain" style={ui.envelopeImage} />
  </View>;
}

export function RoleGlyph({ role, small = false }: { role: Role; small?: boolean }) {
  return <View aria-hidden style={[ui.roleGlyph, small && ui.smallGlyph]}>
    {role === 'A' ? <View style={ui.speechBubble}><View style={ui.speechTail} />
      <View style={ui.speechLine} /><View style={[ui.speechLine, { width: '50%' }]} />
    </View> : <View style={ui.recordIcon}>{[0, 1, 2].map(i => <View key={i} style={ui.recordLine} />)}</View>}
  </View>;
}

export function ClosedFolder() {
  return <View aria-hidden pointerEvents="none" style={ui.folderStage}>
    <Image source={require('../../assets/art/optimized/handoff-folder.png')}
      resizeMode="contain" style={ui.folderImage} />
  </View>;
}

type DocumentKind = NonNullable<Evidence['kind']>;
const documentNames: Record<DocumentKind, string> = {
  statement: 'WITNESS STATEMENT', maintenance: 'MAINTENANCE NOTE', access: 'ACCESS REGISTER',
  storage: 'STORAGE-KEY RECORD', letter: 'HOTEL CORRESPONDENCE',
  log: 'NIGHT LOG', plan: 'FLOOR PLAN', archive: 'ARCHIVE RECORD',
};
export function Paper({ children, kind = 'letter', reference = 'BELLWEATHER / 01' }: {
  children: ReactNode; kind?: DocumentKind; reference?: string;
}) {
  const { paperDate = 'OCTOBER 1994' } = useContext(ReadingContext);
  return <View style={ui.paperStack}>
    <View pointerEvents="none" aria-hidden style={ui.paperBacking} />
    <View style={[ui.paper, kind === 'statement' && ui.statementPaper]}>
      <View pointerEvents="none" aria-hidden style={ui.paperTexture}>
        <Image source={require('../../assets/art/optimized/evidence-paper.jpg')}
          resizeMode="cover" style={[StyleSheet.absoluteFill, ui.paperTextureImage]} />
      </View>
      <View style={ui.paperTop}><View style={ui.hotelRule} /><Text style={ui.hotelName}>Bellweather Hotel</Text>
        <Text style={ui.hotelDate}>PRIVATE ARCHIVE · {paperDate}</Text></View>
      <View style={ui.documentMeta}><Label paper>{documentNames[kind]}</Label><Text style={ui.reference}>{reference}</Text></View>
      {children}
      <View style={ui.paperFooter}><View style={ui.footerRule} /><Text style={ui.filed}>FILED IN CONFIDENCE</Text><View style={ui.footerRule} /></View>
    </View>
  </View>;
}

export function EvidenceDocument({ evidence, role, round }: { evidence: Evidence; role: Role; round: number }) {
  const kind: DocumentKind = evidence.kind ?? (role === 'A' ? 'statement' : (['maintenance', 'access', 'storage'] as const)[round % 3]);
  return <Paper kind={kind} reference={`REF. ${evidence.id}`}>
    <Text accessibilityRole="header" style={ui.documentTitle}>{evidence.title}</Text>
    <Text style={ui.source}>{evidence.source}</Text>
    {evidence.paragraphs.map((paragraph, i) => <Copy key={i} style={ui.ink}>{paragraph}</Copy>)}
  </Paper>;
}

// Conservative default avoids motion until the operating system preference is known.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    let changed = false;
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      changed = true;
      if (mounted) setReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted && !changed) setReduced(value);
    }).catch(() => {});
    return () => { mounted = false; listener.remove(); };
  }, []);
  return reduced;
}

export function SceneReveal({ children, reduced, enabled }: { children: ReactNode; reduced: boolean; enabled: boolean }) {
  const [entry] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (reduced || !enabled) { entry.setValue(1); return; }
    entry.setValue(0);
    const reveal = Animated.timing(entry, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' });
    reveal.start();
    return () => reveal.stop();
  }, [entry, reduced, enabled]);
  return <Animated.View style={{ opacity: entry, transform: [{ translateY: entry.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }}>{children}</Animated.View>;
}

export const ui = StyleSheet.create({
  copy: { color: c.ivory, fontSize: 17, lineHeight: 27, flexShrink: 1 },
  largeCopy: { fontSize: 21, lineHeight: 33 },
  label: { color: c.brass, fontSize: 11, lineHeight: 17, letterSpacing: 1.3, fontWeight: '600' },
  paperLabel: { color: c.burgundy, letterSpacing: 0.8 },
  title: { fontFamily: serif, fontSize: 32, lineHeight: 39, color: c.ivory },
  button: { minHeight: 54, borderRadius: 6, paddingHorizontal: space.xl, paddingVertical: 14,
    borderWidth: 1, borderColor: '#F1D8A6', borderBottomColor: '#96703E', backgroundColor: c.brass,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.24)' },
  buttonShine: { position: 'absolute', top: 1, left: 4, right: 4, height: 1, backgroundColor: '#F5DEB2' },
  secondaryShine: { backgroundColor: 'rgba(224,194,141,0.14)' },
  buttonText: { color: c.deep, fontSize: 16, lineHeight: 24, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  secondary: { backgroundColor: '#152631', borderColor: '#6A6250', borderBottomColor: '#252D31' },
  secondaryText: { color: c.ivory },
  selected: { borderColor: c.brass, backgroundColor: '#30414A', boxShadow: '0 0 0 1px #D5B170' },
  focused: { outlineColor: c.ivory, outlineWidth: 2, outlineOffset: 3, borderColor: c.ivory },
  disabled: { backgroundColor: '#3B4141', borderColor: '#64706E', boxShadow: 'none' },
  disabledText: { color: '#BBC0B9' },
  pressed: { opacity: 0.84, boxShadow: 'none' },
  pressedScale: { transform: [{ scale: 0.98 }] },
  textAction: { minHeight: 48, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: 'transparent', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  textActionText: { color: c.ivory, fontSize: 14, lineHeight: 22, textAlign: 'center' },
  textActionPressed: { backgroundColor: 'rgba(213,177,112,0.16)' },
  envelopeStage: { height: 244, width: '100%', alignItems: 'center', justifyContent: 'center' },
  compactEnvelope: { height: 190 },
  envelopeImage: { width: '100%', height: '100%' },
  roleGlyph: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  smallGlyph: { width: 40, height: 40 },
  speechBubble: { width: 28, height: 21, borderRadius: 5, borderWidth: 1.5, borderColor: c.brass, padding: 5, gap: 4 },
  speechTail: { position: 'absolute', bottom: -5, left: 5, width: 7, height: 7, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: c.brass, backgroundColor: c.navy, transform: [{ skewY: '-30deg' }] },
  speechLine: { height: 1, backgroundColor: c.brass, width: '100%' },
  recordIcon: { width: 23, height: 29, borderWidth: 1.5, borderColor: c.brass, paddingHorizontal: 4, paddingTop: 7, gap: 5 },
  recordLine: { height: 1, backgroundColor: c.brass },
  folderStage: { width: 210, height: 174, alignSelf: 'center', marginVertical: 4 },
  folderImage: { width: '100%', height: '100%' },
  paperStack: { marginHorizontal: 2, marginVertical: 5 },
  paperBacking: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#BEAB84', borderWidth: 1, borderColor: '#705F45', transform: [{ rotate: '0.7deg' }, { translateY: 4 }] },
  paper: { backgroundColor: c.ivory, borderRadius: 2, borderWidth: 1, borderColor: '#D6BE91', padding: space.xl,
    gap: 18, overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' },
  statementPaper: { backgroundColor: '#F3EAD8' },
  paperTexture: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' },
  paperTextureImage: { width: '100%', height: '100%', opacity: 0.32 },
  paperTop: { alignItems: 'center', gap: 5, paddingBottom: 14, borderBottomWidth: 1, borderColor: c.paperLine },
  hotelRule: { width: 28, height: 2, backgroundColor: c.burgundy, marginBottom: 3 },
  hotelName: { fontFamily: serif, color: c.ink, fontSize: 20, lineHeight: 27 },
  hotelDate: { fontSize: 9, lineHeight: 15, letterSpacing: 1, color: '#6D5D44', textAlign: 'center' },
  documentMeta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  reference: { fontFamily: mono, color: '#66523C', fontSize: 11, lineHeight: 17 },
  documentTitle: { color: c.ink, fontFamily: serif, fontSize: 27, lineHeight: 33 },
  source: { color: '#675743', fontSize: 13, lineHeight: 20, marginTop: -8 },
  ink: { color: c.ink },
  paperFooter: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 6 },
  footerRule: { height: 1, flex: 1, backgroundColor: c.paperLine },
  filed: { color: '#715B3C', fontSize: 9, lineHeight: 15, letterSpacing: 0.8 },
});
