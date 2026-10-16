# TWO SIDES — status

Authoritative status, 16 October 2026 · Windows. Earlier history: `docs/STATUS.md`, `THIRD_CASE_REPORT.md`.

## Latest privacy and native-link checkpoint

See `PRIVACY_AND_LINK_CHECKPOINT.md` and `PRIVACY_DATA_INVENTORY.md`. Corrected inaccurate RevenueCat store-disclosure instructions and clarified SDK startup traffic in Help. Added three evidenced minimum app-level required-reason declarations and preflight/provenance/Expo-merge checks; final archive/privacy-label verification is still required. Added a native external-link whitelist that sends only bounded canonical public routes to Router, with actual SDK registration/event tests. This is an entry-point mitigation, not a cleared dependency advisory or a protection claim for web/Expo Go preprocessing.

`npm run check` passes **75 tests** (62 domain/config + 13 component/SDK tests), TypeScript and lint. Web and both native JS exports pass; source maps confirm the native filter is included. Dependency alignment passes. Latest Doctor now fails **two online checks (19/21)**: schema fetch and React Native Directory metadata. Release preflight still correctly fails on four missing publisher fields. No dependencies, case content, saves, entitlement rules or supplied art changed. The updated Help privacy section was inspected at 375×667 with an actual JPEG capture; no horizontal overflow or browser warnings/errors. Signed device/sandbox/human/owner gates remain open.

## Latest regression checkpoint

See `SUBMISSION_REGRESSION.md` for current evidence. Fixed route-focus private-sheet unmounting and the reproduced Help → collection → “Back to the cases” destination bug. Added 11 real component tests alongside the unchanged 55 domain/configuration tests; `npm run check` passes all **66**. `test:ci` now runs both suites once and exits. The compatible renderer is pinned to 1.2.0; full dependency-tree validation has no problems. Web and iOS/Android JS exports pass; source maps show no test-tool modules in native exports. Expo alignment passes; Doctor still fails one online schema fetch.

The production browser is now attached and inspected at 375×667 and 390×844. Artwork, Help/offer navigation, locked web purchases, private readiness/reload and scoped QA reset were verified. Ten actual JPEG captures are in `docs/screenshots/2026-10-16/submission/`; the private-sheet capture contains a spoiler. These supersede the earlier “browser inspection pending” entry below. No device/sandbox/human evidence is claimed. Latest full audit is 65 advisories (49 high, 16 moderate) after adding test tooling; no clean-security claim. Publisher details and the remaining gates in IOS_SUBMISSION.md are still required.

## Current submission polish checkpoint — iOS first

The user's current goal is submission readiness, superseding the historical two-case overnight boundary. **Not submission-ready yet.** The active Git root is now the nested app directory (`git rev-parse --show-toplevel` verified), not the old outer repository. No parent work was changed.

Completed in this checkpoint:

- Compatible SDK-57 patches: Expo 57.0.30, Router 57.0.28, Expo UI 57.0.25. Lockfile root dependencies/devDependencies match package.json. A clean `npm ci --ignore-scripts` followed by `npm rebuild` completed successfully.
- Original navy/brass/two-evidence-leaf launcher identity, splash and favicon; no Expo template logo remains referenced by app.json. iOS inherits the opaque 1024px RGB icon; initial build number 1, portrait iPhone configuration.
- Six transparent generated cover illustrations replace the temporary native shapes for cases 03–08. Originals and 640px RGBA runtime exports are real repository files. Exact prompts and built-in imagegen provenance: `assets/art/covers/PROMPTS.md`. Existing game art, all authored case content, save keys and entitlement rules are preserved.
- Help & Privacy route linked from the library; instructions, local save/reset behavior, accessibility and restore guidance. Configured public links have error feedback. Case lengths show true deduction counts without unvalidated time claims.
- EAS development/preview/production profiles, production preview flag 0, and a real `release:preflight` command with four new negative/configuration tests. No build/account/store configuration or upload was performed.
- iOS gate register and spoiler-free store-copy draft: `IOS_SUBMISSION.md`, `IOS_STORE_COPY.md`. Dependency risk assessment: `SECURITY_REVIEW.md`.

