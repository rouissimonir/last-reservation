import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, getCase } from '../src/game/cases';
import { freshProgress, investigationReducer as reduce, Progress } from '../src/game/engine';
import { caseRating, hintsText, starsForHints, tierFor, tierInfo } from '../src/game/rating';
import { decodeSave } from '../src/game/storage';

// Plays a whole case, taking `hintsPerRound[i]` hints before answering deduction i.
function solve(caseId: string, hintsPerRound: number[] = [], wrongFirst = false): Progress {
  const item = getCase(caseId);
  let p = reduce(freshProgress(caseId), { type: 'start' });
  item.rounds.forEach((round, i) => {
    p = reduce(reduce(p, { type: 'read', round: i, role: 'A' }), { type: 'read', round: i, role: 'B' });
    for (let h = 0; h < (hintsPerRound[i] ?? 0); h++) p = reduce(p, { type: 'hint', round: i });
    if (wrongFirst) for (const answer of round.options.filter(o => o !== round.correct)) p = reduce(p, { type: 'answer', round: i, answer });
    p = reduce(p, { type: 'answer', round: i, answer: round.correct });
  });
  return p;
}

test('hints trade stars one for one: 0 hints = 3 stars, solution hint = 0', () => {
  assert.deepEqual([0, 1, 2, 3].map(starsForHints), [3, 2, 1, 0]);
  assert.equal(hintsText(0), 'No hints');
  assert.equal(hintsText(1), '1 hint');
  assert.equal(hintsText(2), '2 hints');
});

test('a hint-free case is a Perfect Deduction with a full score; every hint lowers it', () => {
  for (const item of cases) {
    const perfect = caseRating(solve(item.id));
    assert.equal(perfect.tier, 'perfect', item.id);
    assert.equal(perfect.score, 100);
    assert.equal(perfect.stars, perfect.maxStars);
    assert.equal(perfect.complete, true);
    assert.equal(perfect.deductions.length, item.rounds.length);
  }
});

test('no hints, one hint and two hints rate differently on every case', () => {
  for (const item of cases) {
    const none = caseRating(solve(item.id));
    const one = caseRating(solve(item.id, [1]));
    const two = caseRating(solve(item.id, [1, 1]));
    const sameRound = caseRating(solve(item.id, [2]));
    assert.equal(none.tier, 'perfect', item.id);
    assert.notEqual(one.tier, 'perfect', item.id);
    assert.ok(none.score > one.score && one.score > two.score, `${item.id} ${none.score}/${one.score}/${two.score}`);
    assert.equal(one.hints, 1);
    assert.equal(two.hints, 2);
    assert.equal(sameRound.hints, 2);
    assert.equal(one.stars, one.maxStars - 1);
    assert.equal(two.stars, two.maxStars - 2);
  }
});

test('The Missing Envelope: 0, 1, 2 and 3 hints land in four distinct tiers', () => {
  const id = 'the-missing-envelope';
  assert.deepEqual(['perfect', 'sharp', 'steady'], [solve(id), solve(id, [1]), solve(id, [1, 1])].map(p => caseRating(p).tier));
  // Two hints in one deduction and the solution hint everywhere are both below a sharp run.
  assert.equal(caseRating(solve(id, [3, 3, 3])).tier, 'solved');
  assert.equal(caseRating(solve(id, [3, 3, 3])).score, 0);
});

test('wrong answers never change a rating', () => {
  for (const item of cases) assert.deepEqual(caseRating(solve(item.id, [], true)), caseRating(solve(item.id)));
});

test('a rating counts only confirmed deductions; the open deduction is not scored yet', () => {
  let p = reduce(freshProgress(), { type: 'start' });
  assert.equal(caseRating(p).deductions.length, 0);
  assert.equal(caseRating(p).complete, false);
  p = reduce(reduce(p, { type: 'read', round: 0, role: 'A' }), { type: 'read', round: 0, role: 'B' });
  p = reduce(p, { type: 'hint', round: 0 });
  assert.equal(caseRating(p).hints, 0);
  p = reduce(p, { type: 'answer', round: 0, answer: getCase().rounds[0].correct });
  const partial = caseRating(p);
  assert.deepEqual(partial.deductions, [{ hints: 1, stars: 2 }]);
  assert.equal(partial.complete, false);
});

test('tier thresholds', () => {
  assert.equal(tierFor(0, 100), 'perfect');
  assert.equal(tierFor(1, 99), 'sharp');
  assert.equal(tierFor(4, 80), 'sharp');
  assert.equal(tierFor(5, 79), 'steady');
  assert.equal(tierFor(9, 50), 'steady');
  assert.equal(tierFor(10, 49), 'solved');
  for (const info of Object.values(tierInfo)) assert.ok(info.title && info.blurb);
  assert.deepEqual(Object.values(tierInfo).map(t => t.seal), [3, 2, 1, 0]);
});

test('ratings come from the existing save format: old saves rate, and nothing new is stored', () => {
  const p = solve('the-last-reservation', [0, 2]);
  const saved = JSON.parse(JSON.stringify(p));
  assert.deepEqual(Object.keys(saved).sort(), ['caseId', 'confirmed', 'hints', 'read', 'round', 'settings', 'started', 'version']);
  const loaded = decodeSave(JSON.stringify(p), p.caseId);
  assert.equal(loaded.kind, 'loaded');
  if (loaded.kind === 'loaded') assert.deepEqual(caseRating(loaded.progress), caseRating(p));
});
