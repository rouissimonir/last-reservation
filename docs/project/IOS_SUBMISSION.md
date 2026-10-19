# iOS submission checkpoint

**Latest identity update, 18 October:** `APPLE_IDENTITY_CHECKPOINT.md` records the publisher-confirmed name/subtitle, permanent bundle ID, SKU and actual ASC Apple ID, local Apple SDK configuration and linked RevenueCat App Store catalog. Earlier missing-identity/key statements below are superseded locally. Preflight still fails on real support/privacy URLs; Apple purchase credentials/product setup, remote build environment and signed native/device/sandbox evidence remain outstanding. No submission performed.

**18 October update:** complete English store/reviewer copy, verified field lengths and screenshot plan are in `IOS_STORE_COPY.md` and `store/ios/en-US.json`. RevenueCat OAuth succeeds and the explicitly authorized TWO SIDES Test Store catalog is configured; no real Apple app/product/key is configured. Latest 103-test, web/iOS-JS export results and remaining publisher/device gates: `ASO_REVENUECAT_CHECKPOINT.md`. Still not submission-ready; older counts below are historical.

16 October 2026. Target selected by the user: **iOS first**. **Not yet submission-ready.** This is an evidence register, not a claim of App Review approval.

Latest local evidence: `PRIVACY_AND_LINK_CHECKPOINT.md` — 75 passing tests, corrected disclosures, evidenced minimum required-reason declarations and a native link-entry mitigation. `PRIVACY_DATA_INVENTORY.md` records current data flows and exact native-manifest sources. Earlier visual/flow checks are in `SUBMISSION_REGRESSION.md`. Final archive aggregation, store privacy answers and native-device gates remain unverified; local checks do not clear them.

## Current checkout

`git rev-parse --show-toplevel` now returns `C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation`. This nested folder has its own Git repository. The old outer-repository paths in historical mission reports are not the active Git root. Do not stage or clean the parent repository.

## Local preparation in this checkpoint

- SDK 57 retained; Expo, Router and Expo UI brought to their compatible patch versions.
- Illustrated brass keyhole/two-profile launcher identity is configured in app.json, including splash, favicon and Android variants. iOS inherits the opaque 1024px RGB top-level icon in `assets/brand/v2/`. The earlier evidence-leaf identity and all game illustrations are preserved. `assets/brand/README.md` describes provenance and regeneration; `APP_STORE_ASSETS.md` records current checks and native limits.
- iPhone portrait launch configuration, initial build number 1; dedicated iPad support is off pending tablet design/testing. An iPhone-only app still needs its compatibility behavior checked on iPad where Apple makes it available.
- Help, privacy and support are reachable near the top of the case library without opening the paid offer. Local help covers private handoffs, hints, larger text, local saves/reset and restore. Configured links have failure feedback instead of an unhandled promise rejection.
- Player-facing case lengths use actual deduction counts and no time limit. Unmeasured playtime estimates remain in author metadata/history; they are not advertised as measured claims.
- `eas.json` has development, internal preview and production/store profiles. Preview and production explicitly set the premium preview flag to 0. No EAS project, credentials, build or upload was created.
- `npm run release:preflight` checks iOS identity/version/build number, public Apple SDK key, public HTTPS support/privacy URL syntax, the real opaque 1024px icon and the production profile. It does not print configuration values. It fails while required fields are missing. Syntax checks do not establish ownership of identifiers, live page contents, native behavior or dashboard setup.

## Configuration required from the publisher

The user selected iOS first and will provide the publisher details. Do not invent or register an identifier, business/contact identity, support URL or privacy-policy URL. The following remain unset in this checkout:

1. Permanent publisher-owned `ios.bundleIdentifier` in app.json.
2. `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` (Apple public SDK key) in the appropriate local/EAS environment.
3. `EXPO_PUBLIC_SUPPORT_URL` and `EXPO_PUBLIC_PRIVACY_URL` pointing to live, complete publisher pages.
4. Publisher/seller identity and App Store Connect app record. Public policy must name the actual publisher and explain RevenueCat/store data processing, retention and contact/deletion handling. The local help summary is not a substitute for that policy.

Never paste signing secrets, .p8 files, passwords or service-account keys into chat or commit them. `PURCHASE_SETUP.md` contains the existing dashboard checklist. Its old statement that eas.json does not exist is superseded by this checkpoint.

## Remaining gates — evidence required

| Gate | Required evidence | Current state |
| --- | --- | --- |
| Identity and live support/privacy | Approved identifiers; actual pages open on the phone; App Store metadata agrees | Awaiting publisher details |
| RevenueCat/App Store product | Signed Apple app, non-consumable product, matching offering and entitlement, localized price | Account/dashboard setup not verified |
| Physical iPhone stability | A signed build installs and cold-launches, all five free cases and three owned cases can complete, offline saves survive force-quit/relaunch | No device evidence |
| Native purchase recovery | Sandbox buy, cancel, pending/approval, failed/unverified response, offline ownership, reinstall/restore, refund/revoke, rapid taps | Unit tests only; real sandbox evidence required |
| Private handoffs | VoiceOver focus and app-switch/back/notification behavior never advances or exposes the other sheet; OS screenshots/privacy limits recorded honestly | Browser and source evidence only |
| Accessibility/layout | Large and accessibility text sizes, reduced motion, VoiceOver, 375/390px and modern large iPhone screens, safe areas and scroll-to-bottom | Production web checked at 375×667/390×844 with final art; native behavior still unverified |
| Story fairness | Fresh two-person sessions, one phone, no solutions; record solve paths, ambiguous alternatives, hints and duration for each case | No human playtest evidence |
| Final case cover art | Consistent art for cases 03–08, no clue leakage; inspect on small phones | Source/alpha and small browser layouts inspected; device inspection pending |
| Metadata and screenshots | Final English store copy, age-rating answers, rights confirmation, real correctly sized iPhone screenshots of the signed release build | Copy prepared in IOS_STORE_COPY.md; five 1320×2868 layout drafts in store/ios/screenshots-drafts use real web captures, explicitly not submission-ready; native captures pending |
| Production guard | Signed production build has no dev client/preview label; paid cases stay locked without verified entitlement even if a preview env flag is accidentally set | Pure guard tests only; signed build required |
| Dependencies/security | SDK alignment, Doctor, lockfile validation, audit assessment and regression after fixes | See STATUS.md for current command results |
| Native privacy manifests and disclosures | Generated/archive manifest resources match actual SDKs and usage; owner verifies live policy and store answers | Three evidenced app-level reasons and local Expo merge tested; final archive, extra SDK reasons and dashboard review pending |

## Build sequence once configuration is complete

From the active nested repository:

```powershell
npm ci
npm run check
npm run build:preview
npm run release:preflight
npx expo install --check
npx expo-doctor
```

After the owner links the correct Expo/Apple project and authorizes a cloud build, `npx eas-cli build --profile development --platform ios` builds the device client. Test using `npm start -- --dev-client --lan`. Only after recording the native checklist should the owner authorize a production build. No submit or auto-submit action is part of this checkpoint.

## Sources checked

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), especially 2.1 (complete functional submission and on-device tests) and 5.1.1 (accessible in-app and store privacy-policy links).
- [Expo SDK 57 config](https://docs.expo.dev/versions/v57.0.0/config/app/) and [EAS build profiles](https://docs.expo.dev/build/eas-json/).

These requirements must be rechecked against the actual App Store submission date. Passing local checks is necessary evidence, not a substitute for the gates above.
