import { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CaseEmblem } from './case-emblem';
import { Button, Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title, useReducedMotion } from './game-ui';
import { Entrance } from './motion';
import { StarRow, tierColor } from './rating';
import { CaseDefinition, getCase } from '@/game/cases';
import { presentationFor } from '@/game/presentation';
import { caseRating, hintsText, tierInfo } from '@/game/rating';
import { recordTier } from '@/game/records';
import { colors as c, serif } from '@/game/tokens';
import { useInvestigation } from '@/game/use-investigation';
import { ownsCollection } from '@/monetization/access';
import { AFTER_MIDNIGHT, FREE_COLLECTION, RECOMMENDED_FIRST_CASE } from '@/monetization/catalogue';
import { usePurchases } from '@/monetization/purchases-provider';

export type OfferSource = 'library' | 'locked_case';
type Open = (id: string, replay?: boolean) => void;

function CaseCard({ item, locked, index, onOpen, onOffer, onSolved }: { item: CaseDefinition; locked: boolean; index: number; onOpen: Open; onOffer: (source: OfferSource) => void; onSolved?: (id: string, solved: boolean) => void }) {
  const game = useInvestigation(item.id);
  const { reducedMotion } = useContext(ReadingContext);
  const p = game.progress;
  const ready = game.status === 'ready';
  const finished = p.round === item.rounds.length;
  const recommended = item.id === RECOMMENDED_FIRST_CASE && ready && !p.started;
  const progress = ready ? !p.started ? 'Not started' :
    `${finished ? 'Resolved' : 'In progress'} · ${p.confirmed.length} of ${item.rounds.length} deductions` :
    game.status === 'loading' ? 'Checking saved progress…' : 'Saved progress needs attention';
  const rating = ready && finished ? caseRating(p) : null;
  const solved = ready && finished;
  useEffect(() => { onSolved?.(item.id, solved); }, [onSolved, item.id, solved]);
  // The personal best survives replays; saves solved before records existed still show their rating.
  const best = game.record ? { tier: recordTier(game.record), text: `Best: ${tierInfo[recordTier(game.record)].title} · score ${game.record.bestScore} · ${hintsText(game.record.bestHints)} · solved ${game.record.solves === 1 ? 'once' : `${game.record.solves} times`}` } :
    rating ? { tier: rating.tier, text: `${tierInfo[rating.tier].title} · score ${rating.score} · ${hintsText(rating.hints)}` } : null;
  return <Entrance reduced={reducedMotion} delay={Math.min(index, 6) * 90 + 150}><View style={[s.card, locked && s.lockedCard]}>
    <View style={s.cardTop}>
      <View style={s.cardText}>
        <Label>FILE {item.edition} · {item.format.toUpperCase()}</Label>
        {recommended && <Text style={s.recommended}>Recommended first case</Text>}
        <Text accessibilityRole="header" style={s.caseTitle}>{item.title}</Text>
      </View>
      <View style={s.cardEmblem}><CaseEmblem emblem={presentationFor(item.id).emblem} small /></View>
    </View>
    <Copy style={s.description}>{item.description}</Copy>
    <Text style={s.duration}>{item.rounds.length} deductions · No time limit</Text>
    {locked ? <>
      <Text style={s.status}>Part of the After Midnight Collection{ready && p.started ? ' · your saved progress is kept' : ''}</Text>
      <Button secondary accessibilityLabel={`See the After Midnight Collection, which includes ${item.title}`} onPress={() => onOffer('locked_case')}>See the collection</Button>
    </> : <>
      <Text accessibilityLiveRegion="polite" style={s.status}>{progress}</Text>
      {best && <View style={s.rating}>
        <StarRow stars={tierInfo[best.tier].seal} size={16} color={tierColor[best.tier]} />
        <Text style={[s.ratingText, { color: tierColor[best.tier] }]}>{best.text}</Text>
      </View>}
      <Button accessibilityLabel={`Open ${item.title}`} disabled={game.status === 'loading'} onPress={() => onOpen(item.id)}>
        {!ready ? 'Review saved progress' : p.started ? 'Continue investigation' : 'Open the case'}
      </Button>
      {ready && p.started && <TextAction onPress={() => onOpen(item.id, true)}>Replay this case…</TextAction>}
    </>}
  </View></Entrance>;
}

