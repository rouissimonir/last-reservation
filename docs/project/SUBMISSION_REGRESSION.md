# Submission regression checkpoint · 16 October 2026

This checkpoint follows `686c161`. It closes two concrete defects and adds component-level coverage. **It does not complete iOS submission readiness.**

## Confirmed defects and fixes

1. **Route focus privacy:** the case only used route focus to disable its Android back handler. A route opened above it could leave a private sheet mounted without an AppState transition. `Investigation` now returns no case content while unfocused and clears the selected case through navigation's focus cleanup. Returning starts at the library; resuming requires cover and readiness. This is a React-level concealment guarantee, not proof about iOS app-switcher snapshots.
2. **Wrong return destination:** browser reproduction: library → Help → collection → “Back to the cases” returned to Help. The collection now separates Close (previous screen) from case-selection actions (`router.dismissTo('/')`). Help's named return action also targets the library. The corrected production export was driven through the same flow; Close returned to Help and Back to the cases returned to the library.

## Automated evidence

`npm run check` passed TypeScript, Expo lint, **55 original domain/configuration tests plus 11 new component tests**. `test:ci` runs both suites once and exits; no watch mode or skipped tests. The new tests render actual native components and providers using SDK-compatible Jest Expo and React Native Testing Library. Native SDK/storage/navigation boundaries are mocked; no RevenueCat/StoreKit request was sent.

The component assertions cover:

- A private sheet disappears from the tree, including hidden elements, on route focus loss without an AppState event. Resume needs readiness and the save is unchanged.
- Revoking a paid entitlement unmounts the private sheet; re-grant returns to a cover rather than the previous sheet.
- Native inactivity conceals without marking the sheet read.
- The damaged-save UI can return to the library or play unsaved without replacing data.
- Actual purchase-provider behavior: one SDK call for rapid purchase/restore attempts, stale pre-purchase poll dropped, listener revocation/re-grant, pending approval then confirmation, restore and listener cleanup.
- Offer Close versus case-selection destinations; unavailable web purchase/restore cannot invoke the mocked store.

The first cold native render exceeded Jest's default five-second deadline during lazy module transforms (71 seconds measured). UI integration tests allow 120 seconds; async UI-query deadlines remain short. No assertion was removed. A React lint finding against synchronous setState in an effect was corrected using the actual navigation focus lifecycle, without disabling the rule.

The first automatically selected `test-renderer` 1.3.1 pulled a reconciler requiring React 19.3. The test renderer is now pinned exactly to **1.2.0** (reconciler 0.33.0), compatible with the preserved app React 19.2.3. Full `npm ls --all --json` reports no dependency problems. Package and lockfile root dependencies match. Jest Expo internally retains its compatibility renderer; the new tests use RNTL 14's renderer.

## Export and browser evidence

- Real web export: PASS, five static routes. Final output includes the focus and navigation fixes.
- iOS/Android exports with source maps: PASS (Hermes JavaScript, not signed binaries). Maps list 1,177 iOS and 1,312 Android sources; no Jest, test-renderer, React Native Testing Library or tests/ui sources were found in those maps. This narrows the new test-tooling exposure for those exported bundles; it does not clear the dependency audit.
- Expo dependency alignment: PASS. Latest Doctor: one online configuration-schema fetch failure; no check disabled.
- The previously queued browser attached. Actual production web build at 127.0.0.1:8098, no premium preview flag: all illustrations loaded; paid cases remain locked, no Buy button, Restore disabled with an honest explanation.
- At 375×667: Help is reachable from the library; piano and coat cover actions fit (coat primary action y=484.7–538.7); no horizontal overflow observed. At 390×844: music-box cover inspected in a full-height capture. These are browser viewports, not hardware tests.
- Help/offer route navigation was exercised against the final export. While Help is active, the library is absent from the DOM (not just visually covered).
- Mini-case private sheet required readiness. Reload from the sheet returned to the library; opening and continuing returned to investigator A's neutral handoff, without marking it read. Only this QA-origin case was then reset through its confirmation UI. Other origins/user saves were untouched.
- Browser warning/error log was empty. Native VoiceOver, font scaling, safe areas, app-switcher behavior, real purchases and human playtests remain unverified.

## Captures

Real JPEG files in `docs/screenshots/2026-10-16/submission/`, captured through the browser tool. They are not generated art or store submission screenshots. The private-sheet image contains a play spoiler. Temporary viewport overrides were reset after inspection.

`library-top-375.jpg`, `library-frame-375.jpg`, `help-top-375.jpg`, `collection-top-375.jpg`, `collection-unavailable-375.jpg`, `piano-cover-375.jpg`, `coat-cover-375.jpg`, `music-box-cover-390.jpg`, `private-sheet-375.jpg`, `neutral-handoff-375.jpg`.

## Remaining gates

See IOS_SUBMISSION.md. Publisher identifier/public configuration, live policy/support pages, signed iPhone and native sandbox purchase checks, human playtests, App Store assets/metadata and dependency risk assessment are still open. The added test tooling increases audit inventory; the latest explicit full audit reports **65 advisories (49 high, 16 moderate)**, including sprintf-js through tooling. No audit exemption, forced framework downgrade or React upgrade was used.

Sources checked for implementation/tooling: [Expo Router SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/router/) (`dismissTo`, focus lifecycle), [Expo Jest setup](https://docs.expo.dev/develop/unit-testing/), and [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/docs/start/quick-start).
