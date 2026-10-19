# App Store Connect API key · 19 October 2026

The publisher provided an existing `AuthKey_*.p8` file and identifiers and authorized configuring the separate App Store Connect API section of the existing TWO SIDES RevenueCat app (`app8685bab13c`, project `projcfa9edbc`). Uploaded directly through the dashboard, saved, reloaded and verified. The original purchase-validation key and bundle `com.monirrouissi.twosides` are preserved.

## Verified live

- RevenueCat shows **Valid credentials** after reload. API-key validation details report **Valid key format**, **Permissions to list apps**, and **Permissions to get subscriptions info**.
- Official CLI app readback independently confirms both `subscription_key_configured: true` and `app_store_connect_api_key_configured: true`, with the expected app name/bundle.
- Screenshot: `docs/screenshots/2026-10-19/revenuecat/app-store-connect-api-key-valid.jpg`.
- Vendor number is optional in the displayed form and remains blank; no financial-report configuration or unrelated account details were invented.

Private key contents were not printed, copied into the nested app or staged. The original file is preserved outside the nested app and verified untracked in the outer repository. No key generation, access/role change, app code/dependency change, App Store metadata/product mutation, purchase, upload/build or submission occurred. Existing unrelated licensing/release work remains excluded from this checkpoint.

## App Store work still available

Searched the available plugin catalog for App Store Connect; no dedicated relevant plugin was returned. This is not an exhaustive claim about all plugins. The existing official RevenueCat toolkit/dashboard can manage its integration; Apple's official API or signed-in browser can support App Store listing, in-app-purchase and TestFlight preparation within the supplied key's actual permissions. The validation above proves read permissions only, not every management permission. No new App Store action was inferred merely from the publisher asking what is possible.

Next reviewable items remain the five-free/three-paid listing copy, matching After Midnight non-consumable and USD 4.99 US target, real support/privacy URLs, native build/sandbox buy/restore checks and final native screenshot comparison. Source: https://developer.apple.com/app-store-connect/api/ . The screenshot drafts remain web-based, even after adding a device frame.

Relevant checks are live credential validation, persisted CLI readback, proof-image decoding and `git diff --check`. No runtime code changed, so the unchanged 19 October app test/export results remain the latest app evidence; no new native/store transaction success is claimed. Local documentation-only checkpoint; never pushed.
