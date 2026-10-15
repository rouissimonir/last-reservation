import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCase } from '../src/game/cases';
import { canAnswer, evidenceUnlocked, freshProgress, investigationReducer as reduce, nextScene, visibleHints } from '../src/game/engine';

const SP = 'the-silent-piano';
const answers = ['A felt strip laid across the strings', 'Ines Calder', 'The prop store'];

test('Silent Piano walkthrough: fixed A-then-B handoffs, gates, wrong answers, hints and ending', () => {
  const item = getCase(SP);
  let p = freshProgress(SP);
  assert.deepEqual(nextScene(p), { kind: 'intro' });
  assert.strictEqual(reduce(p, { type: 'read', round: 0, role: 'A' }), p, 'cannot read before starting');
  p = reduce(p, { type: 'start' });
  for (let i = 0; i < answers.length; i++) {
    assert.deepEqual(nextScene(p), { kind: 'pass', round: i, role: 'A', revisit: false });
    assert.strictEqual(reduce(p, { type: 'answer', round: i, answer: answers[i] }), p);
    assert.strictEqual(reduce(p, { type: 'hint', round: i }), p);
    if (i + 1 < answers.length) assert.equal(evidenceUnlocked(p, i + 1, 'A'), false);
    p = reduce(p, { type: 'read', round: i, role: 'A' });
    assert.equal(canAnswer(p, i), false);
    assert.deepEqual(nextScene(p), { kind: 'pass', round: i, role: 'B', revisit: false });
    p = reduce(p, { type: 'read', round: i, role: 'B' });
    assert.deepEqual(nextScene(p), { kind: 'discuss' });
    for (const wrong of item.rounds[i].options.filter(o => o !== answers[i])) {
      assert.strictEqual(reduce(p, { type: 'answer', round: i, answer: wrong }), p);
    }
    assert.strictEqual(reduce(p, { type: 'answer', round: i, answer: 'not an option' }), p);
    for (let h = 1; h <= 3; h++) {
      p = reduce(p, { type: 'hint', round: i });
      assert.equal(visibleHints(p, i).length, h);
    }
    assert.strictEqual(reduce(p, { type: 'hint', round: i }), p, 'hints cap at three');
    const done = reduce(p, { type: 'answer', round: i, answer: answers[i] });
    assert.equal(done.round, i + 1);
    assert.strictEqual(reduce(done, { type: 'answer', round: i, answer: answers[i] }), done, 'duplicate submit cannot advance twice');
    assert.deepEqual(visibleHints(done, i), [], 'hints are hidden once the round is confirmed');
    p = done;
  }
  assert.deepEqual(p.confirmed, answers);
  assert.deepEqual(nextScene(p), { kind: 'ending' });
  // Confirmed evidence stays reachable only through explicit revisit, never future rounds.
  assert.equal(evidenceUnlocked(p, 2, 'B'), true);
  assert.equal(evidenceUnlocked(p, 3, 'A'), false);
});

test('Silent Piano revisit of a confirmed sheet changes nothing', () => {
  let p = reduce(freshProgress(SP), { type: 'start' });
  p = reduce(reduce(p, { type: 'read', round: 0, role: 'A' }), { type: 'read', round: 0, role: 'B' });
  p = reduce(p, { type: 'answer', round: 0, answer: answers[0] });
  const again = reduce(p, { type: 'read', round: 0, role: 'A' });
  assert.strictEqual(again, p);
  assert.equal(p.round, 1);
  assert.equal(evidenceUnlocked(p, 1, 'B'), true);
  assert.equal(evidenceUnlocked(p, 0, 'B'), true);
});
