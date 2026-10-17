import { Platform, StyleSheet, Text, View } from 'react-native';

import { Button, Copy, Label } from './game-ui';
import { colors as c, serif } from '@/game/tokens';
import { SoundPreferences, VOLUME_LEVELS } from '@/sound/preferences';
import { useSound } from '@/sound/sound-provider';

type LevelKey = 'musicLevel' | 'effectsLevel';

function LevelControl({ name, value, enabled, onChange }: { name: string; value: number; enabled: boolean; onChange: (level: number) => void }) {
  return <View style={s.level}>
    <Text style={s.levelText} accessibilityLiveRegion="polite">{`${name} volume · ${value} of ${VOLUME_LEVELS}`}</Text>
    <View style={s.levelButtons}>
      <View style={s.levelButton}><Button secondary sound={null} disabled={!enabled || value <= 0} accessibilityLabel={`Lower ${name.toLowerCase()} volume`}
        onPress={() => onChange(value - 1)}>Quieter</Button></View>
      <View style={s.levelButton}><Button secondary sound={null} disabled={!enabled || value >= VOLUME_LEVELS} accessibilityLabel={`Raise ${name.toLowerCase()} volume`}
        onPress={() => onChange(value + 1)}>Louder</Button></View>
    </View>
  </View>;
}

// Shared by the case settings scene and the app settings route.
export function SoundSettings() {
  const { preferences: p, status, saveError, update, cue } = useSound();
  const toggle = (key: 'music' | 'effects' | 'haptics') => {
    update({ [key]: !p[key] } as Partial<SoundPreferences>);
    cue('select');
  };
  const level = (key: LevelKey) => (value: number) => {
    update({ [key]: value } as Partial<SoundPreferences>);
    // Let the player hear the new effects level straight away.
    cue('select');
  };
  return <View style={s.group}>
    <Label>SOUND & FEEL</Label>
    <Text accessibilityRole="header" style={s.heading}>A quiet night at the Bellweather.</Text>
    <Copy style={s.muted}>An original piano nocturne and soft paper and bell sounds. Every clue is written on screen, so sound is never needed to play. Audio stays quiet when your phone is set to silent.</Copy>
    {status === 'invalid' || status === 'unavailable' ?
      <Copy accessibilityLiveRegion="polite" style={s.muted}>Your saved sound choices could not be read, so music is off for now. Choosing again replaces them.</Copy> : null}
    <Button secondary sound={null} selected={p.music} onPress={() => toggle('music')}>{p.music ? 'Music: On' : 'Music: Off'}</Button>
    <LevelControl name="Music" value={p.musicLevel} enabled={p.music} onChange={level('musicLevel')} />
    <Button secondary sound={null} selected={p.effects} onPress={() => toggle('effects')}>{p.effects ? 'Sound effects: On' : 'Sound effects: Off'}</Button>
    <LevelControl name="Effects" value={p.effectsLevel} enabled={p.effects} onChange={level('effectsLevel')} />
    {/* Browsers have no reliable haptics, so the switch appears on phones only. */}
    {Platform.OS !== 'web' && <Button secondary sound={null} selected={p.haptics} onPress={() => toggle('haptics')}>{p.haptics ? 'Haptics: On' : 'Haptics: Off'}</Button>}
    {saveError && <Copy accessibilityLiveRegion="polite" style={s.muted}>These choices apply now but could not be saved on this device.</Copy>}
  </View>;
}

const s = StyleSheet.create({
  group: { gap: 12, paddingVertical: 4 },
  heading: { color: c.ivory, fontFamily: serif, fontSize: 22, lineHeight: 29 },
  muted: { color: c.muted },
  level: { gap: 8, paddingLeft: 12, borderLeftWidth: 1, borderColor: c.line },
  levelText: { color: c.ivory, fontSize: 15, lineHeight: 23 },
  levelButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  levelButton: { flexGrow: 1, flexBasis: 120 },
});
