import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Copy, Label } from '@/components/game-ui';
import notices from '@/legal/third-party-notices.json';

/** Bundled text stays available offline. Render only the notice the reader opens. */
export function ThirdPartyNotices() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  return <View style={s.section}>
    <Button secondary expanded={open} onPress={() => { setOpen(!open); setSelected(null); }}>
      {open ? 'Close open-source licenses' : 'Open-source licenses'}
    </Button>
    {open && <View style={s.section}>
      <Copy>This game includes open-source software and fonts. Select a library to read its acknowledgments and license. These texts are included in the app and are available offline.</Copy>
      {notices.map(notice => {
        const expanded = selected === notice.id;
        const names = notice.credits.map(credit => `${credit.name} ${credit.version}`).join('\n');
        const label = `${notice.credits[0].name}${notice.credits.length > 1 ? ` + ${notice.credits.length - 1} more` : ''}`;
        return <View key={notice.id} style={s.section}>
          <Button secondary expanded={expanded} onPress={() => setSelected(expanded ? null : notice.id)}
            accessibilityLabel={`${expanded ? 'Hide' : 'Read'} license for ${label}`}>{label}</Button>
          {expanded && <View style={s.section}>
            <Label>ACKNOWLEDGMENTS</Label>
            <Copy selectable style={s.credit}>{names}</Copy>
            <Copy selectable style={s.license}>{notice.text}</Copy>
          </View>}
        </View>;
      })}
    </View>}
  </View>;
}

const s = StyleSheet.create({
  section: { gap: 14 },
  credit: { fontSize: 14, lineHeight: 22 },
  license: { fontSize: 14, lineHeight: 22 },
});
