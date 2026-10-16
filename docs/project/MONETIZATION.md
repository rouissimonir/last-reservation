# Monetization — durable requirements

Decided 16 October 2026. This supersedes every earlier monetization proposal in this repository (including the "local development preview, all cases open" library and the overnight mission's purchase notes).

## Product decision

- **Free collection, “The Bellweather Files”:** five complete, permanently free mysteries — The Missing Envelope, The Last Reservation, The Silent Piano, The Masquerade Coat, The Music Box. They stay free; their ids and saves are never changed.
- **Paid collection, “After Midnight Collection”:** three new, longer mysteries — The Room That Was Never Booked, The Last Call at Midnight, The Portrait Behind the Wall — unlocked together by **one non-consumable purchase**.
- US storefront target price **USD 4.99** (set in App Store Connect / Google Play, not in code). The app always shows the store's localized `priceString`; "$4.99" is never hard-coded.
- The purchase covers this named collection only. It does not promise future releases. No subscriptions, advertising, paid hints, energy, timers or consumables.
- Positioning line: **“One purchase. Two players. Three new mysteries.”**
- No playtime is advertised. Player-facing covers/cards show deduction counts and no time limit; provisional durations remain author metadata only.

## Player flow (implemented)

1. Library leads with “New to TWO SIDES? Start with The Missing Envelope” while that case is unstarted, and badges it “Recommended first case”.
2. Library has two sections: The Bellweather Files · FREE, and After Midnight Collection (ONE-TIME PURCHASE / OWNED / PREVIEW).
3. The offer can be opened at any time from the library; finishing the free cases is not required.
4. Selecting a locked premium case opens the offer (`/after-midnight?source=locked_case`). A premium case opened without access (for example after a refund) shows a gate instead of any case content; its save is kept.
5. A verified purchase or restore unlocks all three cases immediately through React context — no reinstall.
6. Owners open/continue premium cases from the library like free ones.
7. Every ending offers “Choose your next mystery”, which returns to the library. Nothing interrupts a deduction or withholds an ending.

## Separation of concerns

| Concern | Where | Notes |
|---|---|---|
| Case content | `src/game/*.ts` case files | Unchanged shape; new cases appended. |
| Progress | `src/game/storage.ts` | One validated key per case: `two-sides/<case-id>/v1` (mini-case keeps `two-sides/missing-envelope/v1`). No purchase data ever stored here. |
| Collection membership | `src/monetization/catalogue.ts` | `bellweather_files` (free), `after_midnight` (paid, entitlement `after_midnight_collection`, offering `after_midnight`). Validated by tests. |
| Verified entitlements | `src/monetization/access.ts`, `service.native.ts` | RevenueCat CustomerInfo, `entitlementVerificationMode: INFORMATIONAL`; only `VERIFIED`/`VERIFIED_ON_DEVICE` active entitlements count. Ownership is never an AsyncStorage boolean; offline play relies on the SDK's signed cache. |
| Development preview | `isDevPreviewEnabled(__DEV__, EXPO_PUBLIC_DEV_PREVIEW_PREMIUM)` | Needs both a development bundle and the flag `1`; release bundles have `__DEV__ === false`. Shown with a visible “DEVELOPMENT PREVIEW” label. |

Resetting a case only rewrites that case's save key; purchases live in the store account and are unaffected.

## Purchase states

`src/monetization/purchase-state.ts` is a pure reducer (tested): offer loading / ready / unavailable (`web`, `expo-go`, `not-configured`, `no-offering`, `store-error`); activity idle / purchasing / pending / cancelled / failed (network, store, not-allowed, already-owned, unknown) / unverified / purchased / restoring / restored / nothing-restored / restore-failed. Rules:

- No active Buy button unless a store offer with a localized price is loaded.
- Cancellation shows only “No purchase was made.”
- A store "success" without the verified entitlement is shown as **unverified** and stays locked.
- Pending (Ask to Buy, deferred payments) unlocks automatically when the customer-info listener reports the entitlement.
- On every return to the foreground the provider re-reads customer info, so refunds/revocations reported by the store remove access and completed pending purchases grant it.
- Web and Expo Go never construct the SDK path; nothing is mocked as successful.

## Analytics

No gameplay analytics provider was added (CLAUDE.md forbids remote analytics without a deliberate decision). `src/analytics/analytics.ts` defines gameplay/purchase UI events and a sink registry; development builds log to the console, and release builds install no event sink. **This describes the custom event layer only.** RevenueCat's native purchase verification has separate network traffic and dashboard analytics; it must not be described as an app that sends no data.

Events (stable ids only, no names, answers, free text or device ids): `case_started`, `case_completed`, `premium_case_started` (`case_id`, `collection_id`), `collection_offer_viewed` (`source`), `purchase_started`, `purchase_verified` and `purchase_restored` (`sandbox` flag), `purchase_failed` (`reason`). Sandbox/TestFlight purchases carry `sandbox: true`; RevenueCat also separates sandbox from production revenue in its dashboard.

To turn analytics on later: choose a provider, add one sink in `purchases-provider.tsx`, update the privacy policy and store privacy labels, and keep payloads as above.

## SDK data collection and privacy disclosures

See `PRIVACY_DATA_INVENTORY.md` for the source-audited data flow and native manifest evidence. The app configures RevenueCat without a custom user id or customer attributes; configured native builds start the purchase service and refresh it at app startup, including for free-case players. Local case saves are not sent to that service.

- The earlier blanket instructions to mark purchase data linked and to declare diagnostics/identifiers were inaccurate. RevenueCat's current [Apple privacy guide](https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy) requires purchase history for App Functionality and Analytics; other fields depend on actual integrations and identification.
- Publisher review must confirm dashboard integrations, identity linking, tracking and retention/contact handling before entering final store answers or publishing the policy. No tracking SDK/IDFA collection calls or custom identity attributes were found in this app's source. That source finding does not certify an uninspected dashboard or final binary.
- Android store disclosure remains a separate future-platform review; the selected target is iOS first.
