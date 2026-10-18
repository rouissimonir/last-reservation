# Purchase setup — steps that need your accounts

**18 October follow-up:** OAuth now succeeds. The user authorized a separate TWO SIDES project, created as `projcfa9edbc`, with one USD 4.99 Test Store non-consumable mapped to `after_midnight_collection`, offering `after_midnight` and its sole `$rc_lifetime` package. Readbacks verified. This is a test catalog; real Apple app/product/key and publisher fields remain unset. See `ASO_REVENUECAT_CHECKPOINT.md` for current evidence. Older timeout/account statements below describe the earlier checkpoint.

The app already includes the RevenueCat native SDK adapter, entitlement gate, purchase/restore handling and a custom offer screen. On 18 October the official `RevenueCat/ai-toolkit` marketplace and `revenuecat@RevenueCat` plugin (2.3.0) were installed and verified enabled. OAuth timed out before authorization completed; project access and live catalog changes have not been confirmed. The account/store setup below remains outstanding unless a later checkpoint records actual evidence. Agreements, banking, credentials and signed-device checks still need the publisher. Current command/test evidence: `REVENUECAT_CHECKPOINT.md`.

## 0. Decide the app identifiers (blocker)

`app.json` has **no `ios.bundleIdentifier` and no `android.package`** yet. Choose them once; they cannot change after release. Example shape only: `com.yourname.twosides`.

```json
"ios": { "bundleIdentifier": "<your bundle id>" },
"android": { "package": "<your package name>" }
```

## 1. Identifiers used by the code

| What | Value | Where |
|---|---|---|
| Internal collection id | `after_midnight` | `src/monetization/catalogue.ts` |
| RevenueCat entitlement id | `after_midnight_collection` | catalogue (`entitlementId`) |
| RevenueCat offering id | `after_midnight` | catalogue (`offeringId`) |
| Package in that offering | Lifetime (`$rc_lifetime`) | Exactly one package, backed by the non-consumable; no sole-subscription or current-offering fallback |
| Store product id (proposed) | iOS `<bundle id>.after_midnight_collection`; Play `after_midnight_collection` | Store consoles, then attached in RevenueCat |

The app never falls back to the "current" offering, so a misconfigured dashboard shows "not available" instead of selling the wrong product.

The intended iOS configuration is one non-consumable at the US storefront target price USD 4.99, attached to entitlement `after_midnight_collection` and offering `after_midnight`. It unlocks exactly the three After Midnight cases; all five free cases stay accessible. The permanent Apple product id is still proposed rather than created. App prices come only from the store's localized `priceString`; a US target is not a fixed price for every storefront.

## RevenueCat toolkit connection

Official source: [RevenueCat/ai-toolkit](https://github.com/RevenueCat/ai-toolkit). Installed via `codex plugin marketplace add RevenueCat/ai-toolkit` then `codex plugin add revenuecat@RevenueCat`. `codex plugin list --marketplace RevenueCat --json` confirmed version 2.3.0 installed and enabled. Plugin installation is a local developer-tool change, not an npm dependency or a live RevenueCat catalog operation.

Complete the queued OAuth authorization. If it expires, restart it with `codex mcp login RevenueCat`. Do not commit OAuth URLs/tokens, server secrets or signing credentials. Until authenticated project tools and the correct app are available, do not claim projects/products/entitlements/offerings have been created or inspected. The existing custom paywall remains; no separate RevenueCatUI redesign is required. Native sandbox purchase/restore and SDK-configuration logs remain required evidence.

## 2. App Store Connect

1. Accept the **Paid Apps agreement** and complete tax and banking (Agreements, Tax, and Banking). Purchases do not work until this is active.
2. Create the app record with the bundle id from step 0.
3. Monetization → In-App Purchases → **Non-Consumable**: reference name “After Midnight Collection”, product id from the table, price **USD 4.99** (let Apple derive other storefronts or set them), display name and description (spoiler-free; reuse the offer copy), review screenshot of the offer screen.
4. Users and Access → Integrations → **In-App Purchase key** (.p8): download and upload it to RevenueCat. Never commit it (`*.p8` is git-ignored).
5. Create a **Sandbox tester** for native tests.

## 3. Google Play Console

1. Set up a payments profile (merchant account).
2. Create the app with the package name from step 0 and upload any signed build to a test track first (Play only shows products for an uploaded app).
3. Monetize → Products → **In-app products** (one-time): id `after_midnight_collection`, price USD 4.99, title and description.
4. Create a Google Cloud **service account** with the permissions RevenueCat's guide lists, and upload its JSON key to RevenueCat. Never commit it (`service-account*.json` and `credentials.json` are git-ignored).
5. Add **license testers**.

## 4. RevenueCat dashboard

1. Create a project; add an App Store app and a Play Store app with the identifiers above; attach the .p8 key and the service-account JSON.
2. Products: import both store products.
3. Entitlements: create `after_midnight_collection`; attach both products. Do **not** attach these products to any other entitlement, and give any future collection its own entitlement.
4. Offerings: create `after_midnight`; add a **Lifetime** package with both products.
5. Enable **Trusted Entitlements** handling (the app configures `INFORMATIONAL` mode and refuses entitlements whose verification is not `VERIFIED`/`VERIFIED_ON_DEVICE`).
6. Copy the **public** SDK keys (Apple `appl_…`, Google `goog_…`).

## 5. Local configuration

Create `.env` (git-ignored; see `.env.example`):

```
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_...
EXPO_PUBLIC_SUPPORT_URL=https://...
EXPO_PUBLIC_PRIVACY_URL=https://...
```

These are public keys and URLs, inlined into the bundle. Never put secret keys (`sk_…`), the .p8, or service-account JSON in `.env` or the repo. For EAS builds, set the same values as EAS environment variables. With no key, the app shows "not set up in this build" and keeps the collection locked.

## 6. Native builds and tests

Expo Go cannot test purchases (the app treats it as unavailable on purpose). Install EAS CLI and build a development client:

```bash
npx eas-cli build --profile development --platform ios
```

`expo-dev-client` and `react-native-purchases` are already installed with `npx expo install`. Local `eas.json` profiles now exist for development, internal preview and production/store; they do not link an Expo/Apple account or create signing credentials. The user selected iOS first. Follow `IOS_SUBMISSION.md`, supply the permanent bundle id/public configuration and pass `npm run release:preflight` before authorizing a cloud build. No EAS build or store setup has been performed here.

Native test checklist (record results in `RELEASE_READINESS.md`):

- [ ] Offer shows the store's localized price; Buy is disabled while loading.
- [ ] Sandbox purchase unlocks all three cases without restarting; `purchase_verified` logs `sandbox: true`.
- [ ] Cancel in the store sheet returns calmly ("No purchase was made"), nothing unlocks.
- [ ] Ask to Buy / Play pending purchase shows the pending message, then unlocks after approval.
- [ ] Airplane mode: owned cases stay open from RevenueCat's cache; the offer shows "could not be reached".
- [ ] Delete and reinstall, then Restore Purchases unlocks; a store account without the purchase gets "No purchase … was found".
- [ ] Refund/revoke in sandbox (Apple: StoreKit test refund; Play: refund in Order management), foreground the app: the three cases lock again, saves remain.
- [ ] Background the app during the store sheet and return: state is correct.
- [ ] Resetting an After Midnight case does not affect ownership.
- [ ] A release build ignores `EXPO_PUBLIC_DEV_PREVIEW_PREMIUM=1`.
