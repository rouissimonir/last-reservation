import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title } from '@/components/game-ui';
import { SoundSettings } from '@/components/sound-settings';
import { colors as c } from '@/game/tokens';

// App-wide preferences. Reading size stays per case, in each case's own Settings.
export default function SettingsScreen() {
  const close = () => router.dismissTo('/');
  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion: true }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Label>TWO / SIDES</Label><TextAction onPress={close}>Back to cases</TextAction></View>
        <ScrollView contentContainerStyle={s.content}>
          <Title>Settings</Title>
          <SoundSettings />
          <View style={s.section}><Label>READING</Label>
            <Copy>Your device’s text size is always followed. Each case also offers larger body text in its own Settings.</Copy>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, minHeight: 56, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderColor: 'rgba(213,177,112,0.2)', backgroundColor: 'rgba(9,18,27,0.65)' },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  section: { gap: 8, paddingTop: 10, borderTopWidth: 1, borderColor: c.line },
});
