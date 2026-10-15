import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCase } from '../src/game/cases';
import { freshProgress, investigationReducer as reduce, Progress } from '../src/game/engine';
import { createSaveQueue, decodeSave, loadProgress, saveKey, SAVE_KEY, Store } from '../src/game/storage';

const SP = 'the-silent-piano';
const LR = 'the-last-reservation';
const memory = () => {
  const data = new Map<string, string>();
  const store: Store = { getItem: async k => data.get(k) ?? null, setItem: async (k, v) => { data.set(k, v); } };
  return { data, store };
};
const started = (id: string) => reduce(freshProgress(id), { type: 'start' });
const solved = (id: string, rounds: number): Progress => {
  let p = started(id);
  const item = getCase(id);
  for (let i = 0; i < rounds; i++) {
    p = reduce(reduce(p, { type: 'read', round: i, role: 'A' }), { type: 'read', round: i, role: 'B' });
    p = reduce(p, { type: 'answer', round: i, answer: item.rounds[i].correct });
  }
  return p;
};

test('Silent Piano has its own versioned key; existing keys are unchanged', () => {
  assert.equal(saveKey(SP), 'two-sides/the-silent-piano/v1');
  assert.equal(SAVE_KEY, 'two-sides/missing-envelope/v1');
  assert.equal(saveKey(), SAVE_KEY);
  assert.equal(saveKey(LR), 'two-sides/the-last-reservation/v1');
  assert.equal(new Set([saveKey(), saveKey(LR), saveKey(SP)]).size, 3);
});

test('saving, resuming and resetting Silent Piano never touches the other two saves', async () => {
  const { data, store } = memory();
  await createSaveQueue(store)(started('the-missing-envelope'));
  await createSaveQueue(store, LR)(solved(LR, 2));
  const mini = data.get(SAVE_KEY);
  const full = data.get(saveKey(LR));
  const save = createSaveQueue(store, SP);
  const mid = solved(SP, 2);
  await save(mid);
  const loaded = await loadProgress(store, SP);
  assert.equal(loaded.kind, 'loaded');
  if (loaded.kind === 'loaded') assert.deepEqual(loaded.progress, mid);
  await save(freshProgress(SP)); // reset
  assert.equal(data.get(SAVE_KEY), mini);
  assert.equal(data.get(saveKey(LR)), full);
  assert.equal((await loadProgress(store, SP)).kind, 'loaded');
  assert.equal((await loadProgress(store, LR)).kind, 'loaded');
  await assert.rejects(save(solved(LR, 1)), /cross-case/);
  assert.equal(data.get(saveKey(LR)), full);
});

test('a damaged Silent Piano save is reported and never overwritten, and does not affect other cases', async () => {
  const { data, store } = memory();
  await createSaveQueue(store, LR)(started(LR));
  data.set(saveKey(SP), '{"caseId":"the-silent-piano","version":1,');
  const before = data.get(saveKey(SP));
  assert.equal((await loadProgress(store, SP)).kind, 'invalid');
  assert.equal(data.get(saveKey(SP)), before);
  assert.equal((await loadProgress(store, LR)).kind, 'loaded');
  const failing: Store = { getItem: async () => { throw new Error('storage unavailable'); }, setItem: async () => undefined };
  assert.equal((await loadProgress(failing, SP)).kind, 'unavailable');
});

test('Silent Piano validator rejects impossible, foreign or tampered saves', () => {
  const ok = solved(SP, 1);
  assert.equal(decodeSave(JSON.stringify(ok), SP).kind, 'loaded');
  const bad: unknown[] = [
    { ...ok, caseId: LR }, { ...ok, version: 2 }, { ...ok, round: 4, confirmed: ['a', 'b', 'c', 'd'] },
    { ...ok, confirmed: ['Hugo Lang'] }, { ...ok, round: 2 },
    { ...ok, read: ok.read.slice(0, 2) }, { ...ok, hints: [0, 0, 0, 0, 0, 0] },
    { ...ok, read: ok.read.map((r, i) => i === 2 ? { A: true, B: false } : r) },
    { ...ok, hints: [0, 0, 1] },
    { ...ok, hints: [4, 0, 0] },
    { ...started(SP), round: 0, hints: [1, 0, 0] },
    { ...freshProgress(SP), read: freshProgress(SP).read.map((r, i) => i === 0 ? { A: true, B: true } : r) },
    { ...ok, settings: {} },
    null, 'x', [],
  ];
  for (const b of bad) assert.equal(decodeSave(JSON.stringify(b), SP).kind, 'invalid', JSON.stringify(b));
  assert.equal(decodeSave(JSON.stringify(solved(LR, 1)), SP).kind, 'invalid');
  assert.equal(decodeSave(JSON.stringify(ok), LR).kind, 'invalid');
  assert.equal(decodeSave(JSON.stringify(ok), 'the-missing-envelope').kind, 'invalid');
  assert.equal(decodeSave(null, SP).kind, 'empty');
});

test('saved JSON stores progress only, never evidence, hint text, scenes or the ending', async () => {
  const { data, store } = memory();
  let p = solved(SP, 3);
  p = { ...p };
  await createSaveQueue(store, SP)(p);
  const raw = data.get(saveKey(SP))!;
  assert.deepEqual(Object.keys(JSON.parse(raw)).sort(), ['caseId', 'confirmed', 'hints', 'read', 'round', 'settings', 'started', 'version']);
  const item = getCase(SP);
  for (const needle of ['paragraphs', 'scene', 'Tomas', 'teacher', 'Hugo', item.rounds[0].hints[0], item.ending.note]) {
    assert.ok(!raw.includes(needle), `save must not contain ${needle}`);
  }
  const round = decodeSave(raw, SP);
  assert.equal(round.kind, 'loaded');
});

test('rapid saves from a finished Silent Piano are written in order', async () => {
  const { data, store } = memory();
  const slow: Store = { getItem: store.getItem, setItem: (k, v) => new Promise(r => setTimeout(() => { void store.setItem(k, v); r(undefined); }, v.includes('"round":3') ? 20 : 1)) };
  const save = createSaveQueue(slow, SP);
  await Promise.all([save(solved(SP, 2)), save(solved(SP, 3))]);
  assert.equal(JSON.parse(data.get(saveKey(SP))!).round, 3);
});
