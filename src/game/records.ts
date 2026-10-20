import { getCase } from './cases';
import { CaseRating, Tier, tierFor } from './rating';

// A personal best per case, kept under its own key beside (never inside) the case save, so case
// keys and save formats are untouched and replaying a case no longer forgets its best rating.
export type CaseRecord = { caseId: string; version: number; solves: number; bestScore: number; bestHints: number };
export type RecordLoad = { kind: 'loaded'; record: CaseRecord } | { kind: 'empty' } | { kind: 'invalid' | 'unavailable' };
type Store = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<unknown> };

export const MAX_SOLVES = 9999;
export const recordKey = (caseId: string) => `two-sides/${getCase(caseId).id}/record/v1`;
export const recordTier = (r: CaseRecord): Tier => tierFor(r.bestHints, r.bestScore);
const count = (v: unknown, max: number) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= max;

export function decodeRecord(raw: string | null, caseId: string): RecordLoad {
  if (raw === null) return { kind: 'empty' };
  const item = getCase(caseId);
  try {
    const r = JSON.parse(raw);
    if (!r || r.caseId !== item.id || r.version !== item.version || !count(r.solves, MAX_SOLVES) || r.solves < 1 ||
      !count(r.bestScore, 100) || !count(r.bestHints, 3 * item.rounds.length)) return { kind: 'invalid' };
    return { kind: 'loaded', record: { caseId: item.id, version: item.version, solves: r.solves, bestScore: r.bestScore, bestHints: r.bestHints } };
  } catch { return { kind: 'invalid' }; }
}

export async function loadRecord(store: Store, caseId: string): Promise<RecordLoad> {
  try { return decodeRecord(await store.getItem(recordKey(caseId)), caseId); }
  catch { return { kind: 'unavailable' }; }
}

// Higher score wins; on a tie, fewer hints.
export const beats = (a: { score: number; hints: number }, b: CaseRecord) =>
  a.score > b.bestScore || (a.score === b.bestScore && a.hints < b.bestHints);

export function recordSolve(previous: CaseRecord | null, caseId: string, rating: CaseRating): { record: CaseRecord; improved: boolean } {
  const item = getCase(caseId);
  const improved = previous !== null && beats(rating, previous);
  const best = previous === null || improved ? { bestScore: rating.score, bestHints: rating.hints } :
    { bestScore: previous.bestScore, bestHints: previous.bestHints };
  return { improved, record: { caseId: item.id, version: item.version, solves: Math.min(MAX_SOLVES, (previous?.solves ?? 0) + 1), ...best } };
}

// Writes run in order, and only valid records for this case are ever written.
export function createRecordQueue(store: Store, caseId: string) {
  let tail: Promise<unknown> = Promise.resolve();
  return (r: CaseRecord): Promise<void> => {
    const snapshot = JSON.stringify(r);
    if (decodeRecord(snapshot, caseId).kind !== 'loaded') return Promise.reject(new Error('Refusing an invalid or cross-case record'));
    const write = tail.catch(() => undefined).then(() => store.setItem(recordKey(caseId), snapshot)).then(() => undefined);
    tail = write;
    return write;
  };
}
