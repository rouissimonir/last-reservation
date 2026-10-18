# RevenueCat and offer checkpoint · 18 October 2026

The user authorized retaining five free mysteries and a USD 4.99 US-storefront target for one non-consumable unlocking exactly three After Midnight cases. This checkpoint updates the existing integration; it does not claim a live store connection.

## Implemented

- Existing `react-native-purchases` 10.14.0 remains installed. The native adapter configures once at startup, reads signed active entitlements, fetches offering `after_midnight`, and purchases/restores through the SDK. `after_midnight_collection` unlocks exactly the three premium cases; free access remains independent of ownership. No ownership flag is written to local saves.
- Removed an unsafe fallback that accepted an offering's sole package, including a subscription. Now require exactly one Lifetime package (`$rc_lifetime`), a non-subscription category, no subscription period and a localized price. iOS requires `NON_CONSUMABLE`; Android accepts its unknown subtype only for the non-subscription category and rejects explicit consumables. Store/dashboard configuration must still establish Android non-consumability. No fallback to `current` or another collection.
- Clear cached packages when reloading/rejecting an offer, and key purchases by offering plus package id. A previously valid quote cannot be purchased after a failed validation of its replacement.
- Updated library and offer prose to the supplied after-dark description and “One-time purchase. Hints included. No subscription.” The ready CTA reads “Unlock all 3 — {localized price}” with the future-collections disclaimer beneath it. Price always comes from RevenueCat/store metadata; no hard-coded USD price or fabricated quote.
- Removed unsupported “longer” marketing. Free heading is “Five complete mysteries. Free to play together.” The first-case line recommends The Last Reservation; the user explicitly confirmed on 18 October that it should remain first. No case content, edition, answer, save identity, artwork, purchase entitlement or package dependency changed.
- Recorded the early-tester approach before any paid Instagram promotion. No outreach or promotion purchase occurred.

## Developer plugin

The connected plugin search found no RevenueCat directory result. Following the official [RevenueCat/ai-toolkit installation instructions](https://github.com/RevenueCat/ai-toolkit) and the installed Codex CLI's supported commands, added marketplace `RevenueCat` and installed **`revenuecat@RevenueCat` 2.3.0**. `codex plugin list --marketplace RevenueCat --json` confirmed installed and enabled. The lowercase plugin name comes from its marketplace manifest. No Android subscription-lifecycle add-on was installed for this iOS-first, non-consumable scope.

Read its `integrate-revenuecat` and `revenuecat-purchase-flow` React Native guidance. Kept the existing custom offer screen and native SDK adapter. No new REST API/backend or Postman workspace was needed for this SDK-boundary change. HTTP simulations would not establish StoreKit/native-bridge behavior; the adapter's SDK callbacks were explicitly mocked in Jest and are reported as such.

`codex mcp login RevenueCat` started OAuth, and its authorization page was queued in the app. **Authorization timed out without a callback.** No authenticated project inspection, live product creation, price change or entitlement/offering mapping was performed. No OAuth URLs, tokens, secret API keys or signing credentials were written to project files. Restart the login when the publisher is ready. Account/project data cannot be inferred from the successful plugin install.

## Actual validation

| Check | Result |
| --- | --- |
| `npm run check` | PASS: TypeScript, lint, notices validation, 78 domain + 25 component/SDK-boundary tests = **103 current-worktree tests**. No skips. |
| New targeted tests | PASS: six native-adapter tests with the SDK bridge mocked, plus one real offer-component test using `5,99 €`, including pending-state disabling. |
| `npm run build:preview` | PASS: six actual static web routes. |
| Expo iOS + Android export to dist-native | PASS: both Hermes JavaScript bundles. Not signed apps or device tests. |
| `npx expo install --check` | Initial online request timed out; exact-command retry PASS, dependencies up to date. |
| `npx expo-doctor` | FAIL: 20/21; existing online app-config schema fetch failed. No check bypassed. |
| `npm run release:preflight` | FAIL as intended: permanent iOS bundle identifier, Apple public RevenueCat SDK key, support URL and privacy URL missing. |
| Dependency maps / whitespace | package.json root dependencies match package-lock; `git diff --check` PASS. |

Four passing tests and notice checks belong to earlier unfinished licensing work, preserved outside this scoped commit along with its package scripts, Help/UI changes, notice code/data and license texts. No dependency/lockfile change forms part of this checkpoint.

Production-export browser inspection at 375px verified the new copy, all three premium titles, no horizontal overflow, and a truthful unavailable purchase area with disabled restore on web. Warn/error log empty. Real screenshot: `docs/screenshots/2026-10-18/revenuecat/offer-copy-375.jpg`. A working native purchase price/button is established only by the mocked component test, not this web screenshot. The browser does not sell, simulate a successful transaction or unlock content.

## Remaining account and iOS work

1. Complete RevenueCat OAuth, identify/reuse the correct existing project, and supply the permanent publisher-owned iOS bundle id and App Store Connect app status.
2. Configure one Apple **Non-Consumable**, target **USD 4.99** in the US storefront, mapped to entitlement `after_midnight_collection`, offering `after_midnight`, and its sole Lifetime package. Proposed product ids in PURCHASE_SETUP are not live ids. Do not create duplicates without inspecting the account.
3. Set the app's Apple public SDK key and real support/privacy URLs; signing keys and RevenueCat server secrets stay outside the app/repository. Pass preflight, then obtain a signed development build with the publisher's authorization and accounts.
4. Verify native SDK configuration logs, sandbox purchase, cancellation/pending, reinstall/restore, offline cached ownership and refunds/revocations on the signed iPhone build. Native/device/human/store-readiness claims remain open. No push, app upload, paid build or store submission occurred.

Setup contract: `PURCHASE_SETUP.md`; durable product decision: `MONETIZATION.md`. Relevant primary references: [non-subscription purchases](https://www.revenuecat.com/docs/platform-resources/non-subscriptions), [entitlements](https://www.revenuecat.com/docs/getting-started/entitlements), [React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative).
