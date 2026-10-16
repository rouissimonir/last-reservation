# iOS data and privacy-manifest inventory

16 October 2026 · current committed app source and installed SDKs · **technical evidence, not final store answers**. Publisher identity, live policy/support URLs, RevenueCat dashboard verification and a signed archive remain unavailable. No account, store or dashboard setting was changed.

## Data flows verified in this source

| Surface | Actual data/use | Destination and control |
| --- | --- | --- |
| Case saves (`src/game/storage.ts`, `use-investigation.ts`) | Case/version, started flag, deduction index, confirmed answers, read flags, hint counts and larger-text setting | AsyncStorage on the device. One key per case; explicit per-case reset. No game sync/export or remote case-progress call is implemented. OS backups/migration are separate and must be checked on the device. |
| Gameplay events (`src/analytics/analytics.ts`) | Stable case/collection ids and purchase activity flags; no names, free text, device ids or clue contents | Release installs no sink. Development console logs only. This is not a statement about the purchase SDK's network traffic. |
| Purchase service (`service.native.ts`, `purchases-provider.tsx`) | SDK-managed customer information, product/offering lookup, purchase/restore and entitlement refresh | RevenueCat/app store. Configure has no appUserID; no login, email, customer attributes, IDFA collection or attribution integration calls were found in app source. Starts at configured native app startup, not only after tapping Buy. Web and Expo Go use the unavailable service. |
| Support/privacy buttons | Open the publisher's configured public HTTPS page | External page/browser. The app does not attach case data, a receipt or a customer identifier to these URLs. The publisher must inspect the actual pages and their own data handling. |

App source contains no custom fetch/axios backend, remote gameplay analytics sink, account form, payment-card form, contacts, camera or location request. This is a source audit, not a network trace of the final native SDKs. No personal player data, public keys or environment values were printed during this inventory.

RevenueCat generates an app user identifier when no custom identity is supplied. See its [customer identifier documentation](https://www.revenuecat.com/docs/customers/user-ids). “Anonymous” is the SDK's identity mode, not a promise that all purchase data is non-personal or erasable by resetting the game.

## Correcting the old store-disclosure instructions

RevenueCat's [Apple privacy guide](https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy) requires Purchase History, used for App Functionality and Analytics. It makes custom user/device identifiers conditional, and does not list diagnostics as automatic SDK collection. Linking and tracking answers depend on identification and integrations. The earlier MONETIZATION.md blanket linked/diagnostics advice was therefore corrected.

For the current anonymous, no-account source, review the vendor's anonymous-mode guidance against the actual dashboard before choosing linked/unlinked answers. Do not answer “Data Not Collected” for a configured purchase build. No final questionnaire was submitted. Apple's [privacy-detail guidance](https://developer.apple.com/app-store/app-privacy-details/) requires evaluating both the app and third-party partners; a local-only save does not describe all SDK behavior.

## Native manifest facts

These are the files actually present in node_modules, parsed with Python's plistlib. App-level declarations now contain three narrow required-reason entries supported by AsyncStorage and React Native's included manifests; these do not replace vendor data-collection disclosures.

| App-level entry | Code | Installed evidence |
| --- | --- | --- |
| File timestamp | C617.1 | `@react-native-async-storage/async-storage/ios/PrivacyInfo.xcprivacy`; also React Native core, Folly, glog and boost. Relevant to local app-owned storage. |
| User defaults | CA92.1 | `expo-constants/ios/PrivacyInfo.xcprivacy`, `expo-system-ui/ios/PrivacyInfo.xcprivacy`, React Native core. App/SDK preferences and purchase cache. |
| System boot/elapsed time | 35F9.1 | `react-native/ReactCommon/react/timing/PrivacyInfo.xcprivacy`; also boost and expo-device. Framework timing, not advertising. |

`expo-file-system/ios/PrivacyInfo.xcprivacy` also declares FileTimestamp 0A2A.1/3B52.1 and DiskSpace E174.1/85F4.1. Those vendor entries have **not** been blindly copied into app configuration: the game exposes no file picker or user-file feature, and every reason's conditions need final native usage/aggregation review. Their presence is recorded, not hidden. The three app-level entries are a verified minimum, not a claim that the final archive has every required reason.

Local `react-native-purchases` 10.14.0 podspec pins PurchasesHybridCommon 19.12.0. The vendor's [matching hybrid podspec](https://raw.githubusercontent.com/RevenueCat/purchases-hybrid-common/19.12.0/PurchasesHybridCommon.podspec) pins RevenueCat 5.95.0. Both upstream manifests were read at those exact tags:

- [Hybrid manifest](https://raw.githubusercontent.com/RevenueCat/purchases-hybrid-common/19.12.0/ios/PurchasesHybridCommon/PurchasesHybridCommon/PrivacyInfo.xcprivacy): UserDefaults CA92.1, no collected types in that wrapper, tracking false.
- [RevenueCat 5.95.0 manifest](https://raw.githubusercontent.com/RevenueCat/purchases-ios/5.95.0/Sources/PrivacyInfo.xcprivacy): UserDefaults CA92.1 and unlinked/non-tracking PurchaseHistory for AppFunctionality.

Those remote manifests describe expected dependency resources, not installed Pods or a verified archive. The SDK manifest's purpose list does not replace the separate store questionnaire/dashboard assessment.

## Build and owner gates

1. Inspect the generated app PrivacyInfo.xcprivacy and every embedded vendor resource in the signed archive. Compare actual Pod versions with the chain above. Confirm all used reason categories and conditions; address any extra FileSystem APIs based on actual usage. Expo documents possible static-Pod manifest aggregation gaps in its [privacy-manifest guide](https://docs.expo.dev/guides/apple-privacy/).
2. Inspect App Store validation/required-reason output for the real signed build. The local Expo merge regression test verifies that configuration merges without erasing SDK collected-data entries; it is not an archive test.
3. Verify RevenueCat project integrations and data retention/deletion handling. The app has no custom account; local case reset does not delete the SDK/store's purchase records. The publisher must supply an actual support contact and policy describing those controls.
4. Complete current App Store privacy/age-rating/export-compliance fields from the final app, SDKs and publisher operations. No publisher identity, retention period, ATT decision or legal declaration is invented here.
5. Publish and open the final support/policy URLs only with the owner's authorization. Rerun release preflight and device checks; required-reason configuration does not resolve the missing bundle id/public SDK key/URLs.

The selected native build has not been created on this Windows machine. The app remains **not submission-ready** until these and the other IOS_SUBMISSION.md gates have evidence.
