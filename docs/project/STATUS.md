# TWO SIDES — status

## Latest: hint ratings and animations (19 October 2026)

Added a hint-based rating (0 hints = 3 stars … solution hint = 0 per deduction; case tiers Perfect Deduction / Sharp Minds / Steady Hands / Case Solved), shown in the hint panel, on each confirmed deduction, as an animated seal on the resolution screen and as a badge on the case card. Added motion throughout (launch title card, library, cover, roles, selection, wrong answer, hints, confirmation, resolution) and two sound cues. Ratings derive from the saved hint counts, so there is **no save change**; reduced motion skips or flattens everything. `npm run check` PASS (typecheck, lint, notices, 86 domain + 34 component tests; new: rating rules for all eight cases, real-screen rating flows, launch card). `npm run audio:check` PASS. Web export built and played in desktop Chromium: no console errors; launch card, hint panel, stamp, three seal tiers captured. Not verified: native devices, haptics, audio by ear, low-end performance. Details: `GAMIFICATION.md`.

## Latest: free-case tally in the library (20 October 2026)

The free section of the library now says "N of 5 free cases solved" once at least one free case is solved, derived from the existing case saves (no new storage, no change to ids, content or entitlements; paid cases are not counted). `npm run check` PASS (91 domain + 37 component tests; one new screen test), TypeScript and lint pass. Not checked in a browser or on a device this pass.

## Fix: entrance crashed in Expo Go (20 October 2026)

On a real iPhone in Expo Go the first release of the entrance threw `Invariant Violation: Transform origin z-position must be a number. Passed value: 6%` (reported by the publisher), because the `transformOrigin: '50.6% 89.6%'` string was not parsed there. The hinge is now plain translate/rotate/translate offsets from the emblem centre; no `transformOrigin` remains in `src/`. Re-checked in the web build (same swing, drift and slow return, no console errors), TypeScript and lint pass. The native runtime has not been re-run here: the publisher should confirm on the phone. The earlier note below that called `transformOrigin` an open native check is superseded.

## Latest: animated entrance emblem and personal bests (20 October 2026)

Builds on the unreviewed hint-rating/motion branch (`claude/game-animations-hint-gamification-mk744f`, merged in). **Entrance:** the launch card now shows the brass keyhole emblem. Its ivory leaf swings open on a hinge at the seam's foot, drifts, then returns slowly to its place while TWO and SIDES glide in with it; the seam flares as they meet, then the rule and tagline follow. About 4.7 s, tap to skip, once per app start, skipped entirely under reduced motion. Native React Native `Animated` only (native driver on iOS/Android). The two leaves are a straight crop of the existing `splash-mark.png` along its seam (`scripts/export-launch-halves.py`, output `assets/brand/v2/launch/`), no new artwork. **Personal bests:** each case keeps its best rating and solve count under its own key `two-sides/<case id>/record/v1`, so replaying no longer forgets the best run (the gap noted in `GAMIFICATION.md`). The ending says "New personal best" or shows the best; the library card shows the best. Case keys, save format, ids and content are unchanged; unreadable records are never replaced.

Actual results: `npm run check` PASS (91 domain + 36 component tests; new: 5 record tests, 2 personal-best screen tests). `npm run build:preview` PASS. `npx expo install --check` and Doctor's two online checks could not run: this cloud container's proxy returned 403 for Expo's API (Doctor 19/21, both failures network). `package.json` and the lockfile are unchanged. Browser (Expo web dev server, headless Chromium 390×844): frames every 250 ms show the swing, drift and slow return with the words; reduced motion shows the library directly; no console warnings or errors. Frames: `docs/screenshots/2026-10-20/launch/`. Not native or device evidence: the hinge `transformOrigin`, native-driver timing and low-end performance need a device build, and nobody has judged the motion yet.

## Latest: iPhone-framed screenshot drafts (19 October 2026)

Generated an empty hardware-only iPhone-style frame and integrated it through the existing renderer around all five unchanged web captures. New 1320×2868 RGB drafts, ordered manifest and contact sheet live in `store/ios/screenshots-iphone-drafts/`; original set/raw captures preserved. Geometry and lossless-composite checks protect the real game pixels; camera hardware never covers content. Native iOS layout comparison remains pending because the publisher has not built yet. Frames are a presentation choice, not evidence of native accuracy or App Review approval. See `IPHONE_SCREENSHOT_FRAMES.md`; no runtime/store/upload change.

## Latest: App Store Connect API credentials (19 October 2026)

The publisher-supplied separate API key is saved and validates after reload: correct format plus permissions to list apps/get subscription info. Official CLI confirms both Apple credential flags true for the existing app/bundle. Optional vendor number remains blank. No App Store product/metadata change or native transaction occurred; key contents were not printed or committed. `APP_STORE_CONNECT_KEY_CHECKPOINT.md` records proof, plugin discovery and remaining store/native gates. Earlier missing-API-key statements are historical; unrelated licensing/release edits preserved.

## Latest: Apple In-App Purchase credentials (19 October 2026)

