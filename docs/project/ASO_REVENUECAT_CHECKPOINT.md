# App Store copy and RevenueCat checkpoint

18 October 2026. Authorized: prepare full iOS submission details and ASO copy, check the integration, and create a **new TWO SIDES RevenueCat project**. No App Store submission, native/cloud build, payment, permissions change or work on the unrelated resumax apps was performed.

## Submission and app metadata

- Complete English copy is in `IOS_STORE_COPY.md`, with structured fields in `store/ios/en-US.json`: name, subtitle, promo, keywords, description, IAP display/description and review notes. The document also includes category/language/price choices, screenshot sequence, privacy/content guidance and publisher-owned fields still required.
- Name: **TWO SIDES: Co-op Mystery** (24/30 characters). Subtitle: **Two players. One shared phone.** (30/30). Promo: 168/170; keywords: 95/100 UTF-8 bytes; description: 1896/4000. IAP name: 25/35; description: 51/55; review notes: 1277/4000. Limits were actually checked against these files. ASCII keywords avoid multibyte ambiguity.
- Corrected the old store draft's envelope-first recommendation to The Last Reservation, matching the user's explicit choice and current library order. Five free cases and the optional three-case, one-time purchase are disclosed clearly. No unsupported duration, longer-case, ranking or remote-multiplayer claims.
- Kept the native home-screen name TWO SIDES, internal slug/scheme and save identities. Added an accurate Expo description and English web branding. Fixed the production web's empty initial title via Expo Router Head and added a static public description/theme color in the supported `+html.tsx` document. Export verification checks exactly one nonempty title and one description. An initial duplicate empty title was caught and corrected before handoff.
- These source/config fields do **not** set the App Store listing. App Store Connect still needs the prepared copy entered, name availability confirmed and the actual release build selected. Search-volume/ranking improvements and trademark clearance are not established by drafting relevant copy.

## RevenueCat: actual connected state

The official `revenuecat@RevenueCat` 2.3.0 remains installed/enabled. Fresh `codex mcp login RevenueCat` completed successfully. The current chat did not expose new RevenueCat MCP methods after login, so the official `@revenuecat/cli` 0.1.6 was used with its own successful OAuth sign-in. Tool-managed credentials remain outside the repository; no secret key or callback code is in project files.

Read the installed toolkit's integrate/purchase-flow/bootstrap/CLI guidance and React Native references, plus Postman's API-engineer/discovery guidance. This uses the existing native SDK and official catalog commands; no custom REST API, backend or extra HTTP simulation infrastructure was introduced. The SDK-boundary tests mock the native bridge, and do not establish a real transaction.

Listed projects first. Initially only resumax existed; the user then explicitly authorized a separate project. Created and read back the following through the official CLI:

| Resource | Actual value |
| --- | --- |
| Project | TWO SIDES — `projcfa9edbc` |
| Automatically created app | Test Store — `app141112f960` |
| Product | `after_midnight_collection` — `prod41b53f74a7` |
| Product type | `non_consumable`; `one_time.is_consumable: false` |
| Test Store price | USD 4.99 (`4990000` micros), verified by price lookup |
| Entitlement | `after_midnight_collection` — `entldac6ed557d` |
| Offering | `after_midnight` — `ofrngdd61b19429`, current/default |
| Sole package | `$rc_lifetime` — `pkgeead7c34e09` |

Verified entitlement product listing and package product listing both contain exactly that product; offering package listing contains exactly the Lifetime package. Dashboard inspection confirms TWO SIDES, after_midnight, the Lifetime package and the attached Test Store product. Screenshot: `docs/screenshots/2026-10-18/aso-revenuecat/after-midnight-offering.jpg`.

[Project dashboard](https://app.revenuecat.com/projects/cfa9edbc). The existing custom paywall remains. No RevenueCatUI redesign, extra product, subscription, backend or new case was added. No test purchase or customer entitlement was fabricated.

**This is a Test Store catalog, not an Apple product.** No App Store app exists in this new project yet. No `appl_` SDK key, store credential, permanent bundle ID or real Apple IAP was invented. The Test Store key was not substituted into the Apple production configuration. USD 4.99 in the test catalog does not set the price in App Store Connect. The actual signed native app is still unconfigured for real checkout.

## Existing app integration inspected

`service.native.ts`, `purchases-provider.tsx`, `access.ts` and the catalogue still implement configure-once, signed active entitlements, the explicit after_midnight offering, a sole Lifetime non-subscription package, localized price, cancellation/pending handling, restore, foreground refresh and stale-quote rejection. Free content does not depend on ownership; the entitlement maps to exactly the three premium cases. Release builds cannot enable the development preview through the flag alone. No confirmed app-side defect required a purchase-code change in this pass.

## Validation

| Check | Actual result |
| --- | --- |
| `npm run check` | PASS: TypeScript, lint, notices check, 78 domain + 25 component/SDK-boundary tests = 103 current-worktree tests. No skips. |
| Final metadata verification | PASS: TypeScript/lint rerun after the title correction. All store field limits pass; exported HTML contains exactly one correct title and one public description. |
| `npm run build:preview` | PASS: actual six-route static web export after the final correction. |
| iOS export to dist-native | PASS: Hermes JS plus artwork/audio. Metro recovered from an incompatible cached file with a full crawl. Not a signed binary. Android was not re-exported in this checkpoint. |
| `npx expo install --check` | PASS: dependencies up to date. |
| `npx expo-doctor` | FAIL: 20/21; existing online app-config schema fetch failed. No check suppressed. |
| `npm run release:preflight` | FAIL: permanent bundle ID, Apple public SDK key and real support/privacy URLs missing. Genuine release blockers. |
| Lockfile/whitespace | PASS: dependency maps equal package-lock.json; no dependency change; git diff --check clean. |
| Browser | PASS: production title/description, Last Reservation first/recommended, five free and three paid cards, no horizontal overflow; warning/error log empty. Not device evidence. |

Four current-worktree tests and notice checks belong to earlier unfinished licensing work, preserved outside this checkpoint. No mocked/native-JavaScript test is an iPhone purchase, signed binary or App Store sandbox success.

## Remaining publisher and device gates

1. Supply the permanent publisher-owned iOS bundle ID, confirm App Store Connect app status and identify the publisher/seller. The question is pending in chat; the user has not supplied these details.
2. Add the App Store app to this project using that exact bundle ID, configure publisher-owned Apple credentials, and create/import the real Apple non-consumable. Map it to the existing entitlement and sole Lifetime package. Set USD 4.99 for the US storefront in Apple; localized prices must come from the store.
3. Set the Apple public SDK key and real public HTTPS support/privacy URLs in the appropriate ignored local/build environment. Keep server/signing secrets outside client code and Git. Rerun release preflight.
4. Verify SDK configuration logs, signed iPhone launch, real sandbox buy/cancel/pending/reinstall/restore/offline/refund behavior and the production entitlement guard. Complete native privacy/accessibility checks and paired playtests. Capture genuine Apple-sized screenshots of the final native build.
5. Confirm store privacy/age-rating/content-rights/export-compliance and App Review contact/metadata with the actual publisher. Never answer Data Not Collected for a configured RevenueCat purchase build.

Earlier unfinished licensing code, package scripts, Help/UI edits, notice data/tests and `.claude/launch.json` are preserved outside this checkpoint. Outer-root deletions and other work directories remain untouched. No push or publication.
