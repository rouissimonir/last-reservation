import { ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { EnvelopeArt, ReadingContext } from './game-ui';
import { Emblem } from '@/game/presentation';
import { colors as c } from '@/game/tokens';

// Temporary cover objects drawn with native views (no generated artwork was available). They carry
// no text and no clue, and are decorative only. Final illustrations are listed in AFTER_MIDNIGHT_COLLECTION.md.
export function CaseEmblem({ emblem, small = false }: { emblem: Emblem; small?: boolean }) {
  const { compact } = useContext(ReadingContext);
  if (emblem === 'envelope' && !small) return <EnvelopeArt />;
  const scale = small ? 0.42 : compact ? 0.8 : 1;
  return <View aria-hidden pointerEvents="none" style={[e.stage, { height: 220 * scale }]}>
    <View style={{ width: 220, height: 220, transform: [{ scale }] }}>
      <View style={e.glow} />
      {drawings[emblem]()}
    </View>
  </View>;
}

const drawings: Record<Emblem, () => ReactElement> = {
  envelope: () => <View style={e.center}><View style={e.envelope}><View style={e.envelopeFlap} /><View style={e.seal} /></View></View>,
  piano: () => <View style={e.center}>
    <View style={e.pianoLid} />
    <View style={e.pianoBody}>{Array.from({ length: 9 }, (_, i) => <View key={i} style={e.pianoKey} />)}</View>
    <View style={e.pianoLegs}><View style={e.leg} /><View style={e.leg} /></View>
  </View>,
  mask: () => <View style={e.center}>
    <View style={e.feather} /><View style={[e.feather, e.featherTwo]} />
    <View style={e.mask}><View style={e.eye} /><View style={e.eye} /></View>
    <View style={e.maskStick} />
  </View>,
  'music-box': () => <View style={e.center}>
    <View style={e.boxLid} />
    <View style={e.box}><View style={e.ribbonV} /><View style={e.ribbonH} /></View>
    <View style={e.boxKey} />
  </View>,
  key: () => <View style={e.center}>
    <View style={e.keyRow}>
      <View style={e.keyBow} />
      <View style={e.keyShaft}><View style={e.keyTooth} /><View style={[e.keyTooth, { height: 18 }]} /></View>
    </View>
    <View style={e.keyCord} />
    <View style={e.keyTag}><View style={e.keyTagHole} /></View>
  </View>,
  telephone: () => <View style={e.center}>
    <View style={e.handset}><View style={e.earpiece} /><View style={e.earpiece} /></View>
    <View style={e.phoneBase}><View style={e.dial}>{Array.from({ length: 8 }, (_, i) =>
      <View key={i} style={[e.dialHole, { transform: [{ rotate: `${i * 36 - 20}deg` }, { translateY: -22 }] }]} />)}</View></View>
    <View style={e.cord} />
  </View>,
  frame: () => <View style={e.center}>
    <View style={e.wallLeft} /><View style={e.wallRight} />
    <View style={e.frame}><View style={e.canvas}><View style={e.sitterHead} /><View style={e.sitterBody} /></View></View>
  </View>,
};

const brass = c.brass, deep = c.deep, ivory = c.ivory, walnut = c.walnut;
const e = StyleSheet.create({
  stage: { width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  glow: { position: 'absolute', left: 30, top: 30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(213,177,112,0.12)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  envelope: { width: 150, height: 96, backgroundColor: c.paper, borderRadius: 4, alignItems: 'center', overflow: 'hidden' },
  envelopeFlap: { width: 110, height: 110, backgroundColor: '#D9C59E', transform: [{ rotate: '45deg' }], marginTop: -62 },
  seal: { position: 'absolute', top: 38, width: 22, height: 22, borderRadius: 11, backgroundColor: c.burgundy },
  pianoLid: { width: 150, height: 14, backgroundColor: deep, borderWidth: 2, borderColor: brass, transform: [{ rotate: '-14deg' }, { translateX: 18 }], marginBottom: 6 },
  pianoBody: { width: 160, height: 60, backgroundColor: '#11161B', borderWidth: 2, borderColor: brass, borderRadius: 4, flexDirection: 'row', alignItems: 'flex-end', padding: 6, gap: 3 },
  pianoKey: { flex: 1, height: 24, backgroundColor: ivory, borderRadius: 1 },
  pianoLegs: { width: 130, flexDirection: 'row', justifyContent: 'space-between' },
  leg: { width: 8, height: 34, backgroundColor: brass },
  feather: { position: 'absolute', top: 34, left: 120, width: 16, height: 70, borderRadius: 8, backgroundColor: c.burgundy, transform: [{ rotate: '28deg' }] },
  featherTwo: { left: 134, top: 44, backgroundColor: brass, transform: [{ rotate: '44deg' }] },
  mask: { width: 150, height: 62, borderRadius: 31, backgroundColor: deep, borderWidth: 3, borderColor: brass, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
  eye: { width: 38, height: 20, borderRadius: 10, backgroundColor: c.navy, borderWidth: 2, borderColor: ivory },
  maskStick: { width: 6, height: 70, backgroundColor: walnut, transform: [{ rotate: '18deg' }, { translateX: 52 }], marginTop: -6 },
  boxLid: { width: 140, height: 22, backgroundColor: c.walnutLight, borderWidth: 2, borderColor: brass, borderTopLeftRadius: 6, borderTopRightRadius: 6, transform: [{ rotate: '-12deg' }, { translateY: -4 }] },
  box: { width: 140, height: 76, backgroundColor: walnut, borderWidth: 2, borderColor: brass, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  ribbonV: { position: 'absolute', width: 12, top: 0, bottom: 0, backgroundColor: c.burgundy },
  ribbonH: { position: 'absolute', height: 12, left: 0, right: 0, backgroundColor: c.burgundy },
  boxKey: { width: 26, height: 10, backgroundColor: brass, borderRadius: 3, marginTop: -44, marginLeft: 176 },
  keyRow: { flexDirection: 'row', alignItems: 'center' },
  keyBow: { width: 54, height: 54, borderRadius: 27, borderWidth: 9, borderColor: brass },
  keyShaft: { width: 96, height: 12, backgroundColor: brass, flexDirection: 'row', justifyContent: 'flex-end', gap: 6, paddingRight: 6 },
  keyTooth: { width: 10, height: 24, backgroundColor: brass, marginTop: 10 },
  keyCord: { width: 2, height: 30, backgroundColor: c.paperLine, marginLeft: -120 },
  keyTag: { width: 74, height: 40, borderRadius: 6, backgroundColor: ivory, borderWidth: 2, borderColor: c.paperLine, marginLeft: -120, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8 },
  keyTagHole: { width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: walnut },
  handset: { width: 160, height: 26, borderRadius: 13, backgroundColor: deep, borderWidth: 2, borderColor: brass, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, alignItems: 'center', marginBottom: -4, zIndex: 1 },
  earpiece: { width: 36, height: 16, borderRadius: 8, backgroundColor: c.navy, borderWidth: 1, borderColor: brass },
  phoneBase: { width: 130, height: 86, backgroundColor: walnut, borderWidth: 2, borderColor: brass, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dial: { width: 62, height: 62, borderRadius: 31, backgroundColor: ivory, alignItems: 'center', justifyContent: 'center' },
  dialHole: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: deep },
  cord: { width: 70, height: 3, backgroundColor: brass, marginTop: 6, marginLeft: 100, transform: [{ rotate: '24deg' }] },
  wallLeft: { position: 'absolute', left: 6, top: 20, width: 52, height: 180, backgroundColor: '#3F3326', transform: [{ rotate: '-4deg' }] },
  wallRight: { position: 'absolute', right: 6, top: 20, width: 52, height: 180, backgroundColor: '#3F3326', transform: [{ rotate: '4deg' }] },
  frame: { width: 120, height: 156, borderWidth: 10, borderColor: brass, backgroundColor: deep, padding: 6 },
  canvas: { flex: 1, backgroundColor: '#29443A', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  sitterHead: { width: 30, height: 36, borderRadius: 16, backgroundColor: 'rgba(241,230,207,0.55)', marginBottom: 2 },
  sitterBody: { width: 70, height: 44, borderTopLeftRadius: 35, borderTopRightRadius: 35, backgroundColor: 'rgba(31,84,58,0.95)' },
});
