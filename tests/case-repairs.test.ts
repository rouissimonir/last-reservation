import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { cases, getCase } from '../src/game/cases';
import { decodeSave, saveKey } from '../src/game/storage';

const sheet = (id: string, index: number, role: 'A' | 'B') => getCase(id).rounds[index].evidence[role].paragraphs.join('\n');

test('all pre-polish answers, identities and every legacy progress prefix remain compatible', () => {
  const fixture = JSON.parse(readFileSync('tests/fixtures/pre-polish-case-contracts.json', 'utf8'));
  assert.equal(fixture.sourceCommit, 'b1e204c');
  assert.equal(fixture.cases.length, cases.length);
  for (const old of fixture.cases) {
    const current = getCase(old.id);
    assert.equal(current.version, old.version);
    assert.equal(current.edition, old.edition);
    assert.equal(saveKey(old.id), old.saveKey);
    assert.deepEqual(current.rounds.map(r => r.id), old.roundIds);
    assert.deepEqual(current.rounds.map(r => [r.evidence.A.id, r.evidence.B.id]), old.evidenceIds);
    assert.deepEqual(current.rounds.map(r => r.correct), old.answers);
    for (let round = 0; round <= old.answers.length; round++) {
      const legacy = { caseId: old.id, version: old.version, started: true, round,
        confirmed: old.answers.slice(0, round), read: old.answers.map((_: string, i: number) => ({ A: i < round, B: i < round })),
        hints: old.answers.map(() => 0), settings: { largeText: true } };
      const loaded = decodeSave(JSON.stringify(legacy), old.id);
      assert.equal(loaded.kind, 'loaded', `${old.id} prefix ${round}`);
      if (loaded.kind === 'loaded') assert.deepEqual(loaded.progress, legacy);
    }
  }
});

test('reservation finale leaves two candidates per perspective and one combined explanation', () => {
  const r = getCase('the-last-reservation').rounds[5];
  assert.doesNotMatch(r.question, /authenticated|genuine|verified message/i);
  assert.match(sheet('the-last-reservation', 5, 'A'), /independent witnesses arrive/);
  assert.match(sheet('the-last-reservation', 5, 'B'), /personally watched.*write and sign/);
  assert.doesNotMatch(sheet('the-last-reservation', 5, 'B'), /police|await witnesses/);
  const options = r.options.map(answer => ({ answer, authentic: !/forged/.test(answer), police: /police/.test(answer) }));
  const wordsOnly = options.filter(o => !o.police); // Without custody, these words could be forged.
  const custodyOnly = options.filter(o => o.authentic); // Custody does not reveal the plan.
  assert.equal(wordsOnly.length, 2);
  assert.equal(custodyOnly.length, 2);
  assert.deepEqual(options.filter(o => o.authentic && !o.police).map(o => o.answer), [r.correct]);
});

test('coat location requires observed room entry as well as the lift stop mapping', () => {
  const r = getCase('the-masquerade-coat').rounds[2];
  const a = sheet('the-masquerade-coat', 2, 'A');
  const b = sheet('the-masquerade-coat', 2, 'B');
  assert.match(a, /second stop/);
  assert.match(a, /unlocked the single room door directly opposite it and carried the coat inside/);
  assert.doesNotMatch(a, /Room 316/);
  const stops = [...b.matchAll(/(?:at the|then the) (first|third|fourth) floor/g)].map(match => match[1]);
  assert.deepEqual(stops, ['first', 'third', 'fourth']);
  const rooms = [...b.matchAll(/Room (\d+) on the (first|third|fourth) floor/g)].map(match => ({ name: `Room ${match[1]}`, floor: match[2] }));
  assert.equal(rooms.length, 3, 'the mapping alone leaves three destinations');
  assert.deepEqual(rooms.filter(room => room.floor === stops[1]).map(room => room.name), [r.correct]);
});

test('master-key exclusion rests on verified exclusive use, not a chain locked only on return', () => {
  const b = sheet('the-room-never-booked', 1, 'B');
  const a = sheet('the-room-never-booked', 1, 'A');
  assert.match(b, /stayed with and was used only by its named holder all night/);
  assert.match(b, /no loans, exchanges or assisted uses/);
  assert.doesNotMatch(b, /found locked when the keys came back/);
  const holders = [...b.matchAll(/Signed out at 22:00 by ([^,]+)/g)].map(match => match[1]);
  assert.equal(holders.length, 2, 'custody alone cannot select a holder');
  assert.match(a, /badge said PIKE/);
  assert.match(a, /She never left my room in between/);
  assert.deepEqual(holders.filter(holder => !/Pike$/.test(holder)), [getCase('the-room-never-booked').rounds[1].correct]);
});

test('portrait authorship has an exclusive operator over a bounded period and an original-document claim', () => {
  const a = sheet('the-portrait-behind-the-wall', 3, 'A');
  const b = sheet('the-portrait-behind-the-wall', 3, 'B');
  assert.match(a, /break at the top of its loop/);
  assert.match(a, /capital “T” sits slightly below/);
  assert.match(b, /Ambrose Bellweather alone used No\. 2 between October 1938 and May 1939/);
  assert.match(b, /Neither machine was lent or used by a visitor/);
  assert.match(b, /personally deposited Letter D as Clara’s original 1933 letter/);
  assert.match(b, /sealed then and has not been altered/);
  assert.doesNotMatch(getCase('the-portrait-behind-the-wall').rounds[3].hints.join(' '), /Neither Clara nor Jonah was at the hotel/);
});

test('portrait finale needs both the verified certificate contents and actual boarding, with plausible near misses', () => {
  const r = getCase('the-portrait-behind-the-wall').rounds[4];
  const a = sheet('the-portrait-behind-the-wall', 4, 'A');
  const b = sheet('the-portrait-behind-the-wall', 4, 'B');
  assert.match(a, /Clara Bellweather and Jonah Reed, married 12 September 1935/);
  assert.doesNotMatch(a, /7:10|7:40/);
  assert.match(b, /personally checked aboard the 7:10 train/);
  assert.match(b, /C482 is a genuine original marriage certificate, unaltered/);
  assert.doesNotMatch(b, /12 September|Clara Bellweather and Jonah Reed, married/);
  const options = r.options.map(answer => ({ answer, marriage: !/did not marry/.test(answer), journey: /7:10 train/.test(answer) }));
  assert.equal(options.filter(o => o.marriage).length, 3, 'certificate alone leaves three journeys');
  assert.equal(options.filter(o => o.journey).length, 2, 'boarding alone leaves two outcomes');
  assert.deepEqual(options.filter(o => o.marriage && o.journey).map(o => o.answer), [r.correct]);
});

test('early rescue passage reveals no later answer or private blind spot', () => {
  const c = getCase('the-last-call');
  const rescue = c.rounds[0].afterDeduction!;
  assert.match(rescue, /By 00:25 he is safe/);
  for (const r of c.rounds.slice(1)) assert.ok(!rescue.includes(r.correct));
  assert.doesNotMatch(rescue, /Carl|wedge|behind the water tank|00:00:40/);
  assert.match(sheet(c.id, 2, 'B'), /extract ending 00:20/);
  assert.match(c.ending.recovery, /finished his tea/);
});
