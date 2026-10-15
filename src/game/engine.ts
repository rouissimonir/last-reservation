import { CASE_ID, Role } from './case';
import { getCase } from './cases';

export type Progress = {
  caseId: string;
  version: number;
  started: boolean;
  round: number;
  confirmed: string[];
  read: Record<Role, boolean>[];
  hints: number[];
  settings: { largeText: boolean };
};
export function freshProgress(caseId = CASE_ID): Progress {
  const { id, version, rounds } = getCase(caseId);
  return { caseId: id, version, started: false, round: 0,
    confirmed: [], read: rounds.map(() => ({ A: false, B: false })),
    hints: rounds.map(() => 0), settings: { largeText: false } };
}
export type Action =
  | { type: 'start' }
  | { type: 'read'; round: number; role: Role }
  | { type: 'answer'; round: number; answer: string }
  | { type: 'hint'; round: number }
  | { type: 'largeText' };

export function evidenceUnlocked(p: Progress, round: number, role: Role): boolean {
  const { rounds } = getCase(p.caseId);
  return p.started && Number.isInteger(round) && round >= 0 && round < rounds.length &&
    (round === p.round || (round < p.round && p.read[round][role]));
}
export function canAnswer(p: Progress, round: number): boolean {
  const { rounds } = getCase(p.caseId);
  return p.started && round === p.round && round < rounds.length && p.read[round].A && p.read[round].B;
}
export function visibleHints(p: Progress, round: number): readonly string[] {
  const { rounds } = getCase(p.caseId);
  return p.started && round === p.round && round < rounds.length
    ? rounds[round].hints.slice(0, p.hints[round]) : [];
}

export function investigationReducer(p: Progress, action: Action): Progress {
  const { rounds } = getCase(p.caseId);
  switch (action.type) {
    case 'start': return p.started ? p : { ...p, started: true };
    case 'largeText': return { ...p, settings: { largeText: !p.settings.largeText } };
    case 'read': {
      if (!evidenceUnlocked(p, action.round, action.role) || p.read[action.round][action.role]) return p;
      return { ...p, read: p.read.map((read, i) => i === action.round ? { ...read, [action.role]: true } : read) };
    }
    case 'hint': {
      if (!canAnswer(p, action.round) || p.hints[action.round] >= 3) return p;
      return { ...p, hints: p.hints.map((h, i) => i === action.round ? h + 1 : h) };
    }
    case 'answer': {
      if (!canAnswer(p, action.round) || action.answer !== rounds[action.round].correct) return p;
      return { ...p, round: p.round + 1, confirmed: [...p.confirmed, action.answer] };
    }
  }
}

// Presentation is intentionally absent from saved domain state.
export type Scene =
  | { kind: 'cover' } | { kind: 'intro' } | { kind: 'roles' }
  | { kind: 'pass' | 'private'; round: number; role: Role; revisit: boolean }
  | { kind: 'discuss' } | { kind: 'confirmed'; round: number }
  | { kind: 'ending' } | { kind: 'notebook' } | { kind: 'settings' }
  | { kind: 'reset' };
export const resumeScene = (): Scene => ({ kind: 'cover' });
export function nextScene(p: Progress): Scene {
  const { rounds } = getCase(p.caseId);
  if (!p.started) return { kind: 'intro' };
  if (p.round === rounds.length) return { kind: 'ending' };
  for (const role of ['A', 'B'] as const) {
    if (!p.read[p.round][role]) return { kind: 'pass', round: p.round, role, revisit: false };
  }
  return { kind: 'discuss' };
}
