import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ClosedFolder, Copy, EnvelopeArt, EvidenceDocument, HotelBackdrop, Label,
  Paper, ReadingContext, RoleGlyph, SceneReveal, TextAction, Title, ui, useReducedMotion } from './game-ui';

import { CaseLibrary } from './case-library';
import { roleNames } from '@/game/case';
import { getCase } from '@/game/cases';
import { canAnswer, evidenceUnlocked, nextScene, resumeScene, Scene, visibleHints } from '@/game/engine';
import { colors as c, serif, space } from '@/game/tokens';
import { useInvestigation } from '@/game/use-investigation';
import { usePrivacy } from '@/game/use-privacy';

export function Investigation() {
  const [selected, setSelected] = useState<{ id: string; replay: boolean } | null>(null);
  return selected ? <CaseInvestigation key={`${selected.id}:${selected.replay}`} caseId={selected.id}
    replay={selected.replay} onCases={() => setSelected(null)} /> :
    <CaseLibrary onOpen={(id, replay = false) => setSelected({ id, replay })} />;
}

function CaseInvestigation({ caseId, replay, onCases }: { caseId: string; replay: boolean; onCases: () => void }) {
  const item = getCase(caseId);
  const { rounds, ending, introduction } = item;
  const game = useInvestigation(caseId);
  const p = game.progress;
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const reducedMotion = useReducedMotion();
  const [scene, setScene] = useState<Scene>(() => replay ? { kind: 'reset' } : resumeScene());
  const [choice, setChoice] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const navigate = useCallback((target: Scene) => {
    setChoice(null);
    setWrong(false);
    setScene(target);
  }, []);
  const conceal = useCallback(() => navigate(resumeScene()), [navigate]);
  usePrivacy(conceal);

  const ready = game.status === 'ready';
  const privateScene = scene.kind === 'pass' || scene.kind === 'private';
  const isCover = ready && scene.kind === 'cover';
  const showHeaderTools = ready && !privateScene && ['discuss', 'confirmed', 'ending'].includes(scene.kind);
  const activeRound = rounds[p.round];
  const saveLabel = game.volatile ? 'Playing without saving' : game.saveError ? 'Save needs attention' : game.saving ? 'Saving…' : 'Saved on this device';

  const finishEvidence = () => {
    if (scene.kind !== 'private' || !evidenceUnlocked(p, scene.round, scene.role)) return;
    const next = game.dispatch({ type: 'read', round: scene.round, role: scene.role });
    navigate(scene.revisit ? { kind: 'notebook' } : nextScene(next));
  };
  const roundHeader = (n: number) => <View style={s.roundHeader}>
    <Label>DEDUCTION {String(n + 1).padStart(2, '0')} OF {String(rounds.length).padStart(2, '0')}</Label>
    <Text style={s.chapterWord}>{rounds[n].label}</Text>
  </View>;

  const renderScene = () => {
    if (scene.kind === 'reset') return <>
      <Label>A FRESH INVESTIGATION</Label><Title>Start this case again?</Title>
      <Copy>This replaces progress, deductions, hints and reading settings for {item.title} only. Your other case is preserved. Both investigators will start this case from the beginning.</Copy>
      <Button disabled={game.status === 'loading'} onPress={() => { game.reset(); navigate({ kind: 'cover' }); }}>Yes, reset this case</Button>
      <Button secondary onPress={() => navigate({ kind: 'cover' })}>Keep current progress</Button>
    </>;
    if (!ready) {
      if (game.status === 'loading') return <><Label>BELLWEATHER HOTEL</Label><Title>Opening the case…</Title><Copy>Checking your saved investigation.</Copy></>;
      return <><Label>YOUR SAVE IS PROTECTED</Label><Title>We couldn’t open your progress.</Title>
        <Copy>{game.status === 'invalid' ? 'The saved case is damaged or from an unsupported version.' : 'Local storage could not be read.'} The existing save has not been replaced.</Copy>
        <Button onPress={() => { navigate({ kind: 'cover' }); void game.reload(); }}>Try loading again</Button>
        <Button secondary onPress={() => { game.playUnsaved(); navigate({ kind: 'cover' }); }}>Play without saving</Button>
        <Button secondary onPress={() => navigate({ kind: 'reset' })}>Replace save…</Button>
        <TextAction onPress={onCases}>Choose another case</TextAction>
      </>;
    }
    switch (scene.kind) {
      case 'cover': return <View style={[s.coverScene, compact && s.compactCover]}>
        <View style={s.caseEdition}><View style={s.editionRule} /><Label>THE BELLWEATHER FILES · {item.edition}</Label><View style={s.editionRule} /></View>
        <EnvelopeArt />
        <View style={s.coverTitleGroup}>
          <Text style={s.hotelLocation}>{item.setting ?? 'Bellweather Hotel · October 1994'}</Text>
          <Text accessibilityRole="header" style={[s.coverTitle, compact && s.compactCoverTitle]}>{item.coverTitle}</Text>
          <Copy style={s.hook}>{item.hook}</Copy>
        </View>
        <Text style={s.coverMetadata}>2 players · 1 phone</Text>
        <View style={s.coverAction}>
          <Button onPress={() => navigate(nextScene(p))}>{p.started ? 'Continue investigation' : 'Open the case'}</Button>
          {p.started && <Text style={s.progressNote}>{p.confirmed.length} of {rounds.length} deductions confirmed</Text>}
        </View>
        <View style={s.coverTools}>
          <TextAction onPress={onCases}>Cases</TextAction>
          <TextAction onPress={() => navigate({ kind: 'notebook' })}>Notebook</TextAction>
          <View style={s.toolDivider} />
          <TextAction onPress={() => navigate({ kind: 'settings' })}>Settings</TextAction>
        </View>
        <Text accessibilityLiveRegion="polite" style={s.saveStatus}>{saveLabel}</Text>
        <Text style={s.saveStatus}>{item.duration}</Text>
      </View>;
      case 'intro': return <>
        <Label>{item.introLabel ?? 'A RAINY EVENING IN OCTOBER, 1994'}</Label><Title>{item.introTitle ?? 'Something is missing.'}</Title>
        <Paper reference="RECEPTION / 01"><Text style={ui.documentTitle}>A note from reception</Text><Copy style={ui.ink}>{introduction}</Copy></Paper>
        <Copy>{item.reliability}</Copy>
        <Button onPress={() => navigate({ kind: 'roles' })}>Meet your two roles →</Button>
      </>;
      case 'roles': return <>
        <Label>TWO PEOPLE · ONE SHARED PHONE</Label><Title>Two sides of the story.</Title>
        {(['A', 'B'] as const).map(role => <View style={s.roleCard} key={role}>
          <RoleGlyph role={role} /><View style={s.roleDetails}><Label>INVESTIGATOR {role}</Label>
            <Text style={s.roleName}>{roleNames[role]}</Text>
            <Copy>{role === 'A' ? 'Read the eyewitness accounts. Notice what people actually saw.' : 'Read maintenance, access and storage records. Look for what they establish.'}</Copy></View>
        </View>)}
        <Copy>Choose one role each. Read your evidence privately, then hide it before passing the phone. At each shared question, describe your findings aloud and decide together.</Copy>
        <Copy>There is no timer or penalty. Hints are free. Use the notebook to revisit evidence through a private handoff.</Copy>
        <Button onPress={() => { const next = game.dispatch({ type: 'start' }); navigate(nextScene(next)); }}>We’ve chosen our roles →</Button>
      </>;
      case 'pass': {
        if (!evidenceUnlocked(p, scene.round, scene.role)) return <><Title>This evidence is locked.</Title><Button onPress={conceal}>Return to cover</Button></>;
        return <View style={s.handoff}>
          <Label>THE NEXT SHEET IS PRIVATE</Label><ClosedFolder />
          <View style={s.handoffRole}><RoleGlyph role={scene.role} small /><Label>INVESTIGATOR {scene.role}</Label></View>
          <Text accessibilityRole="header" style={s.handoffTitle}>Pass the phone to the{ '\n' }{roleNames[scene.role]}</Text>
          <Copy style={s.handoffReminder}>Only this investigator should open the next clue.</Copy>
          <View style={s.handoffAction}><Button onPress={() => navigate({ ...scene, kind: 'private' })}>I’m ready</Button></View>
        </View>;
      }
      case 'private': {
        if (!evidenceUnlocked(p, scene.round, scene.role)) return <><Title>This evidence is locked.</Title><Button onPress={conceal}>Return to cover</Button></>;
        const evidence = rounds[scene.round].evidence[scene.role];
        return <>
          <View style={s.readerRole}><RoleGlyph role={scene.role} small /><View style={s.roleDetails}>
            <Label>INVESTIGATOR {scene.role} · PRIVATE</Label><Text style={s.readerRoleName}>{roleNames[scene.role]}</Text>
          </View></View>
          <EvidenceDocument evidence={evidence} role={scene.role} round={scene.round} />
          <Copy style={s.readerReminder}>Read at your own pace. Hide this sheet before passing the phone.</Copy>
        </>;
      }
      case 'discuss': {
        if (!activeRound || !canAnswer(p, p.round)) return <><Title>Read both sides first.</Title><Button onPress={() => navigate(nextScene(p))}>Continue investigation</Button></>;
        const hints = visibleHints(p, p.round);
        return <>
          {roundHeader(p.round)}<Label>PUT YOUR FINDINGS TOGETHER</Label><Title>{activeRound.title}</Title>
          <Text style={s.chapterWord}>{activeRound.act}</Text>
          {p.confirmed.length > 0 && <View style={s.confirmedStrip}><Label>FROM YOUR NOTEBOOK</Label><Copy>{rounds[p.round - 1].deduction}</Copy></View>}
          <Copy>Share what each of you found. Combine both perspectives before choosing your answer.</Copy>
          <Text accessibilityRole="header" style={s.question}>{activeRound.question}</Text>
          <View style={s.options}>{activeRound.options.map((option, i) => <Button key={option} secondary selected={choice === option}
            onPress={() => { setChoice(option); setWrong(false); }}>{`${choice === option ? '✓' : String.fromCharCode(65 + i) + '.'}  ${option}`}</Button>)}</View>
          {wrong && <View accessibilityLiveRegion="polite" style={s.feedback}><Copy>That doesn’t fit all the evidence. Compare your clues and try again—there’s no penalty.</Copy></View>}
          <Button disabled={!choice} onPress={() => {
            if (!choice) return;
            const round = p.round;
            const next = game.dispatch({ type: 'answer', round, answer: choice });
            if (next.round > round) navigate({ kind: 'confirmed', round });
            else setWrong(true);
          }}>Confirm our deduction →</Button>
          <View style={s.hints}><Label>A LITTLE ASSISTANCE</Label>
            <Copy style={s.muted}>Optional and free. Reveal one hint at a time. Hint 3 explains the answer.</Copy>
            {hints.map((hint, i) => <View key={i} style={s.hintCard}><Label>HINT {i + 1}</Label><Copy>{hint}</Copy></View>)}
            {hints.length < 3 && <Button secondary onPress={() => game.dispatch({ type: 'hint', round: p.round })}>{hints.length === 2 ? 'Reveal solution hint (3 of 3)' : `Reveal hint ${hints.length + 1} of 3`}</Button>}
          </View>
          <TextAction onPress={() => navigate({ kind: 'notebook' })}>Revisit evidence in the notebook</TextAction>
        </>;
      }
      case 'confirmed': {
        if (scene.round >= p.round) return <><Title>Keep investigating.</Title><Button onPress={conceal}>Return to cover</Button></>;
        return <>{roundHeader(scene.round)}<Label>DEDUCTION CONFIRMED</Label><Title>{rounds[scene.round].deduction}</Title>
          <Copy>This finding has been added to your shared notebook.</Copy>
          {scene.round < rounds.length - 1 && <View style={s.confirmedStrip}><Label>HOW THE EVIDENCE FITS</Label><Copy>{rounds[scene.round].proof}</Copy></View>}
          <Button onPress={() => navigate(nextScene(p))}>{p.round === rounds.length ? 'Read the resolution →' : 'Open the next chapter →'}</Button>
        </>;
      }
      case 'ending': {
        if (p.round !== rounds.length) return <><Title>The case is still open.</Title><Button onPress={conceal}>Return to cover</Button></>;
        return <><Label>{item.title.toUpperCase()} · RESOLVED</Label><Title>{item.endingTitle ?? (item.edition === '01' ? 'Safe. Still sealed.' : 'A visitor found.')}</Title><Copy>{ending.recovery}</Copy>
          <Paper reference={`RESOLVED / ${item.edition}`}><Label paper>{item.noteLabel ?? (item.edition === '01' ? 'FOUND BESIDE THE ENVELOPE' : 'IN THE STAFF READING ROOM')}</Label><Text style={ui.documentTitle}>{item.noteTitle ?? (item.edition === '01' ? 'A signed note' : 'Elin’s closing words')}</Text><Copy style={ui.ink}>{ending.note}</Copy><Text style={s.signature}>{ending.signature}</Text></Paper>
          <Copy>{ending.conclusion}</Copy><View style={s.rule} /><Label>THE COMPLETE EVIDENCE CHAIN</Label>
          {rounds.map((round, i) => <View key={i} style={s.proofCard}><Label>0{i + 1} · {round.label.toUpperCase()}</Label><Text style={s.proofTitle}>{round.deduction}</Text><Copy>{round.proof}</Copy></View>)}
          <View style={s.closedStamp}><Text style={s.closedText}>CASE CLOSED</Text></View>
          <Copy style={s.center}>Two perspectives. One complete story.</Copy>
          <Button onPress={() => navigate({ kind: 'reset' })}>Play the case again…</Button>
          <TextAction onPress={conceal}>Return to cover</TextAction>
        </>;
      }
      case 'notebook': return <>
        <Label>YOUR SHARED CASE NOTEBOOK</Label><Title>What you know.</Title>
        <Copy>Only confirmed deductions appear here. Private evidence opens through a handoff to its investigator.</Copy>
        {p.confirmed.length === 0 && <View style={s.confirmedStrip}><Copy>No deductions confirmed yet. Start with what each of you observed.</Copy></View>}
        {p.confirmed.map((_, i) => <View key={i} style={s.proofCard}><Label>0{i + 1} · CONFIRMED</Label><Copy>{rounds[i].deduction}</Copy></View>)}
        <View style={s.rule} /><Label>REVISIT YOUR EVIDENCE</Label>
        {rounds.flatMap((round, i) => (['A', 'B'] as const).filter(role => p.read[i][role]).map(role =>
          <Button secondary key={`${i}${role}`} onPress={() => navigate({ kind: 'pass', round: i, role, revisit: true })}>
            {`${round.evidence[role].id} · Pass to ${roleNames[role]}`}
          </Button>))}
        {!p.read.some(read => read.A || read.B) && <Copy style={s.muted}>Evidence will appear here after it has been read.</Copy>}
        <Button onPress={() => navigate(nextScene(p))}>Return to investigation →</Button>
      </>;
      case 'settings': return <>
        <Label>READING & PROGRESS</Label><Title>Make yourself comfortable.</Title>
        <Copy>System text scaling is always supported. For a little more room, enlarge the body text below. Short reveals follow your device’s reduced-motion preference. No audio is needed.</Copy>
        <Button secondary selected={p.settings.largeText} onPress={() => game.dispatch({ type: 'largeText' })}>
          {p.settings.largeText ? 'Larger body text: On' : 'Larger body text: Off'}
        </Button>
        <View style={s.confirmedStrip}><Label>LOCAL TO THIS DEVICE</Label><Copy>Progress and viewed hints are saved separately for each case. Opening the app shows the case library; returning from the background conceals private evidence. Private sheets always reopen through a handoff.</Copy></View>
        <Button secondary onPress={() => navigate({ kind: 'reset' })}>Reset this case…</Button>
        <Button onPress={conceal}>Back to the cover</Button>
      </>;
    }
  };

  return <ReadingContext.Provider value={{ largeText: p.settings.largeText, compact, reducedMotion }}>
    <View style={s.root}><View style={s.frame}>
      <HotelBackdrop cover={isCover} />
      <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[s.masthead, isCover && s.coverMasthead]}>
          <View><Text style={s.wordmark}>TWO <Text style={s.wordmarkSlash}>/</Text> SIDES</Text>
            {isCover && <Text style={s.tagline}>A SHARED PHONE MYSTERY</Text>}</View>
          {isCover ? <View aria-hidden style={s.hotelBadge}><Text style={s.hotelBadgeText}>BH</Text></View> : showHeaderTools ?
            <View style={s.headerTools}><TextAction onPress={() => navigate({ kind: 'notebook' })}>Notebook</TextAction><TextAction onPress={() => navigate({ kind: 'settings' })}>Settings</TextAction></View> :
            <TextAction onPress={conceal}>Close</TextAction>}
        </View>
        <ScrollView key={JSON.stringify(scene)} style={s.scroll} contentContainerStyle={[s.scrollContent, isCover && s.coverScroll]}
          showsVerticalScrollIndicator={false}>
          {/* The old branch unmounts immediately. Only the new scene can reveal; there is no exit crossfade. */}
          <SceneReveal reduced={reducedMotion} enabled={scene.kind !== 'pass'}>
            <View style={s.scene}>{renderScene()}</View>
          </SceneReveal>
        </ScrollView>
        {ready && scene.kind === 'private' && evidenceUnlocked(p, scene.round, scene.role) &&
          <View style={s.actionDock}><Button onPress={finishEvidence}>Hide evidence & continue</Button></View>}
        {ready && (game.saveError || game.volatile) && <View accessibilityLiveRegion="polite" style={s.saveWarning}>
          <Text style={s.saveWarningText}>{game.volatile ? 'Playing without saving. Your existing save is untouched.' : 'Progress is in memory. Saving failed.'}</Text>
          {game.saveError && !game.volatile && <Button secondary onPress={game.retrySave}>Retry saving</Button>}
        </View>}
      </SafeAreaView>
    </View></View>
  </ReadingContext.Provider>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.deep },
  frame: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', backgroundColor: c.navy, overflow: 'hidden' },
  safeArea: { flex: 1 },
  masthead: { paddingHorizontal: space.xl, paddingVertical: 4, minHeight: 56, borderBottomWidth: 1,
    borderColor: 'rgba(213,177,112,0.2)', backgroundColor: 'rgba(9,18,27,0.65)',
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  coverMasthead: { paddingVertical: 10, backgroundColor: 'rgba(9,18,27,0.45)' },
  wordmark: { color: c.ivory, fontSize: 18, lineHeight: 25, letterSpacing: 3, fontWeight: '600' },
  wordmarkSlash: { color: c.brass, fontWeight: '300' },
  tagline: { color: c.ivory, fontSize: 8, lineHeight: 14, letterSpacing: 1.5 },
  hotelBadge: { borderWidth: 1, borderColor: c.brass, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }], marginRight: 5 },
  hotelBadgeText: { fontFamily: serif, fontSize: 12, color: c.brass, transform: [{ rotate: '-45deg' }] },
  headerTools: { flexDirection: 'row', flexWrap: 'wrap' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: space.xl, paddingTop: space.xl, paddingBottom: 28 },
  coverScroll: { paddingTop: 14, paddingBottom: 16 },
  scene: { gap: 18 },
  coverScene: { gap: 16 }, compactCover: { gap: 11 },
  caseEdition: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  editionRule: { height: 1, flex: 1, maxWidth: 40, backgroundColor: 'rgba(213,177,112,0.4)' },
  coverTitleGroup: { alignItems: 'center', gap: 8 },
  hotelLocation: { color: c.ivory, fontFamily: serif, fontStyle: 'italic', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  coverTitle: { color: c.ivory, fontFamily: serif, fontSize: 44, lineHeight: 47, textAlign: 'center', textShadowColor: c.deep, textShadowRadius: 8 },
  compactCoverTitle: { fontSize: 39, lineHeight: 43 },
  hook: { textAlign: 'center', color: c.ivory },
  coverMetadata: { color: c.muted, fontSize: 13, lineHeight: 21, textAlign: 'center' },
  coverAction: { gap: 10, paddingTop: 2 },
  progressNote: { color: c.muted, fontSize: 12, lineHeight: 19, textAlign: 'center' },
  coverTools: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' },
  toolDivider: { height: 16, width: 1, backgroundColor: c.line, marginHorizontal: 14 },
  saveStatus: { color: c.muted, fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: -10 },
  roleCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 6, borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(16,29,41,0.82)' },
  roleDetails: { flex: 1, gap: 5 }, roleName: { color: c.ivory, fontFamily: serif, fontSize: 23, lineHeight: 29 },
  handoff: { paddingVertical: 8, gap: 14, alignItems: 'center' },
  handoffRole: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  handoffTitle: { fontFamily: serif, color: c.ivory, fontSize: 30, lineHeight: 38, textAlign: 'center' },
  handoffReminder: { textAlign: 'center', color: c.muted },
  handoffAction: { width: '100%', marginTop: 6 },
  readerRole: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  readerRoleName: { color: c.ivory, fontFamily: serif, fontSize: 21, lineHeight: 28 },
  readerReminder: { color: c.muted, textAlign: 'center', fontSize: 14, lineHeight: 23 },
  actionDock: { backgroundColor: c.deep, paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 12, borderTopWidth: 1, borderColor: c.line },
  roundHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: c.line },
  chapterWord: { fontFamily: serif, color: c.brass, fontSize: 18, lineHeight: 24 },
  confirmedStrip: { padding: 18, backgroundColor: 'rgba(23,43,57,0.92)', borderLeftWidth: 2, borderColor: c.brass, gap: 9, borderRadius: 3 },
  question: { fontFamily: serif, color: c.ivory, fontSize: 25, lineHeight: 33, paddingTop: 4 },
  options: { gap: 10 },
  feedback: { padding: 16, backgroundColor: '#392B33', borderLeftWidth: 3, borderColor: c.brass, borderRadius: 3 },
  hints: { borderTopWidth: 1, borderColor: c.line, paddingTop: 22, marginTop: 6, gap: 14 },
  hintCard: { padding: 17, backgroundColor: c.panel, gap: 9, borderRadius: 4, borderWidth: 1, borderColor: c.line },
  muted: { color: c.muted }, center: { textAlign: 'center' },
  rule: { height: 1, backgroundColor: c.line, marginVertical: 6 },
  proofCard: { gap: 10, paddingBottom: 22, borderBottomWidth: 1, borderColor: c.line },
  proofTitle: { color: c.ivory, fontFamily: serif, fontSize: 24, lineHeight: 31 },
  signature: { color: c.burgundy, fontFamily: serif, fontSize: 19, lineHeight: 28, fontStyle: 'italic' },
  closedStamp: { alignSelf: 'center', borderWidth: 1, borderColor: c.brass, paddingHorizontal: 25, paddingVertical: 15, marginVertical: 8 },
  closedText: { color: c.brass, letterSpacing: 3, fontSize: 15, lineHeight: 23 },
  saveWarning: { padding: 12, gap: 10, backgroundColor: c.burgundy },
  saveWarningText: { color: c.ivory, fontSize: 13, lineHeight: 21 },
});
