import type { AnalyticsEvent } from '../analytics/analytics';
import { collectionOf } from '../monetization/catalogue';
import { getCase } from './cases';
import type { Progress } from './engine';

// Domain transitions worth recording. Derived from progress, so revisits, hints and wrong answers
// produce nothing, and neither do clue text or chosen answers.
export function caseEvents(before: Progress, after: Progress): AnalyticsEvent[] {
  const collection = collectionOf(after.caseId);
  const base = { case_id: after.caseId, collection_id: collection.id };
  const events: AnalyticsEvent[] = [];
  if (!before.started && after.started) {
    events.push({ name: 'case_started', ...base });
    if (collection.kind === 'paid') events.push({ name: 'premium_case_started', ...base });
  }
  const total = getCase(after.caseId).rounds.length;
  if (before.round < total && after.round === total) events.push({ name: 'case_completed', ...base });
  return events;
}
