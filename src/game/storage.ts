import { CASE_ID } from './case';
import { getCase } from './cases';
import { freshProgress, Progress } from './engine';

export const SAVE_KEY = 'two-sides/missing-envelope/v1';
export function saveKey(caseId = CASE_ID): string {
  const item = getCase(caseId);
  // Preserve existing mini-case saves without migration or a destructive rewrite.
  return caseId === CASE_ID ? SAVE_KEY : `two-sides/${item.id}/v${item.version}`;
}
export type LoadResult = { kind: 'loaded' | 'empty'; progress: Progress } | { kind: 'invalid' | 'unavailable' };
export type Store = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<unknown> };

export function decodeSave(raw: string | null, caseId = CASE_ID): LoadResult {
  const { version, rounds } = getCase(caseId);
  const count = rounds.length;
  if (raw === null) return { kind: 'empty', progress: freshProgress(caseId) };
  try {
    const p = JSON.parse(raw);
    if (!p || p.caseId !== caseId || p.version !== version || typeof p.started !== 'boolean' ||
      !Number.isInteger(p.round) || p.round < 0 || p.round > count || !Array.isArray(p.confirmed) ||
      p.confirmed.length !== p.round || !Array.isArray(p.read) || p.read.length !== count ||
      !Array.isArray(p.hints) || p.hints.length !== count || typeof p.settings?.largeText !== 'boolean') return { kind: 'invalid' };
    for (let i = 0; i < count; i++) {
      if (typeof p.read[i]?.A !== 'boolean' || typeof p.read[i]?.B !== 'boolean' ||
        !Number.isInteger(p.hints[i]) || p.hints[i] < 0 || p.hints[i] > 3) return { kind: 'invalid' };
      if (i < p.round && (p.confirmed[i] !== rounds[i].correct || !p.read[i].A || !p.read[i].B)) return { kind: 'invalid' };
      if (i > p.round && (p.read[i].A || p.read[i].B || p.hints[i] !== 0)) return { kind: 'invalid' };
      if (p.hints[i] > 0 && (!p.read[i].A || !p.read[i].B)) return { kind: 'invalid' };
      if (!p.started && (p.round !== 0 || p.read[i].A || p.read[i].B || p.hints[i] !== 0)) return { kind: 'invalid' };
    }
    // Copy only known fields. Never hydrate screen navigation from storage.
    return { kind: 'loaded', progress: { ...freshProgress(caseId), started: p.started, round: p.round,
      confirmed: [...p.confirmed], read: p.read.map((r: { A: boolean; B: boolean }) => ({ A: r.A, B: r.B })),
      hints: [...p.hints], settings: { largeText: p.settings.largeText } } };
  } catch { return { kind: 'invalid' }; }
}

export async function loadProgress(store: Store, caseId = CASE_ID): Promise<LoadResult> {
  try { return decodeSave(await store.getItem(saveKey(caseId)), caseId); }
  catch { return { kind: 'unavailable' }; }
}

// Sequential writes prevent a slower, earlier save from overwriting later progress.
export function createSaveQueue(store: Store, caseId = CASE_ID) {
  let tail: Promise<unknown> = Promise.resolve();
  return (p: Progress): Promise<void> => {
    if (p.caseId !== caseId || decodeSave(JSON.stringify(p), caseId).kind !== 'loaded') {
      return Promise.reject(new Error('Refusing an invalid or cross-case save'));
    }
    const snapshot = JSON.stringify(p);
    const write = tail.catch(() => undefined).then(() => store.setItem(saveKey(caseId), snapshot)).then(() => undefined);
    tail = write;
    return write;
  };
}
