# Apple In-App Purchase key · 19 October 2026

The publisher supplied an existing Apple In-App Purchase key file, Key ID and Issuer ID and explicitly authorized configuring RevenueCat. Uploaded that file directly through the signed-in RevenueCat dashboard to the existing TWO SIDES App Store app (`app8685bab13c`, project `projcfa9edbc`) and saved the supplied identifiers. The bundle ID remains `com.monirrouissi.twosides`.

## Verified live

- After saving and reloading, RevenueCat shows **Valid credentials**. Its validation-details dialog confirms **Valid key format** and **Valid permissions provided**.
- Independent official CLI readback reports `subscription_key_configured: true` (RevenueCat's In-App Purchase key field), exact expected app name/bundle, and `app_store_connect_api_key_configured: false`.
- The missing In-App Purchase key/bundle banner disappeared after reload. No other app, entitlement, offering, product, price, permission, server-notification setting or client SDK key was changed.
- Proof: `docs/screenshots/2026-10-19/revenuecat/in-app-purchase-key-valid.jpg`.

The private key contents were never printed or copied into the nested app. The original local `.p8` file is preserved outside the nested app and was verified untracked in the outer repository; neither it nor any secret was staged. No Apple key generation, account login change, purchase, build upload or store submission occurred.

## Still required

The separate **App Store Connect API key** remains unconfigured; the supplied In-App Purchase key was used only for its correct purpose. Actual Apple non-consumable product/US pricing and native sandbox buy/restore/refund behavior remain unverified. Valid service credentials are not proof of a working native transaction. Remote EAS configuration, support/privacy URLs, native startup and final iPhone screenshot/device gates remain as previously recorded.

This checkpoint changes external credential configuration and documentation only. No app code, dependencies, artwork, case content, save format or purchase-access guard changed. App checks were not rerun for a documentation-only diff: the unchanged current-worktree TypeScript/lint/notices/103-test and clean web-export results from the earlier 19 October visual-assets checkpoint remain the latest app evidence. Live validation, persisted CLI readback, screenshot decoding and `git diff --check` are the relevant checks here. Earlier unrelated release/licensing edits are preserved and excluded from this local checkpoint. No push.
