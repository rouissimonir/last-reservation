# Release readiness — After Midnight Collection

**Status: NOT release-ready.** Current iOS-first submission work is recorded in `IOS_SUBMISSION.md` and the top of `STATUS.md`. SDK-compatible patches, illustrated covers, launcher branding, Help & Privacy, EAS profiles and release preflight were added in the later checkpoint. TypeScript/lint/55 tests and web/native JavaScript exports passed. Doctor now has one online schema-fetch failure, not dependency drift. Preflight correctly fails on missing publisher configuration, and dependency audit risks remain open. New browser inspection could not attach; no updated screenshot/device claim is made. The tables below record the earlier After Midnight implementation session.

## Verified in this session (16 October 2026, Windows, Node 22.14.0)

| Check | Result |
|---|---|
| `npm run check` (strict TypeScript, Expo ESLint, 51 tests) | Pass, 0 warnings |
| `npm run build:preview` (web export) | Pass, 4 static routes including `/after-midnight`; the web bundle contains no RevenueCat code |
| `npx expo export --platform android --platform ios` | Pass, Hermes JS bundles (not a native build) |
| `npx expo install --check` | Fails on pre-existing patch drift only: `expo` 57.0.29→57.0.30, `expo-router` 57.0.27→57.0.28, `@expo/ui` 57.0.24→57.0.25. The two new packages are accepted. |
| `npx expo-doctor` | 19/21: the same drift, plus the online schema check failed with `fetch failed` |
| Browser, web build on localhost (no preview flag) | Library shows five free cases and three locked paid cases; locked case opens the offer; offer shows no Buy button and a disabled Restore with the "web preview cannot sell or verify" message; no console errors |
| Browser, development preview flag (`expo-web-premium-preview`) | Library marked PREVIEW; The Last Call played start to ending (wrong answer, hint, every handoff, confirmations, ending, "Choose your next mystery"); blur concealed a private sheet without marking it read; reload from a private sheet of The Room That Was Never Booked returned to the library with the sheet unmounted and progress kept |

Screenshots: `docs/screenshots/2026-10-16/`. The offer-unavailable image is a tiled capture artefact of the browser tool; its top-left quarter is the real screen.

**Browser results are not native or device evidence.** They do not establish purchase behaviour, native snapshot privacy, safe areas or system font scaling on a phone.

## Independent code review (AI, read-only)

A separate Claude reviewer read the committed diff (8d293a1..15dbd70). It found no release-build path to a paid case without a verified entitlement, no gated free case, correct RevenueCat 10.14 API use and unchanged existing saves. It reported five defects, all fixed in the follow-up commit:

1. A revoked case kept its scene, so a re-grant could reopen a private sheet without a handoff. Access is now checked above the case; without it the case unmounts entirely and a later grant remounts it at its cover.
2. A slow foreground refresh could overwrite a newer purchase result with pre-purchase data. Snapshots are now ordered (`createSnapshotGate`); stale polls are dropped.
3. A fast double tap could start two store calls. A synchronous in-flight lock is taken before any await (purchase and restore).
4. A deep link to the offer over an open case let the case's Android back handler swallow back. The handler now runs only while the case screen is focused.
5. An unused `ending` offer source was removed.

The provider and gating are not covered by component tests; the gate, lock order and reducer are.

## Mocked or unit-tested only

Entitlement boundaries, the purchase state machine (success, unverified success, cancel, pending then approval, failure, restore found/none/failed, refund/revocation, stale results, double taps), store-error mapping, the unavailable store, the dev-preview guard, analytics events and save isolation are covered by `tests/monetization.test.ts` and `tests/new-cases.test.ts`. They use plain objects in place of the SDK; **no test talks to RevenueCat, StoreKit or Google Play.**

## Required before release (in order)

1. Choose `ios.bundleIdentifier` and `android.package` (`PURCHASE_SETUP.md` step 0).
2. App Store Connect / Play Console agreements, banking and the non-consumable product at USD 4.99 (steps 2–3). Needs you.
3. RevenueCat project, entitlement `after_midnight_collection`, offering `after_midnight` with a Lifetime package, public keys in `.env`/EAS (steps 4–5).
4. Support and privacy URLs live and set; privacy policy names RevenueCat; App Store privacy label and Play Data safety updated (`MONETIZATION.md`).
5. EAS development build and every item of the native checklist in `PURCHASE_SETUP.md`, on a real iPhone and Android device, including refund and reinstall/restore.
6. Paired human playtests of cases 04–08 (two people, one phone, no author docs), recording solve rate, hint use and length. Only then decide whether to state any playtime.
7. Final cover artwork (list in `AFTER_MIDNIGHT_COLLECTION.md`).
8. Decide on the Expo patch updates; rerun Doctor with network access.
9. Release build check that `EXPO_PUBLIC_DEV_PREVIEW_PREMIUM` has no effect.

Nothing was published, pushed, uploaded, purchased or configured in any store or dashboard.
