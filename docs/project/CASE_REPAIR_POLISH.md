# Case repair and prose polish

16 October 2026. Authorized by the user's request, “do the repair then polish”. This checkpoint repairs the current eight-case catalog; it adds no case, payment feature, infrastructure or artwork. Earlier review claims that every deduction was fair are superseded by the concrete repairs below. This is implementing-agent review, not paired human validation.

## Confirmed defects and repairs

| Case | Confirmed issue | Current repair |
| --- | --- | --- |
| The Last Reservation | LR6's question pre-authenticated W6 and its old choices made one perspective sufficient. The alias lacked closure. | Neutral question and three plausible explanations leave two candidates per perspective, one combined. Elin explains the alias in the resolution. |
| The Masquerade Coat | Lift use/access did not prove that the coat entered Room 316. | A observes actual entry through the opposite room door at the second stop; B maps stops and opposite doors. Recovery follows that proof. |
| The Room That Was Never Booked | Return-time key/chain condition did not exclude earlier lending or assisted use. | Certified exclusive custody/use throughout the night, no exchanges or assisted use, intact numbered seals; the witness establishes Pike's continuous alibi. |
| The Portrait Behind the Wall | Residence did not prove who operated the machine; a later copy could explain a newer typewriter. PB5's old alternatives allowed one-sheet answering, while a timetable proved possible travel only. | Exclusive machine-operation period and sealed original-document receipt establish authorship and false dating. A supplies marriage-certificate fields; B verifies the certificate and records actual boarding. Near-miss alternatives require both. The private apology explicitly coexists with public pride. |
| The Last Call at Midnight | Players located a trapped child but kept solving four rounds before rescue. Later logs would conflict with an earlier rescue. | Shared LC1 confirmation rescues Teddy by 00:25, before reconstruction. Mara remains at reception. The counter extract ends at 00:20; the engineer tests from the switchboard. Later culprit/blind-spot/circuit answers are not revealed by rescue. Exclusive key use also closes an exchange loophole. |
| The Music Box in Room 214 | Lucy's contradicted account had little consequence; another convenient note repeated the common ending pattern. | The manager challenges her account during recovery and records her spoken explanation. Deduction answers are unchanged. |
| The Silent Piano | Wording about seeing the folder was overbroad; proof references omitted a used sheet; ending treated an attribution allegation too conclusively. | Witness describes the exposed corner; SP-A2 is referenced; an unsigned correction foreshadows a dispute and attribution is checked before rescheduling. |
| The Missing Envelope | No new confirmed defect requiring a change. | Entire case object remains unchanged, protected by its original content digest. |

No reviewed fix was rejected merely to preserve the old text. The mini-case's clock reminder and water foreshadowing remain, for the reasons already recorded in FIXES_LOG/STATUS. The independence of its third deduction remains a measured-playtest limitation, not a new gameplay requirement. No new fixes.md report is claimed by this checkpoint.

## Polish and preservation

The seven revised introductions total 390 words, down from 680 (about 43% shorter). This does not describe the reduction in all evidence: several sheets deliberately gain explicit proof constraints. Remove repetitive explanatory prose while keeping exhaustive mappings, continuous observation and no-exchange premises. Replace the coat and music-box abandoned notes with recorded speech; let the portrait resolve through a corrected caption and Last Call through changed safety practice. Motive remains gated to the appropriate reveal.

| Case | Introduction words before → after | Evidence words before → after |
| --- | --- | --- |
| Missing Envelope | 37 → 37 | 237 → 237 |
| Last Reservation | 69 → 45 | 1285 → 1044 |
| Silent Piano | 82 → 50 | 625 → 621 |
| Masquerade Coat | 81 → 48 | 537 → 539 |
| Music Box | 92 → 54 | 547 → 547 |
| Room Never Booked | 121 → 63 | 1149 → 1149 |
| Last Call | 95 → 61 | 1050 → 1067 |
| Portrait | 140 → 69 | 983 → 1006 |

