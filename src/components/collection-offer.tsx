import { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { track } from '@/analytics/analytics';
import { CaseEmblem } from './case-emblem';
import { Button, Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title } from './game-ui';
import { getCase } from '@/game/cases';
import { presentationFor } from '@/game/presentation';
import { colors as c, serif } from '@/game/tokens';

import { AFTER_MIDNIGHT, FREE_COLLECTION } from '@/monetization/catalogue';
import { purchaseConfig, safeLink } from '@/monetization/config';
import { Failure, PurchaseState, UnavailableReason } from '@/monetization/purchase-state';
import { usePurchases } from '@/monetization/purchases-provider';

const unavailableCopy: Record<UnavailableReason, string> = {
  web: 'Purchases are made in the TWO SIDES app for iPhone and Android. This web preview cannot sell or verify them, so the collection stays locked here.',
  'expo-go': 'This test client cannot make store purchases. A development or release build of the app is needed.',
  'not-configured': 'The store connection is not set up in this build, so the collection cannot be bought here.',
  'no-offering': 'The store is not offering this collection right now. Please try again later.',
  'store-error': 'The store could not be reached. Check your connection and try again.',
};
const failureCopy: Record<Failure, string> = {
  network: 'The purchase did not go through because the store could not be reached. Check your connection and try again.',
  'not-allowed': 'Purchases are turned off on this device, for example by Screen Time or parental controls.',
  'already-owned': 'The store says this collection is already yours. Tap Restore Purchases to unlock it.',
  store: 'The store could not complete the purchase. Please try again.',
  unknown: 'The purchase could not be completed. Please try again.',
};
function activityCopy(state: PurchaseState): string | null {
  switch (state.activity) {
    case 'cancelled': return 'No purchase was made.';
    case 'pending': return 'Your purchase is waiting for approval, for example through Ask to Buy. The three cases unlock by themselves once the store confirms it.';
    case 'failed': return failureCopy[state.failure ?? 'unknown'];
    case 'unverified': return 'The store reported a purchase, but it could not be verified yet, so the cases stay locked. Try Restore Purchases in a moment.';
    case 'purchased': return 'Thank you. All three After Midnight cases are now unlocked.';
    case 'restored': return 'Your purchase has been restored. The collection is unlocked.';
    case 'nothing-restored': return 'No purchase of this collection was found for the store account on this device.';
    case 'restore-failed': return 'Restore could not reach the store. Please try again later.';
    default: return null;
  }
}

export function CollectionOffer({ source, onClose }: { source: 'library' | 'locked_case' | 'ending' | 'direct'; onClose: () => void }) {
  const { state, access, storeUnavailable, purchase, restore, retryOffer } = usePurchases();
  const verifiedOwner = state.entitlements.includes(AFTER_MIDNIGHT.entitlementId ?? '');
  const busy = state.activity === 'purchasing' || state.activity === 'restoring';
  const message = activityCopy(state);
  const support = safeLink(purchaseConfig.supportUrl);
  const privacy = safeLink(purchaseConfig.privacyUrl);
  useEffect(() => { track({ name: 'collection_offer_viewed', collection_id: AFTER_MIDNIGHT.id, source }); }, [source]);

  const purchaseArea = () => {
    if (verifiedOwner) return <View style={s.owned}><Label>OWNED</Label><Copy>This collection is yours. Start or continue any of its cases from the case list.</Copy>
      <Button onPress={onClose}>Choose a case</Button></View>;
    if (state.offer.status === 'loading') return <View style={s.priceBox}><Copy accessibilityLiveRegion="polite">Checking the store for the price…</Copy></View>;
    if (state.offer.status === 'unavailable') {
      const reason = state.offer.reason;
      return <View style={s.priceBox}><Label>NOT AVAILABLE HERE</Label><Copy accessibilityLiveRegion="polite">{unavailableCopy[reason]}</Copy>
        {(reason === 'store-error' || reason === 'no-offering') && <Button secondary onPress={retryOffer}>Try again</Button>}</View>;
    }
    const { priceString } = state.offer.offer;
    return <View style={s.priceBox}>
      <Text style={s.price}>{priceString}</Text>
      <Copy style={s.small}>One-time purchase for this collection. Price set by your app store, in your local currency.</Copy>
      <Button disabled={busy || state.activity === 'pending'} accessibilityLabel={`Buy the After Midnight Collection for ${priceString}, one time`} onPress={() => { void purchase(); }}>
        {state.activity === 'purchasing' ? 'Waiting for the store…' : state.activity === 'pending' ? 'Waiting for approval…' : 'Buy the collection'}
      </Button>
    </View>;
  };

  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion: true, paperDate: 'NOVEMBER 1994' }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={s.masthead}>
          <Text style={s.wordmark}>TWO <Text style={s.slash}>/</Text> SIDES</Text>
          <TextAction onPress={onClose}>Close</TextAction>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Label>THE BELLWEATHER FILES · AFTER DARK</Label>
          <Title>{AFTER_MIDNIGHT.title}</Title>
          <Text style={s.tagline}>One purchase. Two players. Three new mysteries.</Text>
          <Copy>Three longer cases set in the small hours at the Bellweather Hotel. Each one asks a different kind of question of your evidence: a night rebuilt from half-remembered sounds, a building read as a map, and paper that tells its own age.</Copy>
          {access.devPreview && !verifiedOwner && <View style={s.devNote}><Label>DEVELOPMENT PREVIEW</Label>
            <Copy style={s.small}>These cases are open in this development build without a purchase. Release builds cannot do this.</Copy></View>}

          {AFTER_MIDNIGHT.caseIds.map(id => { const item = getCase(id); return <View key={id} style={s.caseCard}>
            <View style={s.caseEmblem}><CaseEmblem emblem={presentationFor(id).emblem} small /></View>
            <View style={s.caseText}><Label>FILE {item.edition} · {item.rounds.length} DEDUCTIONS</Label>
              <Text accessibilityRole="header" style={s.caseTitle}>{item.title}</Text>
              <Copy style={s.small}>{item.description}</Copy></View>
          </View>; })}

          <View style={s.facts}>
            <Label>WHAT YOU GET</Label>
            {[`The three cases above: ${AFTER_MIDNIGHT.caseIds.map(id => getCase(id).title).join(', ')}.`,
              'For two players sharing one phone. You pass it back and forth to read private evidence.',
              'A one-time purchase. No subscription, no adverts, nothing else to buy inside the cases.',
              'Three hints for every deduction, included.',
              `This purchase covers the After Midnight Collection only. It does not include future releases. The ${FREE_COLLECTION.caseIds.length} Bellweather Files cases stay free.`,
            ].map(line => <View key={line} style={s.fact}><Text aria-hidden style={s.bullet}>◆</Text><Copy style={[s.small, s.factText]}>{line}</Copy></View>)}
          </View>

          {purchaseArea()}
          {message && !verifiedOwner && <View accessibilityLiveRegion="polite" style={state.activity === 'purchased' || state.activity === 'restored' ? s.success : s.notice}><Copy style={s.small}>{message}</Copy></View>}
          {message && verifiedOwner && (state.activity === 'purchased' || state.activity === 'restored') && <View accessibilityLiveRegion="polite" style={s.success}><Copy style={s.small}>{message}</Copy></View>}

          {!verifiedOwner && <Button secondary disabled={storeUnavailable || busy} onPress={() => { void restore(); }}>
            {state.activity === 'restoring' ? 'Restoring…' : 'Restore Purchases'}</Button>}
          {storeUnavailable && !verifiedOwner && <Copy style={[s.small, s.muted]}>Restore Purchases needs the iPhone or Android app, signed in to the store account that bought the collection.</Copy>}

          <View style={s.links}>
            {support ? <TextAction onPress={() => { void Linking.openURL(support); }}>Support</TextAction> : null}
            {privacy ? <TextAction onPress={() => { void Linking.openURL(privacy); }}>Privacy policy</TextAction> : null}
          </View>
          {(!support || !privacy) && <Copy style={[s.small, s.muted]}>Support and privacy links have not been configured in this build.</Copy>}
          <TextAction onPress={onClose}>Back to the cases</TextAction>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy, overflow: 'hidden' },
  safe: { flex: 1 },
  masthead: { paddingHorizontal: 20, minHeight: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderColor: 'rgba(213,177,112,0.2)', backgroundColor: 'rgba(9,18,27,0.65)' },
  wordmark: { color: c.ivory, fontSize: 18, lineHeight: 25, letterSpacing: 3, fontWeight: '600' },
  slash: { color: c.brass, fontWeight: '300' },
  content: { padding: 20, paddingBottom: 40, gap: 18 },
  tagline: { color: c.brass, fontFamily: serif, fontSize: 21, lineHeight: 29, fontStyle: 'italic' },
  devNote: { padding: 12, gap: 6, borderWidth: 1, borderColor: c.burgundy, borderRadius: 6, backgroundColor: c.panel },
  caseCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 7, borderWidth: 1, borderColor: c.walnutLight, backgroundColor: 'rgba(91,58,38,0.32)', alignItems: 'center' },
  caseEmblem: { width: 92 }, caseText: { flex: 1, gap: 6 },
  caseTitle: { color: c.ivory, fontFamily: serif, fontSize: 22, lineHeight: 28 },
  small: { fontSize: 15, lineHeight: 23 },
  muted: { color: c.muted },
  facts: { gap: 10, padding: 16, borderRadius: 6, backgroundColor: 'rgba(23,43,57,0.92)', borderLeftWidth: 2, borderColor: c.brass },
  fact: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { color: c.brass, fontSize: 10, lineHeight: 23 }, factText: { flex: 1 },
  priceBox: { gap: 10, padding: 16, borderRadius: 6, borderWidth: 1, borderColor: c.line, backgroundColor: c.panel },
  price: { color: c.ivory, fontFamily: serif, fontSize: 32, lineHeight: 40 },
  owned: { gap: 10, padding: 16, borderRadius: 6, borderWidth: 1, borderColor: c.brass, backgroundColor: c.panel },
  notice: { padding: 14, borderRadius: 4, borderLeftWidth: 3, borderColor: c.brass, backgroundColor: '#2A3138' },
  success: { padding: 14, borderRadius: 4, borderLeftWidth: 3, borderColor: c.brass, backgroundColor: '#2F3A2E' },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});
