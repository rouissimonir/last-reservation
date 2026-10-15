import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, CaseDefinition, getCase, validateCase } from '../src/game/cases';
import { canAnswer, evidenceUnlocked, freshProgress, investigationReducer as reduce, nextScene, visibleHints } from '../src/game/engine';
import { createSaveQueue, decodeSave, loadProgress, saveKey, SAVE_KEY, Store } from '../src/game/storage';

const FULL = 'the-last-reservation';
const answers = ['Ruth Vane', 'East archive passage', 'Owen Bell', 'Victor Hale', 'West staff reading room',
  'Elin withdrew voluntarily to protect originals and await witnesses'];

test('full case walkthrough: both roles, every wrong choice, hint gates and duplicate submissions', () => {
  let p = reduce(freshProgress(FULL), { type: 'start' });
  const item = getCase(FULL);
  assert.equal(item.rounds.length, 6);
  assert.equal(new Set(item.rounds.map(r => r.act)).size, 3);
  for (let i = 0; i < answers.length; i++) {
    assert.equal(canAnswer(p, i), false);
    assert.strictEqual(reduce(p, { type: 'answer', round: i, answer: answers[i] }), p);
    assert.strictEqual(reduce(p, { type: 'hint', round: i }), p);
    assert.equal(evidenceUnlocked(p, i + 1, 'A'), false);
    assert.deepEqual(nextScene(p), { kind: 'pass', round: i, role: 'A', revisit: false });
    p = reduce(p, { type: 'read', round: i, role: 'A' });
    assert.equal(canAnswer(p, i), false);
    assert.deepEqual(nextScene(p), { kind: 'pass', round: i, role: 'B', revisit: false });
    p = reduce(p, { type: 'read', round: i, role: 'B' });
    assert.deepEqual(nextScene(p), { kind: 'discuss' });
    for (const answer of item.rounds[i].options.filter(x => x !== answers[i])) {
      assert.strictEqual(reduce(p, { type: 'answer', round: i, answer }), p);
    }
    for (let h = 1; h <= 3; h++) {
      p = reduce(p, { type: 'hint', round: i });
      assert.equal(visibleHints(p, i).length, h);
      assert.deepEqual(visibleHints(p, i + 1), []);
    }
    assert.strictEqual(reduce(p, { type: 'hint', round: i }), p);
    const action = { type: 'answer', round: i, answer: answers[i] } as const;
    p = reduce(p, action);
    assert.equal(p.round, i + 1);
    assert.strictEqual(reduce(p, action), p);
    assert.equal(decodeSave(JSON.stringify(p), FULL).kind, 'loaded');
  }
  assert.deepEqual(p.confirmed, answers);
  assert.deepEqual(nextScene(p), { kind: 'ending' });
  const snapshot = JSON.stringify(p);
  assert.equal(evidenceUnlocked(p, 0, 'A'), true);
  assert.equal(JSON.stringify(reduce(p, { type: 'read', round: 0, role: 'A' })), snapshot);
});

test('both authored cases have unique valid references and backward-only prerequisite graphs', () => {
  for (const item of cases) assert.deepEqual(validateCase(item), []);
  assert.notEqual(saveKey(cases[0].id), saveKey(FULL));
  assert.equal(saveKey(cases[0].id), SAVE_KEY);
});

test('content validation rejects broken evidence references, missing prerequisites, cycles and future evidence', () => {
  const original = getCase(FULL);
  const broken: CaseDefinition = { ...original, rounds: original.rounds.map((r, i) => i ? r : {
    ...r, requires: ['LR2', 'DOES-NOT-EXIST'], evidenceRefs: ['LR-A1', 'missing', 'LR-B6'] }) };
  const errors = validateCase(broken);
  assert.ok(errors.some(e => e.includes('cyclic prerequisite')));
  assert.ok(errors.some(e => e.includes('DOES-NOT-EXIST')));
  assert.ok(errors.some(e => e.includes('missing')));
  assert.ok(errors.some(e => e.includes('LR-B6')));
});

test('case-specific loads, malformed saves and reset preserve the other case and original mini key', async () => {
  const data = new Map<string, string>();
  const store: Store = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => { data.set(key, value); } };
  const mini = reduce(freshProgress(), { type: 'start' });
  const full = reduce(reduce(freshProgress(FULL), { type: 'start' }), { type: 'largeText' });
  const saveMini = createSaveQueue(store);
  const saveFull = createSaveQueue(store, FULL);
  await Promise.all([saveMini(mini), saveFull(full)]);
  assert.equal((await loadProgress(store)).kind, 'loaded');
  const loaded = await loadProgress(store, FULL);
  if (loaded.kind === 'loaded') assert.deepEqual(loaded.progress, full);
  else assert.fail('Expected valid full save');
  const originalMini = data.get(SAVE_KEY);
  await saveFull(freshProgress(FULL));
  assert.equal(data.get(SAVE_KEY), originalMini);
  await assert.rejects(saveFull(mini), /cross-case/);
  assert.equal(data.get(SAVE_KEY), originalMini);
  data.set(saveKey(FULL), '{broken');
  assert.equal((await loadProgress(store, FULL)).kind, 'invalid');
  assert.equal(data.get(saveKey(FULL)), '{broken');
  assert.equal((await loadProgress(store)).kind, 'loaded');
  assert.equal(decodeSave(originalMini!, FULL).kind, 'invalid');
});

test('full-case save validator rejects impossible future reads, wrong answers and invalid lengths', () => {
  const p = reduce(freshProgress(FULL), { type: 'start' });
  for (const bad of [
    { ...p, hints: [0, 0, 0] }, { ...p, round: 7 },
    { ...p, round: 1, confirmed: ['wrong'] },
    { ...p, read: p.read.map((r, i) => i === 5 ? { A: true, B: true } : r) },
  ]) assert.equal(decodeSave(JSON.stringify(bad), FULL).kind, 'invalid');
});
