import { useState } from 'react';
import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title } from '@/components/game-ui';
import { colors as c } from '@/game/tokens';
import { purchaseConfig, safeLink } from '@/monetization/config';
import { ThirdPartyNotices } from '@/components/third-party-notices';

export default function HelpScreen() {
  const [linkError, setLinkError] = useState(false);
  const support = safeLink(purchaseConfig.supportUrl);
  const privacy = safeLink(purchaseConfig.privacyUrl);
  const open = async (url: string) => {
    setLinkError(false);
    try { await Linking.openURL(url); } catch { setLinkError(true); }
  };
  const close = () => router.dismissTo('/');
  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion: true }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe}>
        <View style={s.header}><Label>TWO / SIDES</Label><TextAction onPress={close}>Back to cases</TextAction></View>
        <ScrollView contentContainerStyle={s.content}>
          <Title>A little help, in confidence.</Title>
          <View style={s.section}><Label>HOW TO PLAY</Label>
            <Copy>Choose a case together, then decide who reads Witness accounts and who reads Hotel records. Pass the phone when asked. Only the named investigator should read each private sheet.</Copy>
            <Copy>Explain what you learned in your own words. Compare both sides before choosing a deduction. Wrong answers let you try again and never cost anything. Hints are optional and included, but each deduction earns up to three stars: each hint you reveal takes one away, and a hint-free case earns the top Perfect Deduction rating.</Copy>
            <Copy>Hide the evidence before passing the phone. The Notebook holds confirmed deductions and lets you revisit a sheet through its private handoff.</Copy>
          </View>
          <View style={s.section}><Label>READING & PROGRESS</Label>
            <Copy>Play at your own pace. There are no timers, and sound is optional: music, effects and haptics can be changed in Sound & settings. Your device’s text size is supported. Each case also has a Larger body text option in Settings.</Copy>
            <Copy>Progress and reading settings are saved locally. You can leave a case and continue later. The game does not sync saves between devices. Reset this case in its Settings to remove its progress; other cases and purchases are preserved.</Copy>
            <Copy>Hiding a sheet helps keep the two roles separate. It does not prevent screenshots or someone looking over your shoulder.</Copy>
          </View>
          <View style={s.section}><Label>PURCHASES</Label>
            <Copy>The five Bellweather Files cases are free. The After Midnight Collection is a separate one-time purchase for three cases, with hints included. It is not a subscription.</Copy>
            <Copy>To recover a purchase, open the collection and choose Restore Purchases using the same app-store account. Resetting a case does not remove ownership.</Copy>
            <Button secondary onPress={() => router.push('/after-midnight')}>Collection & Restore Purchases</Button>
          </View>
          <View style={s.section}><Label>PRIVACY & SUPPORT</Label>
            <Copy>Case progress is saved locally. The game has no account, advertising or remote gameplay analytics.</Copy>
            <Copy>In the installed app, RevenueCat and your app store verify purchases using purchase history and an app-generated identifier. The purchase service may connect when the app starts. Your case progress is not sent to these services.</Copy>
            <Copy>Read the privacy policy for purchase-data handling and contact details. If you need help, include the case title and what happened, and avoid sending payment details or private evidence unless needed.</Copy>
            {privacy && <Button secondary onPress={() => { void open(privacy); }}>Privacy policy</Button>}
            {support && <Button secondary onPress={() => { void open(support); }}>Contact support</Button>}
            {(!privacy || !support) && <Copy>Public support and privacy links are awaiting publisher configuration. This build is not ready for store submission.</Copy>}
            {linkError && <Copy accessibilityLiveRegion="polite">The page could not be opened. Check your connection and try again.</Copy>}
          </View>
          <View style={s.section}><Label>ACKNOWLEDGMENTS</Label><ThirdPartyNotices /></View>
          <Text style={s.footer}>TWO SIDES · The Bellweather Files</Text>
          <Button onPress={close}>Back to the cases</Button>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy },
  safe: { flex: 1 },
  header: { minHeight: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: c.line },
  content: { padding: 20, paddingBottom: 40, gap: 26 },
  section: { gap: 14, borderTopWidth: 1, borderColor: c.line, paddingTop: 20 },
  footer: { color: c.muted, textAlign: 'center', fontSize: 12, lineHeight: 20 },
});