All eight ids, editions, versions, save keys, round/evidence ids and 33 correct answer strings are retained. `tests/fixtures/pre-polish-case-contracts.json` was extracted from Git commit b1e204c, independently of the modified definitions. Tests decode every original progress prefix (41 total). LR's full-text digest is deliberately refreshed for the authorized prose change; the mini-case digest is untouched. No dependency/lockfile, entitlement, storage, reducer or art changes form part of this repair.

Seven new domain tests exercise legacy contracts and explicit counterexamples to the repaired proofs. One actual component test covers rescue gating, wrong retry, confirmed passage and the next private readiness handoff. These tests protect concrete premises and state behavior; they cannot certify literary quality or human puzzle difficulty.

## Actual checks

| Check | Result |
| --- | --- |
| `npm run check` | PASS: strict TypeScript, Expo lint, notice check, 72 domain + 15 component tests = 87. |
| `npx expo install --check` | PASS: compatible dependencies up to date. |
| `npx expo-doctor` | FAIL: 20/21; online app-config schema request failed with fetch error. React Native Directory check passed. No check disabled. |
| `npm run build:preview` | PASS: real static Expo web export, five routes. |
| Expo export iOS + Android + web, with source maps, to dist-native | PASS: both Hermes bundles and five web routes. These are JavaScript exports, not native binaries. |
| `npm run notices:verify-exports` | PASS in current worktree: 87 installed package paths / 54 grouped notice texts. |
| `git diff --check` | PASS. |

The worktree contains earlier unfinished licensing changes: package scripts, Help, shared UI export, notice generator/data/UI/tests and license texts; also `.claude/launch.json`. They are preserved and excluded from this scoped case-repair commit. Four of the 87 passing tests belong to that existing licensing work. The repair adds eight tests to the committed 75-test baseline, yielding **83 tests in the repair-only checkpoint**. The current 87-test result must not be misrepresented as evidence that licensing work is committed. Dependency specifications still match the lockfile; neither was changed for repairs. Expo lint now ignores the already-generated dist-native directory, alongside dist/.expo, and continues checking actual source/tests.

## Browser evidence

On a separate localhost:8099 development-preview origin at 375×667, played Last Reservation (six rounds), Portrait (five) and Masquerade Coat (three) to their complete endings. Played LC1 with wrong retry, successful early rescue and the following readiness handoff. Inspected repaired private sheets, plausible near-miss retry, updated proofs, resolution text and the compact cover. Concealed portrait evidence left zero matching title nodes. No horizontal overflow was observed; warning/error log was empty. A privacy interruption returned through neutral cover/readiness without advancing progress. Existing production/user-origin saves were left untouched.

The all-cases preview used the existing __DEV__ plus explicit preview flag, not a purchased or locally fabricated entitlement. Normal exports were built separately without that flag. This checkpoint does not change production access rules.

Five actual JPEG captures are in `docs/screenshots/2026-10-16/case-repair/`: `portrait-cover-375.jpg` (non-spoiler), `early-rescue-375.jpg`, `portrait-resolution-375.jpg`, `coat-resolution-375.jpg`, `reservation-resolution-375.jpg`. Resolution/rescue images contain spoilers. They are browser captures, not device screenshots or design mockups.

No full new browser walkthrough is claimed for Room Never Booked, Music Box or Silent Piano; their current automated/domain checks pass. No physical-device, signed-build, app-switcher snapshot, VoiceOver/TalkBack, purchase sandbox, paired playtest or measured-duration success is claimed. Doctor connectivity, publisher configuration, native startup evidence, dependency assessment and human validation remain open release gates.

## Run locally

Repository and npm working directory: `C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation` (nested Git root verified). Launch normal gameplay with `npm run web -- --lan --port 8081`. Use the computer's LAN address on the phone. An SDK-compatible native client remains a separate requirement. No push, upload or store submission was performed. Outer-repository deletions and Two_Sides_Overnight_Kit were not changed.
