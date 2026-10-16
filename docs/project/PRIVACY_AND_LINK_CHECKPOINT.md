# Privacy and native-link checkpoint · 16 October 2026

Follows `26b968a`. **The submission goal remains incomplete.** Publisher configuration, signed iPhone/sandbox evidence, human playtests, archive validation and dependency assessment are still required.

## Privacy corrections

The old MONETIZATION.md blanket linked/diagnostics/identifier instructions contradicted the current vendor guidance. They are replaced with source-qualified guidance and `PRIVACY_DATA_INVENTORY.md`. The custom gameplay event layer is no longer described as though the entire app sends no data. Help now explains purchase history, the SDK-generated identifier and possible startup connections separately from local progress. It does not promise that case reset erases purchase records or OS backups.

The installed native privacy manifests were parsed. App config now includes a narrow, evidenced minimum for file timestamps (C617.1), app preferences (CA92.1) and framework timing (35F9.1). Required-reason preflight validation and vendor-provenance tests prevent accidental removal. An integration test calls the installed Expo privacy merge implementation and confirms that app configuration does not erase an SDK purchase-data disclosure or add duplicate reasons.

No empty “collected data” override, blanket tracking declaration or guessed full set of vendor reasons was added. Extra FileSystem declarations are recorded for actual binary/usage review. The exact expected RevenueCat iOS pod chain was checked against matching upstream tags; those are not installed Pods or an archive. Final privacy labels, policy retention/contact details and dashboard integrations still need publisher review.

## Native external-link mitigation

The installed query-string dependency uses an affected decoder. Instead of changing SDK-major dependencies or forcing an incompatible ESM decoder into its CommonJS caller, the app's supported native external-link entry is now filtered through `src/app/+native-intent.ts`:

- Reject malformed percent/UTF-8 escapes, raw controls, oversized input and unsupported schemes/hosts.
- Rebuild only `/`, `/help` or `/after-midnight`, with only recognized `source=library` / `source=locked_case` attribution on the offer.
- Discard fragments, unknown query fields, case ids and purchase/access flags. Forward no arbitrary encoded input. Internal case progress and entitlement logic are unchanged.

Tests cover current app-scheme and Expo development paths, malformed/double-encoded/oversized inputs, query stripping and bounded canonical output passed into the actual installed query-string parser. Two additional integration tests use the installed Router's context discovery/getLinkingConfig and a mocked native event boundary: the registered filter runs for supplied initial URLs and foreground link events, and the listener unsubscribes.

**Limits:** this mitigates the current native routing entry; it does not remove the dependency or clear its advisory. Web does not use NativeIntent. Expo Go preprocesses URLs before this hook; no general protection claim is made for that path. Physical OS URL delivery and actual signed-device behavior are unverified. Any future route, URL scheme or user-supplied navigation feature requires revisiting the whitelist.

## Actual checks

| Check | Result |
| --- | --- |
| `npm run check` | PASS: strict TypeScript, Expo lint, **62 domain/configuration + 13 component/SDK integration tests = 75**, no skipped tests |
| `npm run build:preview` | PASS: five static routes; NativeIntent adds no public web route |
| iOS/Android export with source maps | PASS: Hermes JS exports, **not signed binaries**; both maps include +native-intent and its filter |
| `npx expo install --check` | PASS: dependencies up to date |
| `npx expo-doctor` | FAIL: 19/21; online app-config schema fetch and React Native Directory metadata response failed; no checks disabled |
| `npm run release:preflight` | FAIL: same four missing publisher fields (bundle id, Apple public SDK key, support URL, privacy URL). Required-reason checks pass. |
| Dependency inventory | No dependency or lockfile change in this checkpoint; prior audit remains open, not resolved by the native filter |
| Browser | Current production Help text inspected at 375×667; no horizontal overflow and no warning/error logs; no policy/support URL configured yet |

Actual new JPEG: `docs/screenshots/2026-10-16/submission/privacy-disclosure-375.jpg`. It is a browser capture, not an App Store/device screenshot. Viewport override was reset. No push, cloud build, upload, store setup, payment or secret output occurred.
