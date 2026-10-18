import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { cases } from '../src/game/cases';
import { Access, canPlayCase, isDevPreviewEnabled, NO_ACCESS, ownsCollection, verifiedEntitlements } from '../src/monetization/access';
import { AFTER_MIDNIGHT, Collection, collectionOf, collections, FREE_COLLECTION, RECOMMENDED_FIRST_CASE, validateCatalogue } from '../src/monetization/catalogue';
import { safeLink } from '../src/monetization/config';
import { initialPurchaseState, outcomeFromStoreError, PurchaseAction, purchaseReducer, PurchaseState } from '../src/monetization/purchase-state';
import { unavailableService } from '../src/monetization/unavailable';

const ENT = 'after_midnight_collection';
const owner: Access = { entitlements: [ENT], devPreview: false };

test('catalogue: five free cases, three paid, every case in exactly one collection', () => {
  assert.deepEqual(validateCatalogue(), []);
  assert.equal(FREE_COLLECTION.caseIds.length, 5);
  assert.deepEqual(AFTER_MIDNIGHT.caseIds, ['the-room-never-booked', 'the-last-call', 'the-portrait-behind-the-wall']);
  assert.equal(AFTER_MIDNIGHT.entitlementId, ENT);
  assert.equal(AFTER_MIDNIGHT.id, 'after_midnight');
  assert.equal(collections.reduce((n, c) => n + c.caseIds.length, 0), cases.length);
  for (const id of ['the-missing-envelope', 'the-last-reservation', 'the-silent-piano']) assert.equal(collectionOf(id).kind, 'free', id);
  assert.equal(collectionOf(RECOMMENDED_FIRST_CASE).kind, 'free');
});

test('without an entitlement all five free cases play and no paid case does', () => {
  const playable = cases.filter(c => canPlayCase(NO_ACCESS, c.id)).map(c => c.id);
  // Access membership is independent of the library display order.
  assert.deepEqual([...playable].sort(), [...FREE_COLLECTION.caseIds].sort());
  for (const id of AFTER_MIDNIGHT.caseIds) assert.equal(canPlayCase(NO_ACCESS, id), false, id);
  // An unknown or near-miss entitlement unlocks nothing.
  for (const e of ['after_midnight', 'AFTER_MIDNIGHT_COLLECTION', 'premium', '']) {
    assert.equal(ownsCollection({ entitlements: [e], devPreview: false }, AFTER_MIDNIGHT), false, e);
  }
});

test('one verified entitlement unlocks exactly the three After Midnight cases and no future collection', () => {
  const unlocked = cases.filter(c => canPlayCase(owner, c.id) && !canPlayCase(NO_ACCESS, c.id)).map(c => c.id);
  assert.deepEqual(unlocked, [...AFTER_MIDNIGHT.caseIds]);
  const future: Collection = { id: 'after_midnight', title: 'A later collection', kind: 'paid', entitlementId: 'winter_collection', offeringId: 'winter', caseIds: [] };
  assert.equal(ownsCollection(owner, future), false);
  assert.equal(ownsCollection({ entitlements: ['winter_collection'], devPreview: false }, AFTER_MIDNIGHT), false);
});

test('development preview needs a development bundle and the exact flag', () => {
  assert.equal(isDevPreviewEnabled(false, '1'), false);
  assert.equal(isDevPreviewEnabled(undefined, '1'), false);
  assert.equal(isDevPreviewEnabled('true', '1'), false);
  assert.equal(isDevPreviewEnabled(true, undefined), false);
  assert.equal(isDevPreviewEnabled(true, 'true'), false);
  assert.equal(isDevPreviewEnabled(true, '1'), true);
  assert.equal(ownsCollection({ entitlements: [], devPreview: true }, AFTER_MIDNIGHT), true);
});

test('only active, signature-verified entitlements count', () => {
  const ent = (verification: string, isActive = true, isSandbox = false) => ({ identifier: ENT, isActive, isSandbox, verification });
  const info = (e: ReturnType<typeof ent>, top?: string) => ({ entitlements: { active: { [ENT]: e }, verification: top } });
  assert.deepEqual(verifiedEntitlements(info(ent('VERIFIED'))), { ids: [ENT], sandbox: false });
  assert.deepEqual(verifiedEntitlements(info(ent('VERIFIED_ON_DEVICE', true, true))), { ids: [ENT], sandbox: true });
  for (const v of ['FAILED', 'NOT_REQUESTED', 'verified', '']) assert.deepEqual(verifiedEntitlements(info(ent(v))).ids, [], v);
  assert.deepEqual(verifiedEntitlements(info(ent('VERIFIED', false))).ids, []);
  // A key that does not match the entitlement's own identifier is ignored.
  assert.deepEqual(verifiedEntitlements({ entitlements: { active: { other: ent('VERIFIED') } } }).ids, []);
  assert.deepEqual(verifiedEntitlements({ entitlements: { active: {} } }).ids, []);
});