Uploaded the publisher-supplied In-App Purchase `.p8` file and identifiers to the existing TWO SIDES RevenueCat App Store app, under explicit authorization. Persisted/reloaded dashboard validation shows valid key format and permissions; missing-key banner cleared. Official CLI reports `subscription_key_configured: true` with bundle `com.monirrouissi.twosides`. The separate App Store Connect API key remains false. See `APPLE_PURCHASE_KEY_CHECKPOINT.md` and its screenshot for evidence and remaining native/store gates. No secret, app code or unrelated release/licensing work included in the scoped checkpoint; latest app checks remain those of the unchanged visual-assets build below.

## Latest: App Store visual assets (19 October 2026)

New ImageGen brass keyhole logo with two facing ivory/burgundy profiles; configured 1024px opaque icon and transparent splash/adaptive/monochrome plus favicon exports. Original brand/game artwork is preserved. Five 1320×2868 screenshot layout drafts show real production-web cover, private Witness clue, neutral handoff, hint 1 and free library. They carry explicit draft markings and false native/submission readiness flags; final iPhone captures and native icon/splash checks require a native build/macOS or device. No fabricated gameplay or claim of native validation. Prompts, raw captures, hashes, scripts, contact sheet and handoff: `APP_STORE_ASSETS.md` and `store/ios/screenshots-drafts/README.md`.

TypeScript/lint/notices, 103 tests, image format/hash checks and dependency alignment pass. Doctor still fails its online schema fetch (20/21); preflight still needs real support/privacy URLs. No game/case/save/purchase changes or new dependencies. Earlier release/licensing work excluded from the scoped local commit; no push/upload/submission.

## Latest: publisher-confirmed Apple identity (18 October 2026)

Final explicit name/subtitle: TWO SIDES: Co-op Mystery / Two players. One shared phone. This supersedes the intervening Bellweather title reply. Expo/store metadata matches, native home-screen name stays TWO SIDES, and the original interface is preserved. Screenshot confirms bundle `com.monirrouissi.twosides`, SKU `TWOSIDES_IOS_001`, Apple ID `6824306758`; app-record.json and EAS production submission configuration record them. No upload or submission performed.

RevenueCat App Store app `app8685bab13c` now matches the bundle/name; catalog entry `prodd120c3ae16` uses `com.monirrouissi.twosides.after_midnight_collection`, non-consumable, linked to the unchanged entitlement and sole Lifetime package alongside the Test Store product. Apple public key configured locally, ignored/untracked; clean iOS export confirms embedding. Apple credentials are still false in the live readback, and the actual Apple IAP/US price and remote EAS environment remain unconfigured. Preflight now reports only support/privacy URLs. Current evidence: `APPLE_IDENTITY_CHECKPOINT.md`. Earlier missing-bundle/key statements below are historical; native/sandbox/privacy/rights/human checks remain open. Existing licensing edits and outer work preserved.

## Latest: iOS ASO pack and connected RevenueCat project (18 October 2026)

`IOS_STORE_COPY.md` and `store/ios/en-US.json` contain complete English name/subtitle/promo/keywords/description/IAP/reviewer copy, checked against field limits, screenshot planning and publisher gates. Keep Last Reservation first. Store name: TWO SIDES: Co-op Mystery; subtitle: Two players. One shared phone. Native launcher name stays TWO SIDES. Fixed the empty web title and added public description metadata. No case, save, art or entitlement changes.

OAuth succeeded for the official MCP connection and CLI. With explicit user authorization created TWO SIDES (`projcfa9edbc`) separately from resumax. One Test Store non-consumable at USD 4.99 is attached to `after_midnight_collection` and the sole `$rc_lifetime` package in `after_midnight`; API readbacks and dashboard inspected. Apple app/product, bundle ID, Apple public key and support/privacy URLs are still missing. No Test Store key was substituted into production. 103 current-worktree tests, final TypeScript/lint, web and iOS JS exports pass. Alignment passes; Doctor fails schema fetch (20/21); preflight fails four publisher fields. Details/screenshot/native gates: `ASO_REVENUECAT_CHECKPOINT.md`. No push/submission. Earlier licensing work preserved separately. Older OAuth-timeout reports below are superseded.

## Latest: RevenueCat and offer integration (18 October 2026)

See `REVENUECAT_CHECKPOINT.md`. Preserved five free cases plus one non-consumable for the three After Midnight cases, with USD 4.99 as the US store configuration target. Updated the supplied marketing copy and localized CTA; kept The Last Reservation first, as explicitly confirmed by the user on 18 October. The existing native SDK adapter now accepts only the sole Lifetime non-subscription package, rejects explicit consumables/unknown Apple types, and scopes/invalidates cached quotes correctly. Actual active verified entitlements still determine access.

The official `revenuecat@RevenueCat` plugin 2.3.0 is installed and enabled. OAuth timed out; authenticated project access and live store/catalog setup remain outstanding. Current-worktree TypeScript/lint/103 tests pass (78 domain + 25 component/SDK-boundary), as do six-route web and both native JS exports. Alignment passed after an initial network timeout; Doctor 20/21, schema-fetch failure. Release preflight correctly fails on bundle id, Apple public SDK key, support URL and privacy URL. Native SDK tests use a mocked bridge; no signed iPhone/sandbox success is claimed. A real 375px production-web offer screenshot is saved. No dependency, authored case, save, art or entitlement-membership changes. Earlier licensing work remains uncommitted separately; no push or submission.

