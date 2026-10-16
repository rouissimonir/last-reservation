# TWO SIDES morning handoff

15 October 2026 · local Windows checkout · branch `master`.

**Latest privacy/link checkpoint:** `docs/project/PRIVACY_AND_LINK_CHECKPOINT.md` records the current 75-test/export passes, corrected purchase-data disclosures, minimum native required-reason declarations and URL-entry mitigation. Doctor now has two online failures (19/21). No signed iPhone/archive/store or human success is claimed. Publisher details and the remaining submission gates are still required; older totals below are historical.

**Latest 16 October regression checkpoint:** route-focus concealment and collection return navigation are fixed. TypeScript/lint and 66 domain/component tests pass; web/native JS exports pass. The browser attached and final production-web navigation, art and private reload checks were completed with ten real JPEG captures. Read `docs/project/SUBMISSION_REGRESSION.md` for current evidence and limits; earlier 55-test/pending-browser statements below are history. Device/sandbox/human checks, publisher configuration, Doctor's online schema fetch and dependency assessment remain open. No push or submission occurred.

**Superseded by the iOS-first submission checkpoint on 16 October:** eight current cases and the purchase flow are preserved. Six transparent cover illustrations and original launcher/splash identity replace temporary/template graphics; Help & Privacy, EAS profiles and release preflight are added. Current results and remaining release gates are in `docs/project/STATUS.md` and `docs/project/IOS_SUBMISSION.md`. TypeScript/lint/55 tests, web and native JavaScript exports pass. Doctor's online schema fetch, missing publisher configuration, dependency assessment, native/sandbox/human checks and new browser-layout inspection remain open. The active Git root is now the nested app repository. Historical two-case claims and screenshots below do not establish readiness of the current submission candidate.

**Later review update:** `fixes/logs.md` reports an iOS native startup failure. This remains BLOCKED pending the installed phone client's version/SDK/source and a device retest; no native fix is claimed. Local dependencies, Apple autolinking and both current Metro manifests are consistent with SDK 57. README now explicitly identifies the physical-iOS App Store client limitation. See `IOS_RUNTIME_TROUBLESHOOTING.md` and `FIXES_LOG.md` for evidence, report hash, browser playtest route and next steps. Subsequent `npm run check` again passed TypeScript/lint/14 tests; dependency alignment passed; the latest Doctor run failed one online schema-fetch check, superseding its earlier morning pass below. Game/source, dependencies, artwork and saves are unchanged.

Git root: `C:\Users\thinkpad t490\Documents\apps\last-reservation`.
Expo application: `C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation`.

## Launch

```powershell
Set-Location -LiteralPath 'C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation'
npm run web -- --lan --port 8081
```

Open http://localhost:8081/. If the existing server is running, use it rather than starting a second copy. A fresh checkout needs `npm ci` first. For a phone browser, use the PC's current Wi-Fi IPv4 address on the same network. No publication or native binary is required for that web preview.

## IMPLEMENTED AND CHECKED

- **The Missing Envelope:** complete three-deduction mini-case, all six private sheets, original canonical clues/answers, optional hints, notebook, signed-note ending and confirmed replay. The original save key/version and existing nine tests are preserved.
- **The Last Reservation:** complete six-deduction, three-act contained mystery with four relevant suspects, twelve private evidence sheets, progressive hints, supported final reconstruction and a complete ending. The timeline, character motives/knowledge, truth/lie distinctions, alternatives and proof records were written and challenged before integration. Narrative proofs and walkthrough are author-only in `LAST_RESERVATION_SOLUTION.md`.
- **Case library:** descriptions, separate progress states, open/continue, replay with confirmation, and a clear local development preview label. Both cases are available without a purchase gate. There is no fake transaction flow.
- **Shared experience:** existing hotel/envelope/folder/paper assets, native readable text and controls, private readiness handoffs, upright scrolling evidence, shared answers, confirmed notebooks, larger body text, per-case saves/settings and scoped reset. Malformed/unavailable saves remain protected; the error view also permits choosing another case without replacing the damaged save.
- **Case isolation:** original mini save key retained; full case has a separate versioned key. Invalid or cross-case save writes are refused. Late loads cannot overwrite a later explicit reset or unsaved-play choice.
- **Browser checks:** a full start-to-finish playthrough of each case on the separate 127.0.0.1 origin; all 18 sheets opened; incorrect choices and correct retries; disabled confirmation until selection; optional hint; notebook revisit preserving hint history; no outgoing clue-title node on neutral handoff; full-case private reload to neutral library; mini private page navigation/back to neutral library; both endings; replay cancellation; resetting the completed mini-case while the full case remained 6/6; full-case larger-text preference persisted across case switching/reload. Main localhost saves were preserved.
- **Layout:** actual 375×667 and 390×844 browser views. Compact cover action y=498.7–552.7. Reduced an oversized initial library header after screenshot inspection. Larger-text LR-A3 and the measured longest sheet LR-B4 (767 body characters) scroll fully above the reserved action dock. No overlap was observed in those layouts.