const run = (actions: PurchaseAction[], from: PurchaseState = initialPurchaseState) => actions.reduce(purchaseReducer, from);
const ready = run([{ type: 'offer-loaded', offer: { packageId: '$rc_lifetime', priceString: '£4.99' } }]);
const snap = (ids: string[], sandbox = false) => ({ ids, sandbox });

test('purchase: verified success unlocks; success without the entitlement stays locked', () => {
  const s = run([{ type: 'purchase-started' }, { type: 'purchase-finished', outcome: { kind: 'success', snapshot: snap([ENT], true) }, entitlementId: ENT }], ready);
  assert.equal(s.activity, 'purchased');
  assert.deepEqual(s.entitlements, [ENT]);
  assert.equal(s.sandbox, true);
  const u = run([{ type: 'purchase-started' }, { type: 'purchase-finished', outcome: { kind: 'success', snapshot: snap([]) }, entitlementId: ENT }], ready);
  assert.equal(u.activity, 'unverified');
  assert.equal(ownsCollection({ entitlements: u.entitlements, devPreview: false }, AFTER_MIDNIGHT), false);
});

test('purchase: cancel, failure and pending never grant access; pending completes through the listener', () => {
  const c = run([{ type: 'purchase-started' }, { type: 'purchase-finished', outcome: { kind: 'cancelled' }, entitlementId: ENT }], ready);
  assert.equal(c.activity, 'cancelled');
  assert.deepEqual(c.entitlements, []);
  const f = run([{ type: 'purchase-started' }, { type: 'purchase-finished', outcome: { kind: 'failed', failure: 'network' }, entitlementId: ENT }], ready);
  assert.equal(f.activity, 'failed');
  assert.equal(f.failure, 'network');
  const p = run([{ type: 'purchase-started' }, { type: 'purchase-finished', outcome: { kind: 'pending' }, entitlementId: ENT }], ready);
  assert.equal(p.activity, 'pending');
  assert.deepEqual(p.entitlements, []);
  const later = purchaseReducer(p, { type: 'entitlements', snapshot: snap([ENT]), entitlementId: ENT });
  assert.equal(later.activity, 'purchased');
  assert.deepEqual(later.entitlements, [ENT]);
});

test('purchase: no start without a ready offer, no double start, stale results ignored', () => {
  assert.equal(purchaseReducer(initialPurchaseState, { type: 'purchase-started' }), initialPurchaseState);
  const unavailable = run([{ type: 'offer-unavailable', reason: 'web' }]);
  assert.equal(purchaseReducer(unavailable, { type: 'purchase-started' }), unavailable);
  const started = purchaseReducer(ready, { type: 'purchase-started' });
  assert.equal(purchaseReducer(started, { type: 'purchase-started' }), started);
  assert.equal(purchaseReducer(started, { type: 'restore-started' }), started);
  assert.equal(purchaseReducer(started, { type: 'dismiss' }), started);
  const stale = purchaseReducer(ready, { type: 'purchase-finished', outcome: { kind: 'success', snapshot: snap([ENT]) }, entitlementId: ENT });
  assert.equal(stale, ready);
});

test('restore, refund and revocation follow the store, and entitlements are replaced, not merged', () => {
  const restored = run([{ type: 'restore-started' }, { type: 'restore-finished', snapshot: snap([ENT]), entitlementId: ENT }], ready);
  assert.equal(restored.activity, 'restored');
  const none = run([{ type: 'restore-started' }, { type: 'restore-finished', snapshot: snap([]), entitlementId: ENT }], ready);
  assert.equal(none.activity, 'nothing-restored');
  const failed = run([{ type: 'restore-started' }, { type: 'restore-failed' }], ready);
  assert.equal(failed.activity, 'restore-failed');
  const refunded = purchaseReducer(restored, { type: 'entitlements', snapshot: snap([]), entitlementId: ENT });
  assert.deepEqual(refunded.entitlements, []);
  assert.equal(ownsCollection({ entitlements: refunded.entitlements, devPreview: false }, AFTER_MIDNIGHT), false);
  const other = purchaseReducer(restored, { type: 'entitlements', snapshot: snap(['winter_collection']), entitlementId: ENT });
  assert.deepEqual(other.entitlements, ['winter_collection']);
  assert.equal(purchaseReducer(failed, { type: 'dismiss' }).activity, 'idle');
});

