import { getCase } from './cases';
import type { Progress } from './engine';

// Ratings are derived from the hint counts that are already saved with each case, so they need no
// save-format change and existing saves are rated automatically. Wrong answers are deliberately not
// counted: the game promises there is no penalty for trying again.
export const MAX_STARS = 3;
export type Stars = 0 | 1 | 2 | 3;

// Hints themselves stay free; they only trade away stars: 0 hints = 3, 1 = 2, 2 = 1, solution hint = 0.
export function starsForHints(hints: number): Stars {
  return hints <= 0 ? 3 : hints === 1 ? 2 : hints === 2 ? 1 : 0;
}

export const deductionTitle: Record<Stars, string> = { 3: 'Flawless', 2: 'Sharp', 1: 'Steady', 0: 'Guided' };
export function hintsText(hints: number): string {
  return hints <= 0 ? 'No hints' : hints === 1 ? '1 hint' : `${hints} hints`;
}

export type Tier = 'perfect' | 'sharp' | 'steady' | 'solved';
export type DeductionRating = { hints: number; stars: Stars };
export type CaseRating = {
  deductions: DeductionRating[]; // confirmed deductions only
  complete: boolean;
  hints: number;                 // hints revealed across the confirmed deductions
  stars: number;
  maxStars: number;
  score: number;                 // 0–100
  tier: Tier;
};

export const tierInfo: Record<Tier, { title: string; seal: Stars; blurb: string }> = {
  perfect: { title: 'Perfect Deduction', seal: 3, blurb: 'Every deduction, no hints. The Bellweather has rarely seen reasoning this clean.' },
  sharp: { title: 'Sharp Minds', seal: 2, blurb: 'Barely a nudge needed. A hint-free run is within reach.' },
  steady: { title: 'Steady Hands', seal: 1, blurb: 'You leaned on a few hints and still saw it through together.' },
  solved: { title: 'Case Solved', seal: 0, blurb: 'Solved with all the help you needed. Next time, try a deduction without hints.' },
};

export function tierFor(hints: number, score: number): Tier {
  if (hints === 0) return 'perfect';
  return score >= 80 ? 'sharp' : score >= 50 ? 'steady' : 'solved';
}

export function caseRating(p: Progress): CaseRating {
  const total = getCase(p.caseId).rounds.length;
  const deductions = p.hints.slice(0, Math.min(p.round, total)).map(hints => ({ hints, stars: starsForHints(hints) }));
  const hints = deductions.reduce((sum, d) => sum + d.hints, 0);
  const stars = deductions.reduce((sum, d) => sum + d.stars, 0);
  const maxStars = deductions.length * MAX_STARS;
  const score = maxStars === 0 ? 100 : Math.round(100 * stars / maxStars);
  return { deductions, complete: p.round >= total, hints, stars, maxStars, score, tier: tierFor(hints, score) };
}