## Commands and actual results

| Command | Result |
| --- | --- |
| `npm run check` | PASS: strict TypeScript, Expo lint, 14 tests |
| `npm run test:ci` | PASS: 14 tests, exits normally; no watch mode |
| `npm run build:preview` | PASS: real Expo web export; `/`, `/_sitemap`, `/+not-found` in ignored `dist/` |
| `npx expo export --platform android --platform ios --output-dir dist-native` | PASS: Android/iOS Hermes JavaScript bundles; not native binaries |
| `npx expo install --check` | PASS: dependencies up to date |
| `npx expo-doctor` | Latest: FAIL, online configuration-schema fetch failed. Earlier morning run passed 21/21. No check bypassed. |

No test was removed or weakened. Five added tests cover the six-round walkthrough, every wrong choice, read/hint gates, duplicates, case-specific storage/reset, malformed saves and missing/future/cyclic references. Structural tests cannot certify narrative fairness or play duration. Dependencies and package-lock.json are unchanged.

## Screenshots actually captured

All files below are real screenshots of the running local Expo web application, saved inside the repository under `docs/screenshots/2026-10-15/`. Evidence, retry and ending images contain play spoilers; they are not mockups or physical-device captures.

| File | View |
| --- | --- |
| `library-375.png` | Compact case selection |
| `last-reservation-cover-375.png` | Full-case cover and reachable action |
| `last-reservation-handoff-375.png` | Neutral Records handoff with loaded folder art |
| `last-reservation-witness-375.png` | Witness document in normal text |
| `last-reservation-retry-375.png` | Wrong-answer retry and optional first hint |
| `last-reservation-large-text-375.png` | Large body text at document top |
| `last-reservation-large-text-bottom-375.png` | Document end clear of action dock |
| `longest-clue-large-top-375.png` | Measured longest sheet, top |
| `longest-clue-large-bottom-375.png` | Measured longest sheet, bottom |
| `last-reservation-ending-390.png` | Full-case resolution at taller size |
| `last-reservation-ending-letter-390.png` | Closing letter/conclusion after scrolling |
| `mini-case-ending-390.png` | Preserved mini-case signed-note ending |
| `case-save-isolation-390.png` | Mini reset to fresh; full case still 6/6 |

## IMPLEMENTED BUT NOT VERIFIED

- Save failures/malformed data were exercised through automated storage adapters, not injected into the browser's actual storage. The error screen's new “Choose another case” control was inspected in source; that failure-screen interaction was not browser-tested.
- Native safe areas, OS font scaling, reduced-motion behavior, AppState/Android-back timing, VoiceOver/TalkBack focus and physical-phone performance have not been tested on hardware or an emulator. The code uses native components and the existing lifecycle handlers; browser results do not establish native snapshot privacy.
- Browser navigation/back and explicit conceal/reload were verified. Actual OS app-switcher snapshots and ordinary external-browser tab/background behavior still need manual device checks.
- The new story has an implementing-agent logic pass, not an independent narrative review. Target durations **5–8 minutes** and **30–45 minutes** remain **UNVALIDATED** until paired human playtests. No commercial readiness claim is made.

## Earlier morning validation history