test('store errors map to calm, specific outcomes', () => {
  assert.deepEqual(outcomeFromStoreError({ code: '1' }), { kind: 'cancelled' });
  assert.deepEqual(outcomeFromStoreError({ code: '0', userCancelled: true }), { kind: 'cancelled' });
  assert.deepEqual(outcomeFromStoreError({ code: '20' }), { kind: 'pending' });
  assert.deepEqual(outcomeFromStoreError({ code: '10' }), { kind: 'failed', failure: 'network' });
  assert.deepEqual(outcomeFromStoreError({ code: '3' }), { kind: 'failed', failure: 'not-allowed' });
  assert.deepEqual(outcomeFromStoreError({ code: '6' }), { kind: 'failed', failure: 'already-owned' });
  assert.deepEqual(outcomeFromStoreError(new Error('boom')), { kind: 'failed', failure: 'unknown' });
  assert.deepEqual(outcomeFromStoreError(undefined), { kind: 'failed', failure: 'unknown' });
});

test('an unavailable store never sells, restores or grants anything', async () => {
  for (const reason of ['web', 'expo-go', 'not-configured'] as const) {
    const service = unavailableService(reason);
    assert.equal(service.unavailable, reason);
    assert.equal(await service.loadOffer('after_midnight'), null);
    assert.equal((await service.purchase('after_midnight', '$rc_lifetime')).kind, 'failed');
    assert.deepEqual((await service.restore()).ids, []);
    assert.deepEqual((await service.refresh()).ids, []);
  }
});

const files = (dir: string): string[] => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});
const source = files(join(__dirname, '..', 'src')).filter(f => /\.(ts|tsx)$/.test(f));
const read = (f: string) => readFileSync(f, 'utf8');

test('no purchase bypass: ownership is never stored locally and the preview flag has one guarded reader', () => {
  const storageUsers = source.filter(f => /from '@react-native-async-storage\/async-storage'/.test(read(f))).map(f => f.replace(/\\/g, '/').split('/src/')[1]);
  // Case saves and sound preferences are the only stored data; neither may mention ownership.
  assert.deepEqual(storageUsers, ['game/use-investigation.ts', 'sound/sound-provider.tsx']);
  const soundFiles = source.filter(f => f.replace(/\\/g, '/').includes('/src/sound/'));
  assert.ok(soundFiles.length >= 3);
  for (const f of soundFiles) assert.doesNotMatch(read(f), /entitlement|purchase|owned|collection/i, f);
  const flagReaders = source.filter(f => read(f).includes('EXPO_PUBLIC_DEV_PREVIEW_PREMIUM')).map(f => f.replace(/\\/g, '/').split('/src/')[1]);
  assert.deepEqual(flagReaders, ['monetization/config.ts']);
  const provider = read(source.find(f => f.endsWith('purchases-provider.tsx'))!);
  assert.match(provider, /isDevPreviewEnabled\(isDev, purchaseConfig\.devPreviewFlag\)/);
  assert.match(provider, /const isDev = typeof __DEV__ !== 'undefined' && __DEV__;/);
  // The web bundle never loads the native SDK, and nothing else does either.
  const sdkUsers = source.filter(f => /from 'react-native-purchases'/.test(read(f))).map(f => f.replace(/\\/g, '/').split('/src/')[1]);
  assert.deepEqual(sdkUsers, ['monetization/service.native.ts']);
  // Author-only docs are never imported.
  for (const f of source) assert.doesNotMatch(read(f), /from ['"][^'"]*docs\//, f);
});

test('support and privacy links must be https', () => {
  assert.equal(safeLink('https://example.org/privacy'), 'https://example.org/privacy');
  for (const bad of [undefined, '', 'http://example.org', 'javascript:alert(1)', 'not a url']) assert.equal(safeLink(bad), null, String(bad));
});

test('a stale polled snapshot cannot overwrite a newer purchase, restore or listener result', async () => {
  const { createSnapshotGate } = await import('../src/monetization/purchase-state');
  const gate = createSnapshotGate();
  // Refresh sent, then a purchase completes before the refresh answers: the old answer is dropped.
  let ticket = gate.begin();
  gate.hold();
  assert.equal(gate.busy, true);
  assert.equal(gate.accept(ticket), false);
  gate.release();
  assert.equal(gate.accept(ticket), false);
  // A refresh while a purchase is in flight is dropped too.
  gate.hold();
  ticket = gate.begin();
  assert.equal(gate.accept(ticket), false);
  gate.release();
  // A listener push between request and answer wins.
  ticket = gate.begin();
  gate.advance();
  assert.equal(gate.accept(ticket), false);
  // With nothing newer, a refresh (for example a refund noticed on resume) is applied.
  ticket = gate.begin();
  assert.equal(gate.accept(ticket), true);
  assert.equal(gate.busy, false);
});

test('the provider takes the in-flight lock synchronously before any await', () => {
  const provider = read(source.find(f => f.endsWith('purchases-provider.tsx'))!);
  const body = provider.slice(provider.indexOf('const purchase = useCallback'), provider.indexOf('const restore = useCallback'));
  assert.ok(body.indexOf('gate.busy') < body.indexOf('gate.hold()') && body.indexOf('gate.hold()') < body.indexOf('await'), 'guard, then hold, then await');
});
