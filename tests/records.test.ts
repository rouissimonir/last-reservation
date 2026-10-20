import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, getCase } from '../src/game/cases';
import { freshProgress, investigationReducer as reduce, Progress } from '../src/game/engine';
import { caseRating } from '../src/game/rating';
import { createRecordQueue, decodeRecord, loadRecord, recordKey, recordSolve, recordTier } from '../src/game/records';
import { SAVE_KEY, saveKey } from '../src/game/storage';

function solve(caseId: string, hintsPerRound: number[] = []): Progress {
  const item = getCase(caseId);
  let p = reduce(freshProgress(caseId), { type: 'start' });
  item.rounds.forEach((round, i) => {
    p = reduce(reduce(p, { type: 'read', round: i, role: 'A' }), { type: 'read', round: i, role: 'B' });
    for (let h = 0; h < (hintsPerRound[i] ?? 0); h++) p = reduce(p, { type: 'hint', round: i });
    p = reduce(p, { type: 'answer', round: i, answer: round.correct });
  });
  return p;
}
const memory = () => {
  const data = new Map<string, string>();
  return { data, getItem: async (k: string) => data.get(k) ?? null, setItem: async (k: string, v: string) => { data.set(k, v); } };
};

test('record keys are per case and never collide with any save key', () => {
  const keys = cases.map(c => recordKey(c.id));
  assert.equal(new Set(keys).size, cases.length);
  for (const c of cases) assert.ok(!cases.some(o => saveKey(o.id) === recordKey(c.id)));
  assert.ok(!keys.includes(SAVE_KEY));
  assert.equal(recordKey('the-missing-envelope'), 'two-sides/the-missing-envelope/record/v1');
});

test('a first solve is recorded; a better replay improves it, a worse one keeps the best and counts the solve', () => {
  const id = cases[1].id;
  const first = recordSolve(null, id, caseRating(solve(id, [1])));
  assert.equal(first.improved, false);
  assert.equal(first.record.solves, 1);
  const better = recordSolve(first.record, id, caseRating(solve(id)));
  assert.equal(better.improved, true);
  assert.equal(recordTier(better.record), 'perfect');
  assert.equal(better.record.bestScore, 100);
  const worse = recordSolve(better.record, id, caseRating(solve(id, [3, 3])));
  assert.equal(worse.improved, false);
  assert.equal(worse.record.solves, 3);
  assert.equal(worse.record.bestScore, 100);
  assert.equal(worse.record.bestHints, 0);
});

test('records are validated per case and malformed or cross-case records are rejected', () => {
  const [a, b] = cases;
  const { record } = recordSolve(null, a.id, caseRating(solve(a.id)));
  assert.equal(decodeRecord(JSON.stringify(record), a.id).kind, 'loaded');
  assert.equal(decodeRecord(JSON.stringify(record), b.id).kind, 'invalid');
  assert.equal(decodeRecord('{not json', a.id).kind, 'invalid');
  for (const bad of [{ solves: 0 }, { bestScore: 101 }, { bestHints: -1 }, { bestHints: 1.5 }, { version: 99 }]) {
    assert.equal(decodeRecord(JSON.stringify({ ...record, ...bad }), a.id).kind, 'invalid', JSON.stringify(bad));
  }
  assert.equal(decodeRecord(null, a.id).kind, 'empty');
});

test('the record queue writes only its own key, in order, and refuses cross-case records', async () => {
  const store = memory();
  const [a, b] = cases;
  const write = createRecordQueue(store, a.id);
  const one = recordSolve(null, a.id, caseRating(solve(a.id, [2]))).record;
  const two = recordSolve(one, a.id, caseRating(solve(a.id))).record;
  await Promise.all([write(one), write(two)]);
  assert.deepEqual([...store.data.keys()], [recordKey(a.id)]);
  const loaded = await loadRecord(store, a.id);
  assert.equal(loaded.kind === 'loaded' && loaded.record.solves, 2);
  await assert.rejects(write(recordSolve(null, b.id, caseRating(solve(b.id))).record));
  assert.equal(store.data.size, 1);
});

test('an unreadable store reports unavailable rather than empty', async () => {
  const broken = { getItem: async () => { throw new Error('locked'); }, setItem: async () => {} };
  assert.equal((await loadRecord(broken, cases[0].id)).kind, 'unavailable');
});
