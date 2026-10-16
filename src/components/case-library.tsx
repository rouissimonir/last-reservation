import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaseEmblem } from './case-emblem';
import { Button, Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title } from './game-ui';
import { CaseDefinition, getCase } from '@/game/cases';
import { presentationFor } from '@/game/presentation';
import { colors as c, serif } from '@/game/tokens';
import { useInvestigation } from '@/game/use-investigation';
import { ownsCollection } from '@/monetization/access';
import { AFTER_MIDNIGHT, FREE_COLLECTION, RECOMMENDED_FIRST_CASE } from '@/monetization/catalogue';
import { usePurchases } from '@/monetization/purchases-provider';

export type OfferSource = 'library' | 'locked_case' | 'ending';
type Open = (id: string, replay?: boolean) => void;

function CaseCard({ item, locked, onOpen, onOffer }: { item: CaseDefinition; locked: boolean; onOpen: Open; onOffer: (source: OfferSource) => void }) {
  const game = useInvestigation(item.id);
  const p = game.progress;
  const ready = game.status === 'ready';
  const finished = p.round === item.rounds.length;
  const recommended = item.id === RECOMMENDED_FIRST_CASE && ready && !p.started;
  const progress = ready ? !p.started ? 'Not started' :
    `${finished ? 'Resolved' : 'In progress'} · ${p.confirmed.length} of ${item.rounds.length} deductions` :
    game.status === 'loading' ? 'Checking saved progress…' : 'Saved progress needs attention';
  return <View style={[s.card, locked && s.lockedCard]}>
    <View style={s.cardTop}>
      <View style={s.cardText}>
        <Label>FILE {item.edition} · {item.format.toUpperCase()}</Label>
        {recommended && <Text style={s.recommended}>Recommended first case</Text>}
        <Text accessibilityRole="header" style={s.caseTitle}>{item.title}</Text>
      </View>
      <View style={s.cardEmblem}><CaseEmblem emblem={presentationFor(item.id).emblem} small /></View>
    </View>
    <Copy style={s.description}>{item.description}</Copy>
    <Text style={s.duration}>{item.duration}</Text>
    {locked ? <>
      <Text style={s.status}>Part of the After Midnight Collection{ready && p.started ? ' · your saved progress is kept' : ''}</Text>
      <Button secondary accessibilityLabel={`See the After Midnight Collection, which includes ${item.title}`} onPress={() => onOffer('locked_case')}>See the collection</Button>
    </> : <>
      <Text accessibilityLiveRegion="polite" style={s.status}>{progress}</Text>
      <Button accessibilityLabel={`Open ${item.title}`} disabled={game.status === 'loading'} onPress={() => onOpen(item.id)}>
        {!ready ? 'Review saved progress' : p.started ? 'Continue investigation' : 'Open the case'}
      </Button>
      {ready && p.started && <TextAction onPress={() => onOpen(item.id, true)}>Replay this case…</TextAction>}
    </>}
  </View>;
}

function FirstCaseNote({ onOpen }: { onOpen: Open }) {
  const game = useInvestigation(RECOMMENDED_FIRST_CASE);
  if (game.status !== 'ready' || game.progress.started) return null;
  return <View style={s.note}>
    <Label>NEW TO TWO SIDES?</Label>
    <Copy style={s.description}>Start with {getCase(RECOMMENDED_FIRST_CASE).title}. It is short and shows how the two roles work together.</Copy>
    <Button onPress={() => onOpen(RECOMMENDED_FIRST_CASE)}>{`Start ${getCase(RECOMMENDED_FIRST_CASE).title}`}</Button>
  </View>;
}

export function CaseLibrary({ onOpen, onOffer }: { onOpen: Open; onOffer: (source: OfferSource) => void }) {
  const { state, access } = usePurchases();
  const owned = ownsCollection(access, AFTER_MIDNIGHT);
  const price = state.offer.status === 'ready' ? state.offer.offer.priceString : null;
  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion: true }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content}>
          <Label>TWO / SIDES · BELLWEATHER HOTEL</Label>
          <Title>Choose your case.</Title>
          <Copy>Two people. One phone. Compare your evidence and solve it together.</Copy>
          <FirstCaseNote onOpen={onOpen} />
          {access.devPreview && <View style={s.devNote}><Label>DEVELOPMENT PREVIEW</Label>
            <Copy style={s.description}>After Midnight cases are open without a purchase because this development build was started with the preview flag. Release builds ignore it.</Copy></View>}

          <View style={s.section}><Label>{FREE_COLLECTION.title.toUpperCase()} · FREE</Label>
            <Text accessibilityRole="header" style={s.sectionTitle}>Five complete mysteries, free to play.</Text></View>
          {FREE_COLLECTION.caseIds.map(id => <CaseCard key={id} item={getCase(id)} locked={false} onOpen={onOpen} onOffer={onOffer} />)}

          <View style={[s.section, s.paidSection]}>
            <Label>{AFTER_MIDNIGHT.title.toUpperCase()} · {owned ? (access.devPreview && !state.entitlements.includes(AFTER_MIDNIGHT.entitlementId ?? '') ? 'PREVIEW' : 'OWNED') : 'ONE-TIME PURCHASE'}</Label>
            <Text accessibilityRole="header" style={s.sectionTitle}>One purchase. Two players. Three new mysteries.</Text>
            <Copy style={s.description}>{owned ? 'Your three After Midnight cases are open below.' :
              `Three longer cases set in the small hours. ${price ? `${price}, paid once.` : 'Paid once, at the price your app store shows.'} Hints included.`}</Copy>
            <Button secondary onPress={() => onOffer('library')}>{owned ? 'About this collection' : 'See the collection'}</Button>
          </View>
          {AFTER_MIDNIGHT.caseIds.map(id => <CaseCard key={id} item={getCase(id)} locked={!owned} onOpen={onOpen} onOffer={onOffer} />)}
          <Text style={s.duration}>Play without sound. Case lengths have not yet been measured with real players.</Text>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy },
  safe: { flex: 1 }, content: { padding: 20, paddingBottom: 40, gap: 20 },
  note: { padding: 16, gap: 10, borderWidth: 1, borderColor: c.brass, borderRadius: 6, backgroundColor: 'rgba(23,43,57,0.94)' },
  devNote: { padding: 12, gap: 6, borderWidth: 1, borderColor: c.burgundy, borderRadius: 6, backgroundColor: c.panel },
  section: { gap: 8, paddingTop: 10, borderTopWidth: 1, borderColor: c.line },
  paidSection: { padding: 18, borderWidth: 1, borderColor: c.brass, borderRadius: 7, backgroundColor: 'rgba(91,58,38,0.35)', gap: 12 },
  sectionTitle: { color: c.ivory, fontFamily: serif, fontSize: 23, lineHeight: 30 },
  description: { fontSize: 15, lineHeight: 23 },
  card: { padding: 20, gap: 14, borderRadius: 7, borderWidth: 1, borderColor: '#79694D', backgroundColor: 'rgba(16,29,41,0.94)' },
  lockedCard: { borderColor: c.walnutLight, backgroundColor: 'rgba(24,26,30,0.94)' },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  cardText: { flex: 1, gap: 6 },
  cardEmblem: { width: 96 },
  recommended: { alignSelf: 'flex-start', color: c.deep, backgroundColor: c.brass, fontSize: 12, lineHeight: 18, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 },
  caseTitle: { color: c.ivory, fontFamily: serif, fontSize: 27, lineHeight: 34 },
  duration: { color: c.muted, fontSize: 13, lineHeight: 21 },
  status: { color: c.brass, fontSize: 14, lineHeight: 22 },
});
