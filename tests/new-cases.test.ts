import assert from 'node:assert/strict';
import { test } from 'node:test';
import { caseEvents } from '../src/game/case-events';
import { cases, getCase, validateCase } from '../src/game/cases';
import { canAnswer, freshProgress, investigationReducer as reduce, nextScene, Progress, visibleHints } from '../src/game/engine';
import { presentationFor } from '../src/game/presentation';
import { createSaveQueue, decodeSave, loadProgress, saveKey, SAVE_KEY, Store } from '../src/game/storage';

const NEW = ['the-masquerade-coat', 'the-music-box', 'the-room-never-booked', 'the-last-call', 'the-portrait-behind-the-wall'];
const PAID = ['the-room-never-booked', 'the-last-call', 'the-portrait-behind-the-wall'];
const memory = () => {
  const data = new Map<string, string>();
  const store: Store = { getItem: async k => data.get(k) ?? null, setItem: async (k, v) => { data.set(k, v); } };
  return { data, store };
};
const solve = (id: string, rounds: number): Progress => {
  let p = reduce(freshProgress(id), { type: 'start' });
  for (let i = 0; i < rounds; i++) {
    p = reduce(reduce(p, { type: 'read', round: i, role: 'A' }), { type: 'read', round: i, role: 'B' });
    p = reduce(p, { type: 'answer', round: i, answer: getCase(id).rounds[i].correct });
  }
  return p;
};
const sheet = (id: string, i: number, role: 'A' | 'B') => getCase(id).rounds[i].evidence[role].paragraphs.join('\n');

test('new cases are valid, uniquely identified and sized as designed', () => {
  const ids = cases.flatMap(c => c.rounds.flatMap(r => [r.id, r.evidence.A.id, r.evidence.B.id]));
  assert.equal(new Set(ids).size, ids.length, 'deduction and evidence ids are unique across all cases');
  for (const id of NEW) {
    const item = getCase(id);
    assert.deepEqual(validateCase(item), [], id);
    assert.equal(item.rounds.length, PAID.includes(id) ? 5 : 3, id);
    for (const r of item.rounds) {
      assert.ok(r.options.length >= 3, `${r.id} options`);
      assert.ok(r.evidence.A.paragraphs.length >= 2 && r.evidence.B.paragraphs.length >= 3, `${r.id} sheets`);
    }
    assert.match(item.duration, /not yet measured/, `${id} must not claim a measured length`);
    assert.notEqual(presentationFor(id).emblem, 'envelope', `${id} has its own cover object`);
  }
  // Premium cases reuse earlier evidence in later deductions, not only the current pair of sheets.
  for (const id of PAID) assert.ok(getCase(id).rounds.some(r => r.evidenceRefs.length > 2), id);
});

test('each new case plays start to ending; wrong answers, hints and duplicates never advance it', () => {
  for (const id of NEW) {
    const item = getCase(id);
    let p = reduce(freshProgress(id), { type: 'start' });
    item.rounds.forEach((round, i) => {
      assert.equal(canAnswer(p, i), false);
      assert.deepEqual(nextScene(p), { kind: 'pass', round: i, role: 'A', revisit: false });
      p = reduce(reduce(p, { type: 'read', round: i, role: 'A' }), { type: 'read', round: i, role: 'B' });
      for (const wrong of round.options.filter(o => o !== round.correct)) assert.strictEqual(reduce(p, { type: 'answer', round: i, answer: wrong }), p);
      for (let h = 1; h <= 3; h++) p = reduce(p, { type: 'hint', round: i });
      assert.equal(visibleHints(p, i).length, 3);
      assert.deepEqual(visibleHints(p, i + 1), []);
      const answer = { type: 'answer', round: i, answer: round.correct } as const;
      p = reduce(p, answer);
      assert.strictEqual(reduce(p, answer), p);
      assert.equal(decodeSave(JSON.stringify(p), id).kind, 'loaded');
    });
    assert.deepEqual(nextScene(p), { kind: 'ending' });
  }
});

test('hints 1 and 2 never name the answer; the motive appears only in the ending note', () => {
  const motive: Record<string, RegExp> = {
    'the-masquerade-coat': /punch bowl|twins/i, 'the-music-box': /not allowed|spoiled/i,
    'the-room-never-booked': /pay for the night|marked 309/i, 'the-last-call': /my fault/i,
    'the-portrait-behind-the-wall': /I was wrong|cannot burn/i,
  };
  for (const id of NEW) {
    const item = getCase(id);
    for (const r of item.rounds) {
      for (const h of r.hints.slice(0, 2)) assert.ok(!h.toLowerCase().includes(r.correct.toLowerCase()), `${r.id} early hint names the answer`);
    }
    const body = [item.introduction, item.reliability, ...item.rounds.flatMap(r => [r.deduction, r.proof, ...r.hints, sheet(id, item.rounds.indexOf(r), 'A'), sheet(id, item.rounds.indexOf(r), 'B')])].join('\n');
    assert.doesNotMatch(body, motive[id], `${id} reveals the motive before the ending`);
    assert.match(item.ending.note, motive[id], id);
    assert.match(item.ending.conclusion, /resolved/i);
  }
});

