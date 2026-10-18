import { cases } from '../game/cases';

// Collection membership is kept apart from case content, progress and purchase state.
// Identifiers here are stable: changing one would strand saves or a store configuration.
export type CollectionId = 'bellweather_files' | 'after_midnight';
export type Collection = {
  id: CollectionId; title: string; kind: 'free' | 'paid';
  // RevenueCat identifiers. Null for the free collection. See docs/project/PURCHASE_SETUP.md.
  entitlementId: string | null; offeringId: string | null;
  caseIds: readonly string[];
};

export const FREE_COLLECTION: Collection = {
  id: 'bellweather_files', title: 'The Bellweather Files', kind: 'free', entitlementId: null, offeringId: null,
  caseIds: ['the-last-reservation', 'the-silent-piano', 'the-masquerade-coat', 'the-music-box', 'the-missing-envelope'],
};
export const AFTER_MIDNIGHT: Collection = {
  id: 'after_midnight', title: 'After Midnight Collection', kind: 'paid',
  entitlementId: 'after_midnight_collection', offeringId: 'after_midnight',
  caseIds: ['the-room-never-booked', 'the-last-call', 'the-portrait-behind-the-wall'],
};
export const collections: readonly Collection[] = [FREE_COLLECTION, AFTER_MIDNIGHT];
export const RECOMMENDED_FIRST_CASE = 'the-last-reservation';

export function collectionOf(caseId: string): Collection {
  const found = collections.find(item => item.caseIds.includes(caseId));
  if (!found) throw new Error('Case has no collection');
  return found;
}
export const isPaidCase = (caseId: string) => collectionOf(caseId).kind === 'paid';

export function validateCatalogue(): string[] {
  const errors: string[] = [];
  const known = new Set(cases.map(item => item.id));
  const seen = new Map<string, CollectionId>();
  const entitlements = new Set<string>();
  for (const collection of collections) {
    if (collection.kind === 'paid' && (!collection.entitlementId || !collection.offeringId)) errors.push(`Paid collection without store ids ${collection.id}`);
    if (collection.kind === 'free' && (collection.entitlementId || collection.offeringId)) errors.push(`Free collection with store ids ${collection.id}`);
    if (collection.entitlementId) {
      if (entitlements.has(collection.entitlementId)) errors.push(`Shared entitlement ${collection.entitlementId}`);
      entitlements.add(collection.entitlementId);
    }
    for (const id of collection.caseIds) {
      if (!known.has(id)) errors.push(`Unknown case ${collection.id}:${id}`);
      if (seen.has(id)) errors.push(`Case in two collections ${id}`);
      seen.set(id, collection.id);
    }
  }
  for (const id of known) if (!seen.has(id)) errors.push(`Case without collection ${id}`);
  if (!FREE_COLLECTION.caseIds.includes(RECOMMENDED_FIRST_CASE)) errors.push('Recommended case is not free');
  return errors;
}
