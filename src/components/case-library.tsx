import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Copy, HotelBackdrop, Label, ReadingContext, TextAction, Title } from './game-ui';
import { CaseDefinition, cases } from '@/game/cases';
import { colors as c, serif } from '@/game/tokens';
import { useInvestigation } from '@/game/use-investigation';

function CaseCard({ item, onOpen }: { item: CaseDefinition; onOpen: (id: string, replay?: boolean) => void }) {
  const game = useInvestigation(item.id);
  const p = game.progress;
  const ready = game.status === 'ready';
  const finished = p.round === item.rounds.length;
  return <View style={s.card}>
    <Label>FILE {item.edition} · {item.format.toUpperCase()}</Label>
    <Text accessibilityRole="header" style={s.caseTitle}>{item.title}</Text>
    <Copy style={s.description}>{item.description}</Copy>
    <Text style={s.duration}>{item.duration}</Text>
    <Text accessibilityLiveRegion="polite" style={s.status}>{ready ? !p.started ? 'Not started' :
      `${finished ? 'Resolved' : 'In progress'} · ${p.confirmed.length} of ${item.rounds.length} deductions` :
      game.status === 'loading' ? 'Checking saved progress…' : 'Saved progress needs attention'}</Text>
    <Button accessibilityLabel={`Open ${item.title}`} disabled={game.status === 'loading'} onPress={() => onOpen(item.id)}>
      {!ready ? 'Review saved progress' : p.started ? 'Continue investigation' : 'Open the case'}
    </Button>
    {ready && p.started && <TextAction onPress={() => onOpen(item.id, true)}>Replay this case…</TextAction>}
  </View>;
}

export function CaseLibrary({ onOpen }: { onOpen: (id: string, replay?: boolean) => void }) {
  return <ReadingContext.Provider value={{ largeText: false, compact: false, reducedMotion: true }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={false} />
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content}>
          <Label>TWO / SIDES · BELLWEATHER HOTEL</Label>
          <Title>Choose your case.</Title>
          <Copy>Two people. One phone. Compare your evidence and solve it together.</Copy>
          <View style={s.preview}><Label>LOCAL DEVELOPMENT PREVIEW</Label><Copy style={s.description}>Both cases open. Separate local saves. No purchase required.</Copy></View>
          {cases.map(item => <CaseCard key={item.id} item={item} onOpen={onOpen} />)}
          <Text style={s.duration}>Play without sound. Duration targets await real two-player testing.</Text>
        </ScrollView>
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy },
  safe: { flex: 1 }, content: { padding: 20, paddingBottom: 40, gap: 20 },
  preview: { padding: 12, gap: 6, borderWidth: 1, borderColor: c.line, borderRadius: 6, backgroundColor: c.panel },
  description: { fontSize: 15, lineHeight: 23 },
  card: { padding: 20, gap: 14, borderRadius: 7, borderWidth: 1, borderColor: '#79694D', backgroundColor: 'rgba(16,29,41,0.94)' },
  caseTitle: { color: c.ivory, fontFamily: serif, fontSize: 29, lineHeight: 36 },
  duration: { color: c.muted, fontSize: 13, lineHeight: 21 },
  status: { color: c.brass, fontSize: 14, lineHeight: 22 },
});