Actual final checks:

| Check | Result |
| --- | --- |
| `npm run check` | PASS: strict TypeScript, Expo lint, **55 tests**, no skipped tests |
| `npm run build:preview` | PASS: five static routes including `/help` and `/after-midnight` |
| iOS + Android Expo export | PASS: Hermes JavaScript bundles and all six illustrated runtime assets; **not native binaries** |
| `npx expo install --check` | PASS: dependencies up to date |
| `npx expo-doctor` | FAIL: one online app-config schema fetch (`fetch failed`); no check disabled |
| `npm run release:preflight` | FAIL intentionally: permanent iOS bundle id, Apple RevenueCat public SDK key, support URL and privacy URL are missing |
| Dependency audit | 30 advisories remain (19 high, 11 moderate); compatibility-only fix attempt did not clear them; see SECURITY_REVIEW.md |
| Visual asset inspection | All six subjects and alpha checked; runtime exports total about 2.44MB; no clue text |
| New browser inspection | NOT completed: browser webview attachment timed out; an open request for the local production preview was queued. Historical screenshots do not prove this new layout. |

Local development server is running at localhost:8097. A loopback-only static preview of the completed web export is also running at 127.0.0.1:8098 for the queued browser inspection. Neither publishes the app externally. Existing 8081 process was not stopped.

Still required: publisher details (user selected iOS first and will provide them), live policy/support pages, App Store/RevenueCat setup, signed iPhone and sandbox purchase tests, new UI/device accessibility inspection, human paired playtests, final store screenshots and the open dependency assessment. Keep the goal active; do not describe the app as submission-ready on local tests alone.

## After Midnight Collection and five-case free catalogue (this checkpoint)

Implemented:

- Free collection "The Bellweather Files": The Missing Envelope, The Last Reservation, The Silent Piano (unchanged; digests and save keys pinned) plus two new cases, **The Masquerade Coat** (04) and **The Music Box** (05).
- Paid "After Midnight Collection": **The Room That Was Never Booked** (06), **The Last Call at Midnight** (07), **The Portrait Behind the Wall** (08), five deductions each, distinct mechanics. One entitlement, `after_midnight_collection`, unlocks exactly these three.
- RevenueCat (`react-native-purchases` 10.14.0, `expo-dev-client`, installed with `npx expo install`): localized price, purchase, cancel, pending, failure, unverified, restore, listener and foreground refresh for refunds/revocations; trusted-entitlement verification; Expo Go and web treated as unavailable; no stored ownership flag; development preview only in `__DEV__` bundles with an explicit flag.
- Library with free/paid sections and a first-case recommendation; offer screen at `/after-midnight` with honest loading/unavailable/pending/cancelled/failed/success states, Restore Purchases, close, support/privacy links when configured; "Choose your next mystery" on endings; temporary native cover objects; local analytics event layer with no remote sink.

Changed files: `src/game/{case,cases}.ts`, new case files, `src/game/{presentation,case-events}.ts`, `src/game/use-investigation.ts`, `src/game/tokens.ts`, `src/components/{investigation,case-library,game-ui}.tsx`, new `case-emblem.tsx`, `collection-offer.tsx`, `src/app/{_layout,after-midnight}.tsx`, `src/monetization/*`, `src/analytics/analytics.ts`, tests, `package.json`/lockfile, `.env.example`, docs.

Checks, screenshots and what remains: `docs/project/RELEASE_READINESS.md`. Short version: all local checks pass except pre-existing Expo patch drift and an offline Doctor schema fetch; AI blind solves (two rounds) found every intended answer after fixes; **no native purchase test and no human playtest has been done**, and app identifiers, store products and RevenueCat setup need your accounts (`PURCHASE_SETUP.md`). Not release-ready.

Documents: `MONETIZATION.md`, `AFTER_MIDNIGHT_COLLECTION.md`, `PURCHASE_SETUP.md`, `RELEASE_READINESS.md`, `BACKLOG.md`, `cases/*.md` (author-only).

## The Silent Piano (previous checkpoint)

Unchanged except its cover now uses a native piano emblem instead of the borrowed envelope. See `THIRD_CASE_REPORT.md`.