Overnight, Expo Doctor could not fetch the Expo configuration schema (`fetch failed`), and the React Native Directory metadata check failed with an unexpected server response. On the user's morning continuation on 15 October, `npm run check` passed TypeScript, lint and all 14 tests again; dependency alignment passed and Expo Doctor passed **21/21**. Both remote failures have cleared. No check was disabled or bypassed, and no dependency or product-code changes were needed. The existing web/native JavaScript export results remain valid for the unchanged source; exports were not repeated in this documentation-only continuation.

That morning scan found no fixes.md inputs or new app changes. The later `fixes/logs.md` report and renewed online schema-fetch failure are recorded above. The running localhost preview still shows both cases with their local-preview and unvalidated-duration labels. Physical-device launch is now a reported blocker awaiting client details and retest; paired human playtesting also remains outstanding.

The full Git working tree is intentionally dirty: pre-existing root-template deletions plus the untracked `Two_Sides_Overnight_Kit/` remain outside these scoped app commits. Do not delete, restore or blanket-stage them. The separate kit runner has not been started. No push/remote merge occurred.

## NOT IMPLEMENTED

Production payment/entitlement integration, purchase restoration, store testing, signing, native distribution builds and release submission remain pending. Both cases are openly accessible only as this local development preview. No backend, accounts, multiplayer, subscriptions, advertisements, runtime AI or extra cases were added. Optional audio was omitted; play needs no sound. The inherited launcher icons and splash remain unchanged.

## Assets and known defects

No required artwork is missing. The four supplied originals and optimized local runtime copies remain tracked; exact paths and transparency/dimensions are in `assets/art/README.md`. No new generated artwork or dependency was needed.

No gameplay blocker or clipping was observed in the tested flows/layouts. The inherited dependency-advisory maintenance item in STATUS remains open; this run did not force dependency upgrades. Local saves do not synchronize across origins/devices. Unsaved play is session-only and is lost when its case screen is closed.

## Ten-minute manual inspection

1. **0–1 min:** Open the library. Confirm both case descriptions, duration warnings, progress and local-preview label. Open the mini-case; its main cover action should fit normally.
2. **1–3 min:** Read both first sheets privately. Hide before passing. Confirm no previous clue remains on the folder screen and each role must press “I'm ready”.
3. **3–4 min:** Try a wrong answer, then reveal one optional hint. Confirm no automatic progression or penalty. Use author solution documents only if you want a functional walkthrough rather than a fresh playtest.
4. **4–5 min:** Revisit a sheet from Notebook through readiness. Return to the same deduction and previously viewed hint count.
5. **5–6 min:** Enable larger text. Scroll to the end of evidence; confirm the bottom action does not cover text. Reload while a private sheet is open: expect neutral selection, then cover/readiness for private resume.
6. **6–8 min:** Open the full case. Inspect its introduction and first evidence pair, distinct act/deduction labels and readable longer documents. The complete case takes longer than this inspection checklist.
7. **8–9 min:** Switch cases; verify independent progress. Cancel replay, then confirm replay for one case and confirm the other is unchanged.
8. **9–10 min:** Review the captured ending images after playing, or follow the author walkthrough to inspect both resolutions. Schedule separate paired duration/fairness and physical-device accessibility/privacy checks.

## Hourly review loop

In-chat automation `two-sides-hourly-checkpoint-fixes` is active. Each hour it looks for case-insensitive `fixes.md` files within this repository/checkpoint folders, verifies changed findings, fixes confirmed blockers/important defects, explains rejected findings, runs relevant checks and continues only unfinished mission work. `FIXES_LOG.md` tracks reviewed paths/hashes and now also instructs checking the known `fixes/logs.md` input. No literal fixes.md inputs were found. While this native blocker awaits device information, unchanged reports should not trigger repeated speculative changes. Stay quiet unless findings, device information or actionable state change.

Keep the computer on and the desktop app running for local-file scheduled work. The four-artwork checkpoint and unrelated root changes are preserved. Local milestones: `3c2fa1a` authoring, `84b2aae` two-case implementation; final validation/documentation checkpoint hash is reported in chat rather than embedded in its own commit.