## Latest: library organization (18 October 2026)

The Last Reservation leads the free collection and is recommended while unstarted. Silent Piano, Masquerade Coat and Music Box follow; Missing Envelope remains available last. Removed the separate “start with the envelope” panel. Library utilities are two equal Help/Settings buttons with full accessible destination labels, 54px controls and wrapping for larger text. At 320px the normal-text buttons remain side by side without horizontal overflow. Historical file numbers stay unchanged, as do all case objects, answers, save keys and entitlement membership.

The Last Reservation now uses its own closed burgundy reservation ledger, replacing only its reused envelope emblem. Built-in imagegen original and optimized RGBA runtime file are in `assets/art/covers/`; transparency inspected (alpha 0–255), 1254px original and 640px runtime. Prompt/provenance is recorded in `assets/art/covers/PROMPTS.md`. Original envelope and other game art are preserved.

Actual validation: `npm run check` PASS, 78 domain + 18 component tests (96 current worktree total, including four earlier unfinished licensing tests); final `npm run lint` rerun after the compact-width adjustment. `npm run build:preview` PASS, six real static routes; initial Metro cache incompatibility recovered automatically by a full crawl. `npx expo install --check` PASS; Doctor FAIL 20/21, the same online configuration-schema fetch failure. Dependency maps match the lockfile; neither changed for this update. The access test compares complete free membership independently of display order, retaining checks that paid cases remain unavailable without ownership.

Browser: verified Help → Back to cases and Settings → Back to cases, original progress on the dev origin, 320px control bounds/no overflow, and 375px ledger card/cover. Inspected the normal exported build at 127.0.0.1:8098: Last Reservation is first/recommended, all five free cases remain present, paid cases remain locked and no development banner is present. No warning/error logs. Two real JPEGs: `docs/screenshots/2026-10-18/library/library-first-reservation-375.jpg` and `reservation-ledger-cover-375.jpg`. The stalled existing 8099 development server was restarted; browser inspection continued in a fresh tab. No save reset, purchase, push or submission. Native/device/human validation and publisher configuration remain open. Earlier unfinished licensing files and unrelated outer work are excluded from the scoped commit.

## Latest: sound and feel (17 October 2026)

See `SOUND_AND_FEEL.md` and `assets/audio/README.md`. Added an original, code-generated piano soundtrack ("Bellweather Nocturne", a 60-second seamless loop), eight soft effects and haptics, with music, effects and haptics switches and five-step volume levels in a new `/settings` route and inside each case's Settings. Defaults are on and quiet (music 2 of 5, effects 3 of 5). Preferences live under their own key `two-sides/preferences/v1`; no case content, case id, save key or save format changed. The audio session follows the silent setting, mixes with other audio and never plays in the background; the expo-audio plugin requests no microphone and no background mode. Scene reveals now ease out over 280 ms (still off under reduced motion). Installed with `npx expo install`: expo-audio, expo-haptics and expo-asset (a required expo-audio peer that Doctor flagged).

Actual results in the current worktree: `npm run check` PASS (typecheck, lint, notices check, **78 domain + 18 component tests**; new: 6 preference/asset tests, 3 sound component tests, and the storage-boundary test now allows the preferences provider while forbidding ownership terms in sound code). `npm run audio:check` PASS (byte-identical regeneration). iOS, Android and web JS exports PASS with all nine WAV files bundled; the notice inventory was refreshed from those exports and `notices:verify-exports` PASS. `npx expo install --check` PASS. Doctor 20/21, failing only the online schema fetch. Browser (Expo web dev server): music started after the first tap, looped at volume 0.28 for level 2, paused at 0 when switched off and resumed when switched on; tap, select, page, handoff and confirm cues played during a real Missing Envelope round; preferences were stored under the new key; no console errors. No person has listened to the audio yet, and none of this is native or device evidence: silent switch, haptics, fades and App Store processing of expo-audio's recorder code need a signed device build.

## Earlier: case repair and prose polish

See `CASE_REPAIR_POLISH.md`. Fixed LR6 and PB5 cross-role finales, actual coat-room entry proof, exclusive key/machine use, original-document provenance and rescue immediately after LC1. Shortened seven introductions by about 43% combined; all 33 correct answers, case/save identities and the complete mini-case are preserved. Three cases were played through their endings in the phone-width browser, plus LC1 rescue/retry/handoff. Five actual JPEGs are saved.

TypeScript/lint and **87 current-worktree tests** pass (72 domain + 15 component); web and iOS/Android JS exports pass. The scoped repair-only checkpoint contains **83** tests; four passing tests and notice validation belong to earlier unfinished licensing work preserved outside this commit. No dependency changes. Expo alignment passes; Doctor is now **20/21**, failing only the online schema fetch. Publisher fields, native startup/device/archive/sandbox checks, human tests and dependency assessment remain open; this is not submission-ready.

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
