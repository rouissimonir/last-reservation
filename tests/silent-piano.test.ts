import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, getCase, validateCase } from '../src/game/cases';
import { silentPiano } from '../src/game/silent-piano';

const text = (r: (typeof silentPiano.rounds)[number], role: 'A' | 'B') =>
  r.evidence[role].paragraphs.join('\n');
const facts = (role: 'A' | 'B', i: number) => text(silentPiano.rounds[i], role);

test('third case is registered once with its own identity and valid references', () => {
  // The catalogue has grown since this case was added; it must still appear exactly once, third.
  assert.equal(cases.filter(c => c.id === 'the-silent-piano').length, 1);
  assert.equal(cases[2], silentPiano);
  assert.equal(getCase('the-silent-piano'), silentPiano);
  assert.equal(new Set(cases.map(c => c.id)).size, cases.length);
  assert.deepEqual(validateCase(silentPiano), []);
  assert.equal(silentPiano.rounds.length, 3);
  assert.deepEqual(silentPiano.rounds.map(r => r.id), ['SP1', 'SP2', 'SP3']);
});

test('every deduction has a single supported answer from the two private sheets together', () => {
  // SP1: observations (A) intersect the maker chart (B).
  const causes = [
    { name: 'A felt strip laid across the strings', keysFree: true, dampersLift: true },
    { name: 'The action was wedged locked', keysFree: false, dampersLift: true },
    { name: 'The dampers were clipped down', keysFree: true, dampersLift: false },
  ];
  assert.match(facts('A', 0), /Every key moved freely/);
  assert.doesNotMatch(facts('A', 0), /damper/i);
  assert.match(facts('B', 0), /every damper lifted cleanly/);
  assert.match(facts('B', 0), /did not test the keys/);
  const chart = facts('B', 0);
  assert.match(chart, /Felt strip across the strings · Keys move freely · Dampers lift/);
  assert.match(chart, /Action wedged locked · Keys resist or will not go down · Dampers lift/);
  assert.match(chart, /Dampers clipped down · Keys move freely · Dampers do not lift/);
  const sp1 = causes.filter(c => c.keysFree && c.dampersLift).map(c => c.name);
  assert.deepEqual(sp1, [silentPiano.rounds[0].correct]);
  // Each sheet alone leaves two causes; the options name mechanisms, so neither investigator can finish alone.
  assert.equal(causes.filter(c => c.keysFree).length, 2);
  assert.equal(causes.filter(c => c.dampersLift).length, 2);

  // SP2: near the piano at 20:09 and carrying the confirmed item.
  const people = [
    { name: 'Ines Calder', from: '19:55', to: '20:10', item: 'felt strip' },
    { name: 'Hugo Lang', from: '20:08', to: '20:11', item: 'wooden wedges' },
    { name: 'Marguerite Doyle', from: '20:12', to: '20:25', item: 'felt strip' },
  ];
  for (const p of people) assert.ok(facts('B', 1).includes(`${p.name}`) && facts('B', 1).includes(`${p.from} to ${p.to}`) && facts('B', 1).includes(p.item), p.name);
  assert.match(facts('A', 1), /20:09/);
  const near = people.filter(p => p.from <= '20:09' && '20:09' <= p.to);
  assert.equal(near.length, 2);
  assert.deepEqual(near.filter(p => p.item === 'felt strip').map(p => p.name), [silentPiano.rounds[1].correct]);
  // Each filter alone must leave more than one candidate, so neither sheet (nor SP1) can be skipped.
  assert.equal(people.filter(p => p.item === 'felt strip').length, 2, 'record sheet alone is not enough');
  assert.equal(near.length, 2, 'time alone is not enough');
  // Hugo's exit (SP-B3) must lie inside his presence window (SP-B2).
  const hugo = people[1];
  assert.match(facts('B', 2), /Hugo Lang left at 20:11/);
  assert.ok(hugo.from <= '20:11' && '20:11' <= hugo.to);
  // Ines's exit equals the end of her window.
  assert.match(facts('B', 2), /Ines Calder left at 20:10/);
  assert.equal(people[0].to, '20:10');
  // The page is tied to the folder: on the desk at 20:05, bare at 20:25, only paper out was Ines's folder.
  assert.match(facts('A', 1), /last page of his score, with a large pencilled VII in its corner, was on the music desk/);
  assert.match(facts('A', 1), /20:25, when the desk was bare/);
  assert.match(facts('A', 2), /pencilled VII showed at the corner of the printed music/);
  assert.match(facts('B', 2), /only paper carried out by anyone was the flat folder Ines took/);

  // SP3: handle and steps from the porter against the exhaustive plan, with the first leaver being Ines.
  const rooms = [
    { name: 'The prop store', handle: 'Brass', steps: 'Three' },
    { name: 'The green room', handle: 'Brass', steps: 'Five' },
    { name: 'The instrument cupboard', handle: 'Iron', steps: 'Three' },
  ];
  for (const r of rooms) assert.ok(facts('B', 2).includes(`${r.name.replace('The ', '').replace(/^./, m => m.toUpperCase())} · ${r.handle} handle · ${r.steps} steps up`), r.name);
  assert.match(facts('A', 2), /brass handle/);
  assert.match(facts('A', 2), /exactly three steps/);
  assert.match(facts('B', 2), /Ines Calder left at 20:10/);
  const match = rooms.filter(r => r.handle === 'Brass' && r.steps === 'Three').map(r => r.name);
  assert.deepEqual(match, [silentPiano.rounds[2].correct]);
  assert.equal(rooms.filter(r => r.handle === 'Brass').length, 2);
  assert.equal(rooms.filter(r => r.steps === 'Three').length, 2);
});