export function CaseLibrary({ onOpen, onOffer }: { onOpen: Open; onOffer: (source: OfferSource) => void }) {
  const { state, access } = usePurchases();
  const owned = ownsCollection(access, AFTER_MIDNIGHT);
  const reducedMotion = useReducedMotion();
  const [solvedIds, setSolvedIds] = useState<ReadonlySet<string>>(new Set());
  const markSolved = useCallback((id: string, solved: boolean) => setSolvedIds(prev => {
    if (prev.has(id) === solved) return prev;
    const next = new Set(prev);
    if (solved) next.add(id); else next.delete(id);
    return next;
  }), []);
  const freeSolved = FREE_COLLECTION.caseIds.filter(id => solvedIds.has(id)).length;
  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content}>
          <Label>TWO / SIDES · BELLWEATHER HOTEL</Label>
          <Title>Choose your case.</Title>
          <Copy>Two people. One phone. Compare your evidence and solve it together.</Copy>
          <View style={s.links}>
            <View style={s.link}><Button secondary accessibilityLabel="How to play, support & privacy" onPress={() => router.push('/help')}>Help</Button></View>
            <View style={s.link}><Button secondary accessibilityLabel="Sound & settings" onPress={() => router.push('/settings')}>Settings</Button></View>
          </View>
          {access.devPreview && <View style={s.devNote}><Label>DEVELOPMENT PREVIEW</Label>
            <Copy style={s.description}>After Midnight cases are open without a purchase because this development build was started with the preview flag. Release builds ignore it.</Copy></View>}

          <View style={s.section}><Label>{FREE_COLLECTION.title.toUpperCase()} · FREE</Label>
            <Text accessibilityRole="header" style={s.sectionTitle}>Five complete mysteries. Free to play together.</Text>
            <Copy style={s.description}>One phone, two perspectives. Start with {getCase(RECOMMENDED_FIRST_CASE).title}.</Copy>
            {freeSolved > 0 && <Text accessibilityLiveRegion="polite" style={s.status}>{freeSolved} of {FREE_COLLECTION.caseIds.length} free cases solved</Text>}</View>
          {FREE_COLLECTION.caseIds.map((id, i) => <CaseCard key={id} item={getCase(id)} index={i} locked={false} onOpen={onOpen} onOffer={onOffer} onSolved={markSolved} />)}

          <View style={[s.section, s.paidSection]}>
            <Label>{AFTER_MIDNIGHT.title.toUpperCase()} · {owned ? (access.devPreview && !state.entitlements.includes(AFTER_MIDNIGHT.entitlementId ?? '') ? 'PREVIEW' : 'OWNED') : 'ONE-TIME PURCHASE'}</Label>
            <Text accessibilityRole="header" style={s.sectionTitle}>One purchase. Two players. Three new mysteries.</Text>
            <Copy style={s.description}>{owned ? 'Your three After Midnight cases are open below.' :
              'Three new mysteries unfold after dark at the Bellweather Hotel. Compare your clues, question each other’s theories, and uncover the truth together.'}</Copy>
            <Copy style={s.description}>One-time purchase. Hints included. No subscription.</Copy>
            <Button secondary onPress={() => onOffer('library')}>{owned ? 'About this collection' : 'See the collection'}</Button>
          </View>
          {AFTER_MIDNIGHT.caseIds.map((id, i) => <CaseCard key={id} item={getCase(id)} index={i} locked={!owned} onOpen={onOpen} onOffer={onOffer} />)}
          <Text style={s.duration}>Play at your own pace. No sound required.</Text>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy },
  safe: { flex: 1 }, content: { padding: 20, paddingBottom: 40, gap: 20 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  link: { flex: 1, minWidth: 120 },
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
  rating: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  ratingText: { fontSize: 13, lineHeight: 20, fontWeight: '600', flexShrink: 1 },
});
