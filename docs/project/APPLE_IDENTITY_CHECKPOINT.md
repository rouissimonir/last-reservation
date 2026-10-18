# Confirmed Apple app identity and RevenueCat wiring

18 October 2026. The publisher supplied an App Store Connect screenshot and authorized updating the app/RevenueCat to match it.

## Confirmed identity

| Field | Confirmed value |
| --- | --- |
| App name, latest explicit publisher instruction | `TWO SIDES: Co-op Mystery` |
| Bundle ID | `com.monirrouissi.twosides` |
| SKU | `TWOSIDES_IOS_001` |
| App Store Connect Apple ID | `6824306758` |
| Subtitle visible in screenshot | `Two players. One shared phone` |

The screenshot crops out the title, so name synchronization uses the publisher's latest explicit text instruction: **TWO SIDES: Co-op Mystery**, subtitle **Two players. One shared phone**. This supersedes the earlier Bellweather title reply. App Store name reservation/availability was not independently verified; the supplied bundle ID, SKU and Apple ID are visible in the screenshot.

`app.json` now sets the confirmed `ios.bundleIdentifier` and full Expo name, while the native home-screen name remains TWO SIDES. The existing TWO SIDES UI/web title is retained. `eas.json` has a production submission target containing the existing `ascAppId` and SKU; this is configuration only, not a submit command or authorization to upload. `store/ios/app-record.json` records the identity. Store-copy subtitle matches exactly, without an added final period. Slug, URL scheme, case identifiers and saves are preserved. No unused capability or permission was added.

## RevenueCat changes and readbacks

Reused project TWO SIDES (`projcfa9edbc`), entitlement `after_midnight_collection`, offering `after_midnight` and its sole `$rc_lifetime` package. Listed apps/products first to avoid duplicates.

- Added App Store app `app8685bab13c`, now named TWO SIDES: Co-op Mystery, with the exact confirmed bundle ID. The final official CLI update/readback confirms this name.
- Created its RevenueCat catalog entry `prodd120c3ae16`, store identifier `com.monirrouissi.twosides.after_midnight_collection`, type `non_consumable`, with `is_consumable: false`.
- Attached it to entitlement `entldac6ed557d` and package `pkgeead7c34e09`. Readbacks verify the Apple entry alongside the preserved Test Store product; there is still exactly one package and exactly three premium cases behind the same entitlement. Free access is unchanged.
- Retrieved the new app's Apple public SDK key through the official CLI and configured it in ignored, untracked `.env.local`. The value was not printed or committed. Existing service/config code already consumes this static EXPO_PUBLIC variable; no SDK dependency/code change was needed.

The Apple catalog entry exists **in RevenueCat**. This operation does not create the corresponding IAP in App Store Connect, set its Apple price or validate a transaction. RevenueCat readback reports both `app_store_connect_api_key_configured: false` and `subscription_key_configured: false`. No signing/server secret or Apple credential was invented, collected from unrelated apps or uploaded. Existing Test Store USD 4.99 pricing is preserved; the actual Apple US storefront price still needs to be set to USD 4.99 when creating the matching non-consumable.

## Required remaining setup

1. In App Store Connect app **6824306758**, create the non-consumable with the exact product ID above, using the prepared After Midnight name/description, USD 4.99 US target and a real offer review screenshot.
2. Add the publisher-owned Apple In-App Purchase credentials directly to the new RevenueCat App Store configuration. No `.p8` or password belongs in chat/Git. An App Store Connect API key is also needed for automated store import/management; do not confuse it with the client-side `appl_` SDK key.
3. Configure the same Apple public SDK key in the correct EAS build environment when linking/building that project. A git-ignored local environment file is not evidence that remote production environment variables exist.
4. Supply real public HTTPS support/privacy URLs and finish native sandbox buy/cancel/pending/restore/refund tests, archive/privacy checks, paired playtests and genuine iPhone submission screenshots. Native startup/device evidence remains open.

No App Store upload/submission, cloud build, Apple key generation, account permission change or paid action occurred. Earlier unrelated licensing work and outer repository changes remain preserved.

## Validation

The first warm-cache iOS export did not contain the new public SDK key. Re-exported with `--clear` and verified that the exact expected key is present in the resulting Hermes bundle, without printing its value. After any SDK-environment change, restart the native development server with `npm start -- --dev-client --lan --clear`. No purchase-code workaround or weakened entitlement guard was introduced.

| Check | Actual result |
| --- | --- |
| `npm run check` | PASS: TypeScript, lint, notice verification, 78 domain + 25 component/SDK-boundary tests = 103 current-worktree tests, no skips. |
| Final metadata/identity assertions | PASS: exact name/subtitle, bundle ID, SKU and ASC Apple ID agree across configuration/record/copy; all store field lengths within limits; dependency maps match lockfile. |
| `npm run build:preview` | PASS: six static routes after the final name correction; exported HTML has exactly one correct title. |
| iOS export, `--clear --max-workers 2` | PASS after the final correction: Hermes JS and assets exported; byte inspection confirms the exact Apple public SDK key is embedded, value not printed. Not a signed native build. Android not rerun in this iOS-first checkpoint. |
| `npx expo install --check` | PASS: compatible dependencies up to date. |
| `npx expo-doctor` | FAIL: 20/21, existing online app-config schema fetch failure. No check disabled. |
| `npm run release:preflight` | FAIL: two remaining local fields, real HTTPS support and privacy-policy URLs. Bundle ID and local Apple SDK key checks now pass. This does not certify remote EAS or live store setup. |
| RevenueCat readbacks | PASS: exact final App Store app name/bundle; non-consumable; both products preserved in the entitlement and single Lifetime package. Apple credentials remain unconfigured. |
| Screenshot/browser evidence | RevenueCat product screenshot shows the Apple product, non-consumable type, expected entitlement, final app label and missing-key warning. Browser AX focus commands timed out; normal screenshot/reload succeeded. No new device or gameplay-browser claim. |

Screenshot: `docs/screenshots/2026-10-18/aso-revenuecat/apple-product-record.jpg`. Its Store Status is “Could not check”, consistent with missing Apple credentials. Existing UI and all case/art/save code have no checkpoint diff. Four tests and notice tooling belong to separately preserved unfinished licensing work.

Local configuration and SDK-boundary tests are not native transaction proof. No native SDK launch/configuration banner, sandbox purchase or signed archive was obtained.