test('mechanics: queue positions, weights, sounds and watermarks each need both sheets', () => {
  // Masquerade 2: behind a fox AND in front of feathers.
  const queue = sheet('the-masquerade-coat', 1, 'B').split('\n').filter(l => /^\d ·/.test(l)).map(l => ({ name: l.split(' · ')[1], fox: /fox/i.test(l), feathers: /feathered/.test(l) }));
  const fits = queue.filter((q, i) => i > 0 && queue[i - 1].fox && queue[i + 1]?.feathers).map(q => q.name);
  assert.deepEqual(fits, [getCase('the-masquerade-coat').rounds[1].correct]);
  assert.equal(queue.filter((q, i) => i > 0 && queue[i - 1].fox).length, 2);
  // Music Box 1: the present's weight exists only on A; where 3.5 kg left only on B.
  assert.match(sheet('the-music-box', 0, 'A'), /14\.5 kilograms[\s\S]*tureen weighed 5 kilograms and the tray 6/);
  assert.doesNotMatch(sheet('the-music-box', 0, 'A'), /hatch opened|first-floor/i);
  assert.match(sheet('the-music-box', 0, 'B'), /First-floor hatch · Hatch opened at 21:12 and closed at 21:13\. Departed carrying 11\.0 kg/);
  // Last Call 1: only the plant room both drips and rumbles intermittently.
  const rooms = sheet('the-last-call', 0, 'B');
  assert.match(rooms, /Boiler room[^\n]*Dry/);
  assert.match(rooms, /Wine cellar[^\n]*No machinery/);
  assert.match(rooms, /Roof plant room[^\n]*drips[^\n]*rumbles while that lift is moving/);
  assert.doesNotMatch(sheet('the-last-call', 0, 'A'), /plant|cellar|boiler|laundry/i);
  // Portrait 1: year marks only on B, marks only on A, and they are not alphabetical (no guessing the order).
  assert.match(sheet('the-portrait-behind-the-wall', 0, 'B'), /an anchor for 1938/);
  assert.doesNotMatch(sheet('the-portrait-behind-the-wall', 0, 'A'), /1938|year mark/);
  assert.match(sheet('the-portrait-behind-the-wall', 0, 'A'), /Letter D[^\n]*dated 3 May 1933[^\n]*small anchor/);
});

test('every new case saves under its own key; resets and damaged saves stay isolated; old keys unchanged', async () => {
  const { data, store } = memory();
  await createSaveQueue(store)(solve('the-missing-envelope', 1));
  await createSaveQueue(store, 'the-last-reservation')(solve('the-last-reservation', 2));
  await createSaveQueue(store, 'the-silent-piano')(solve('the-silent-piano', 3));
  const before = new Map(data);
  for (const id of NEW) {
    assert.equal(saveKey(id), `two-sides/${id}/v1`);
    const save = createSaveQueue(store, id);
    await save(solve(id, 2));
    assert.equal((await loadProgress(store, id)).kind, 'loaded');
    await save(freshProgress(id));
    await assert.rejects(save(solve('the-silent-piano', 1)), /cross-case/);
  }
  assert.equal(SAVE_KEY, 'two-sides/missing-envelope/v1');
  for (const [k, v] of before) assert.equal(data.get(k), v, k);
  assert.equal(new Set(cases.map(c => saveKey(c.id))).size, cases.length);
  data.set(saveKey('the-last-call'), '{"caseId":"the-last-call"');
  const damaged = data.get(saveKey('the-last-call'));
  assert.equal((await loadProgress(store, 'the-last-call')).kind, 'invalid');
  assert.equal(data.get(saveKey('the-last-call')), damaged);
  for (const id of NEW) for (const other of NEW.filter(o => o !== id)) assert.equal(decodeSave(JSON.stringify(solve(id, 1)), other).kind, 'invalid');
  // No purchase or entitlement state is ever part of a case save.
  for (const v of data.values()) assert.doesNotMatch(v, /entitle|purchase|after_midnight/i);
});

test('case analytics: started once, premium flagged, completed once, and no free text', () => {
  const fresh = freshProgress('the-last-call');
  const started = reduce(fresh, { type: 'start' });
  assert.deepEqual(caseEvents(fresh, started).map(e => e.name), ['case_started', 'premium_case_started']);
  assert.deepEqual(caseEvents(freshProgress('the-music-box'), reduce(freshProgress('the-music-box'), { type: 'start' })).map(e => e.name), ['case_started']);
  const almost = solve('the-music-box', 2);
  const done = solve('the-music-box', 3);
  assert.deepEqual(caseEvents(almost, done).map(e => e.name), ['case_completed']);
  assert.deepEqual(caseEvents(done, reduce(done, { type: 'largeText' })), []);
  const read = reduce(started, { type: 'read', round: 0, role: 'A' });
  assert.deepEqual(caseEvents(started, read), []);
  for (const e of caseEvents(fresh, started)) assert.deepEqual(Object.keys(e).sort(), ['case_id', 'collection_id', 'name']);
});
