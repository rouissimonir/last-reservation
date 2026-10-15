import { CASE_ID, CASE_VERSION, ending, introduction, Round, rounds } from './case';
import { lastReservation } from './last-reservation';
import { silentPiano } from './silent-piano';

export type CaseRound = Round & {
  id: string; act: string; label: string; requires: readonly string[]; evidenceRefs: readonly string[];
};
export type CaseDefinition = {
  id: string; version: number; edition: string; title: string; coverTitle: string; format: string;
  hook: string; description: string; duration: string; introduction: string; reliability: string;
  rounds: readonly CaseRound[]; ending: typeof ending;
  // Optional presentation overrides; omitted for the original cases so their screens are unchanged.
  setting?: string; introLabel?: string; introTitle?: string;
};
export const miniCase: CaseDefinition = {
  id: CASE_ID, version: CASE_VERSION, edition: '01', title: 'The Missing Envelope',
  coverTitle: 'The Missing\nEnvelope', format: 'Free mini-case', hook: 'Three employees. One missing envelope.',
  description: 'A sealed envelope vanishes from the hotel archive. Find when, who and where by comparing two perspectives.',
  duration: '5–8 minutes · UNVALIDATED', introduction,
  reliability: 'The supplied hotel records are verified. Witnesses are accurate about what they directly observed. An observed clock reading may differ from the actual time.',
  rounds: rounds.map((round, i) => ({ ...round, id: `ME${i + 1}`, act: 'The Missing Envelope',
    label: ['When', 'Who', 'Where'][i], requires: i ? [`ME${i}`] : [],
    evidenceRefs: [round.evidence.A.id, round.evidence.B.id] })), ending,
};
export const cases: readonly CaseDefinition[] = [miniCase, lastReservation, silentPiano];
export function getCase(id: string = CASE_ID): CaseDefinition {
  const found = cases.find(item => item.id === id);
  if (!found) throw new Error('Unknown case');
  return found;
}

// Structural validation protects authored references and the linear unlock contract.
export function validateCase(item: CaseDefinition): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const evidence = new Map<string, number>();
  item.rounds.forEach((round, i) => {
    if (ids.has(round.id)) errors.push(`Duplicate deduction ${round.id}`);
    ids.add(round.id);
    for (const role of ['A', 'B'] as const) {
      const sheet = round.evidence[role];
      if (evidence.has(sheet.id)) errors.push(`Duplicate evidence ${sheet.id}`);
      evidence.set(sheet.id, i);
      if (!sheet.paragraphs.length || sheet.paragraphs.some(p => !p.trim())) errors.push(`Empty evidence ${sheet.id}`);
    }
    if (round.hints.length !== 3 || round.hints.some(h => !h.trim())) errors.push(`Invalid hints ${round.id}`);
    if (!round.options.includes(round.correct) || new Set(round.options).size !== round.options.length) errors.push(`Invalid answer ${round.id}`);
  });
  item.rounds.forEach((round, i) => {
    for (const required of round.requires) {
      const index = item.rounds.findIndex(r => r.id === required);
      if (index < 0 || index >= i) errors.push(`Missing, forward or cyclic prerequisite ${round.id}:${required}`);
    }
    for (const ref of round.evidenceRefs) {
      const index = evidence.get(ref);
      if (index === undefined || index > i) errors.push(`Missing or future evidence ${round.id}:${ref}`);
    }
    for (const role of ['A', 'B'] as const) {
      if (!round.evidenceRefs.includes(round.evidence[role].id)) errors.push(`Missing role reference ${round.id}:${role}`);
    }
  });
  if (!item.rounds.length) errors.push('Empty case');
  return errors;
}
