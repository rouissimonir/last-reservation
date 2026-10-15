import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { cases, getCase, validateCase } from '../src/game/cases';
import { decodeSave, saveKey } from '../src/game/storage';

// Digests were taken from the experiment's baseline revision (eb1d164) before The Silent Piano was added.
// A change to either existing case, including its optional presentation fields, must be deliberate.
const BASELINE: Record<string, string> = {
  'the-missing-envelope': '2ccaf11430510e14f35b1e87eb1f53abb91008edfd669a26a61373cc11f422f1',
  'the-last-reservation': '64b58c2cda3258b020f76bdc24bd31b153b77541cb78320b330350f986f9e0dd',
};

test('existing case content is byte-for-byte what the baseline shipped', () => {
  for (const [id, digest] of Object.entries(BASELINE)) {
    assert.equal(createHash('sha256').update(JSON.stringify(getCase(id))).digest('hex'), digest, id);
    assert.deepEqual(validateCase(getCase(id)), []);
  }
});

test('existing ids, versions, order and save keys are unchanged; the new case is appended', () => {
  assert.deepEqual(cases.map(c => [c.id, c.version, c.edition]),
    [['the-missing-envelope', 1, '01'], ['the-last-reservation', 1, '02'], ['the-silent-piano', 1, '03']]);
  assert.equal(saveKey('the-missing-envelope'), 'two-sides/missing-envelope/v1');
  assert.equal(saveKey('the-last-reservation'), 'two-sides/the-last-reservation/v1');
});

test('saves written in the baseline format still load for both existing cases', () => {
  const mini = { caseId: 'the-missing-envelope', version: 1, started: true, round: 1, confirmed: ['22:10'],
    read: [{ A: true, B: true }, { A: true, B: false }, { A: false, B: false }], hints: [2, 0, 0], settings: { largeText: true } };
  const full = { caseId: 'the-last-reservation', version: 1, started: true, round: 1, confirmed: ['Ruth Vane'],
    read: [{ A: true, B: true }, { A: false, B: false }, { A: false, B: false }, { A: false, B: false }, { A: false, B: false }, { A: false, B: false }],
    hints: [3, 0, 0, 0, 0, 0], settings: { largeText: false } };
  const a = decodeSave(JSON.stringify(mini), 'the-missing-envelope');
  const b = decodeSave(JSON.stringify(full), 'the-last-reservation');
  assert.equal(a.kind, 'loaded');
  assert.equal(b.kind, 'loaded');
  if (a.kind === 'loaded') assert.deepEqual(a.progress, mini);
  if (b.kind === 'loaded') assert.deepEqual(b.progress, full);
  // They are not interchangeable with the new case.
  assert.equal(decodeSave(JSON.stringify(mini), 'the-silent-piano').kind, 'invalid');
  assert.equal(decodeSave(JSON.stringify(full), 'the-silent-piano').kind, 'invalid');
});