test('no sheet names its own answer, and no sheet leaks a later answer', () => {
  silentPiano.rounds.forEach((round, i) => {
    for (const role of ['A', 'B'] as const) {
      const sheet = text(round, role).toLowerCase();
      for (let j = i; j < silentPiano.rounds.length; j++) {
        const target = silentPiano.rounds[j];
        const answer = target.correct.toLowerCase();
        // A sheet may list every candidate (a roster); it must not single out the answer on its own.
        const roster = target.options.every(o => sheet.includes(o.toLowerCase()));
        if (j === i && roster) continue;
        assert.ok(!sheet.includes(answer), `${round.id}/${role} reveals the answer to ${target.id}`);
      }
    }
  });
  // Neither role alone carries enough: each key discriminator appears in only one role's sheet.
  assert.doesNotMatch(facts('A', 0), /Dampers clipped down|Felt strip across/);
  assert.doesNotMatch(facts('B', 0), /Tomas|moved freely and came back/);
  assert.doesNotMatch(facts('A', 1), /felt strip|wedges|spring clips/i);
  assert.doesNotMatch(facts('A', 2), /Prop store|Green room|Instrument cupboard/i);
});

test('hints escalate, stay accurate and only the last names the answer', () => {
  silentPiano.rounds.forEach(round => {
    assert.equal(round.hints.length, 3);
    assert.equal(new Set(round.hints).size, 3);
    const answerWords = round.correct.replace(/^(A|The) /, '').toLowerCase();
    assert.ok(!round.hints[0].toLowerCase().includes(answerWords), `${round.id} hint 1 names the answer`);
    assert.ok(round.hints[2].toLowerCase().includes(answerWords.split(' ')[0]), `${round.id} final hint names the answer`);
    assert.ok(round.proof.length > 40 && round.deduction.length > 10);
  });
  assert.match(silentPiano.rounds[1].hints[2], /Marguerite arrived at 20:12/);
  assert.match(silentPiano.rounds[2].hints[2], /prop store/i);
});

test('motive appears only in the ending note, not in any deduction or sheet', () => {
  const body = silentPiano.rounds.map(r => [r.deduction, r.proof, ...r.hints, text(r, 'A'), text(r, 'B')].join('\n')).join('\n').toLowerCase();
  for (const word of ['teacher', 'credit', 'motive']) assert.ok(!body.includes(word), word);
  assert.match(silentPiano.ending.note, /teacher/);
  assert.match(silentPiano.ending.conclusion, /not her reason/);
});
