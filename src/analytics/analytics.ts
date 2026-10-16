import type { CollectionId } from '../monetization/catalogue';

// The only events this app records. Payloads hold stable identifiers and flags, never names,
// clue answers, free text or device identifiers. No remote analytics provider is wired in this
// build; a sink must be added deliberately (see docs/project/MONETIZATION.md).
export type AnalyticsEvent =
  | { name: 'case_started' | 'case_completed' | 'premium_case_started'; case_id: string; collection_id: CollectionId }
  | { name: 'collection_offer_viewed'; collection_id: CollectionId; source: 'library' | 'locked_case' | 'direct' }
  | { name: 'purchase_started'; collection_id: CollectionId }
  | { name: 'purchase_verified' | 'purchase_restored'; collection_id: CollectionId; sandbox: boolean }
  | { name: 'purchase_failed'; collection_id: CollectionId; reason: string };
export type AnalyticsSink = (event: AnalyticsEvent) => void;

const sinks = new Set<AnalyticsSink>();
export function addAnalyticsSink(sink: AnalyticsSink): () => void {
  sinks.add(sink);
  return () => { sinks.delete(sink); };
}
export function track(event: AnalyticsEvent): void {
  for (const sink of sinks) { try { sink(event); } catch { /* analytics never affects play */ } }
}
