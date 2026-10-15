import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rounds } from '../src/game/case';
import { canAnswer, evidenceUnlocked, freshProgress, investigationReducer as reduce, nextScene, Progress, resumeScene, visibleHints } from '../src/game/engine';
import { createSaveQueue, decodeSave, loadProgress, SAVE_KEY, Store } from '../src/game/storage';

function readBoth(p: Progress): Progress {
  return reduce(reduce(p, { type: 'read', round: p.round, role: 'A' }), { type: 'read', round: p.round, role: 'B' });
}
const start = () => reduce(freshProgress(), { type: 'start' });

test('complete canonical case; every incorrect option permits retry without progression or a hint', () => {
  let p = start();
  for (let round = 0; round < rounds.length; round++) {
    assert.equal(canAnswer(p, round), false);
    p = readBoth(p);
    for (const answer of rounds[round].options.filter(a => a !== rounds[round].correct)) {
      assert.strictEqual(reduce(p, { type: 'answer', round, answer }), p);
      assert.equal(p.hints[round], 0);
    }
    p = reduce(p, { type: 'answer', round, answer: rounds[round].correct });
    assert.equal(p.round, round + 1);
  }
  assert.deepEqual(p.confirmed, ['22:10', 'Nora', 'Upstairs linen-room dry-document cabinet']);
  assert.deepEqual(nextScene(p), { kind: 'ending' });
});

test('cannot skip a round, read future evidence, or submit before both roles finish', () => {
  const p = start();
  assert.strictEqual(reduce(p, { type: 'answer', round: 1, answer: 'Nora' }), p);
  assert.strictEqual(reduce(p, { type: 'answer', round: 0, answer: '22:10' }), p);
  assert.strictEqual(reduce(p, { type: 'read', round: 2, role: 'B' }), p);
  const onlyA = reduce(p, { type: 'read', round: 0, role: 'A' });
  assert.strictEqual(reduce(onlyA, { type: 'answer', round: 0, answer: '22:10' }), onlyA);
  assert.equal(evidenceUnlocked(p, -1, 'A'), false);
  assert.equal(evidenceUnlocked(p, 0.5, 'A'), false);
});

test('repeated and stale submissions never advance twice, even after the next evidence is read', () => {
  const action = { type: 'answer', round: 0, answer: '22:10' } as const;
  const p = reduce(readBoth(start()), action);
  assert.strictEqual(reduce(p, action), p);
  const nextReady = readBoth(p);
  assert.strictEqual(reduce(nextReady, action), nextReady);
  assert.equal(nextReady.round, 1);
});

test('revisiting unlocked evidence preserves all progress and still requires a neutral handoff', () => {
  let p = reduce(readBoth(start()), { type: 'answer', round: 0, answer: '22:10' });
  const before = JSON.stringify(p);
  assert.equal(evidenceUnlocked(p, 0, 'A'), true);
  p = reduce(p, { type: 'read', round: 0, role: 'A' });
  assert.equal(JSON.stringify(p), before);
  assert.deepEqual(nextScene(p), { kind: 'pass', round: 1, role: 'A', revisit: false });
});

test('three progressive hints are optional and cannot expose later rounds', () => {
  let p = start();
  assert.strictEqual(reduce(p, { type: 'hint', round: 0 }), p);
  p = readBoth(p);
  assert.strictEqual(reduce(p, { type: 'hint', round: 1 }), p);
  for (let i = 1; i <= 3; i++) {
    p = reduce(p, { type: 'hint', round: 0 });
    assert.equal(visibleHints(p, 0).length, i);
    assert.deepEqual(visibleHints(p, 1), []);
    assert.deepEqual(visibleHints(p, 2), []);
  }
  assert.strictEqual(reduce(p, { type: 'hint', round: 0 }), p);
  p = reduce(p, { type: 'answer', round: 0, answer: '22:10' });
  assert.deepEqual(visibleHints(p, 0), []);
  assert.deepEqual(visibleHints(p, 1), []);
});

test('saves round-trip progress, hint history, settings; resume always starts on a cover', () => {
  let p = readBoth(start());
  p = reduce(p, { type: 'hint', round: 0 });
  p = reduce(p, { type: 'answer', round: 0, answer: '22:10' });
  p = reduce(p, { type: 'largeText' });
  const loaded = decodeSave(JSON.stringify({ ...p, scene: { kind: 'private', role: 'A', round: 1 } }));
  assert.equal(loaded.kind, 'loaded');
  if (loaded.kind === 'loaded') assert.deepEqual(loaded.progress, p);
  assert.deepEqual(resumeScene(), { kind: 'cover' });
  assert.equal(decodeSave(null).kind, 'empty');
});

test('malformed, incompatible and impossible saves are rejected without writes', async () => {
  const p = start();
  const invalid = ['{', 'null', '[]', '{}', JSON.stringify({ ...p, version: 999 }),
    JSON.stringify({ ...p, round: 3 }), JSON.stringify({ ...p, read: [null, null, null] }),
    JSON.stringify({ ...p, hints: [4, 0, 0] }), JSON.stringify({ ...p, hints: [1, 0, 0] }),
    JSON.stringify({ ...p, read: [{ A: false, B: false }, { A: true, B: false }, { A: false, B: false }] }),
    JSON.stringify({ ...p, started: false, read: [{ A: true, B: true }, { A: false, B: false }, { A: false, B: false }] })];
  for (const raw of invalid) {
    let writes = 0;
    const store: Store = { getItem: async () => raw, setItem: async () => { writes++; } };
    assert.equal((await loadProgress(store)).kind, 'invalid');
    assert.equal(writes, 0);
  }
});

test('transient read failure leaves a valid existing save untouched and permits retry', async () => {
  const raw = JSON.stringify(readBoth(start()));
  let fail = true;
  let writes = 0;
  const store: Store = {
    getItem: async () => { if (fail) throw Error('blocked'); return raw; },
    setItem: async () => { writes++; },
  };
  assert.equal((await loadProgress(store)).kind, 'unavailable');
  fail = false;
  assert.equal((await loadProgress(store)).kind, 'loaded');
  assert.equal(writes, 0);
});

test('queued saves preserve order and recover after a failed write', async () => {
  const writes: string[] = [];
  let rejectFirst = true;
  const store: Store = {
    getItem: async () => null,
    setItem: async (key, value) => {
      assert.equal(key, SAVE_KEY);
      if (rejectFirst) { rejectFirst = false; throw Error('full'); }
      writes.push(value);
    },
  };
  const save = createSaveQueue(store);
  const p = start();
  const failed = save(freshProgress());
  const later = save(p);
  const latest = save(readBoth(p));
  await assert.rejects(failed);
  await Promise.all([later, latest]);
  assert.deepEqual(writes, [JSON.stringify(p), JSON.stringify(readBoth(p))]);
});
