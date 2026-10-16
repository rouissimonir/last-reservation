# TWO SIDES — status

Authoritative status, 16 October 2026 · Windows. Earlier history: `docs/STATUS.md`, `THIRD_CASE_REPORT.md`.

## After Midnight Collection and five-case free catalogue (this checkpoint)

Implemented:

- Free collection "The Bellweather Files": The Missing Envelope, The Last Reservation, The Silent Piano (unchanged; digests and save keys pinned) plus two new cases, **The Masquerade Coat** (04) and **The Music Box** (05).
- Paid "After Midnight Collection": **The Room That Was Never Booked** (06), **The Last Call at Midnight** (07), **The Portrait Behind the Wall** (08), five deductions each, distinct mechanics. One entitlement, `after_midnight_collection`, unlocks exactly these three.
- RevenueCat (`react-native-purchases` 10.14.0, `expo-dev-client`, installed with `npx expo install`): localized price, purchase, cancel, pending, failure, unverified, restore, listener and foreground refresh for refunds/revocations; trusted-entitlement verification; Expo Go and web treated as unavailable; no stored ownership flag; development preview only in `__DEV__` bundles with an explicit flag.
- Library with free/paid sections and a first-case recommendation; offer screen at `/after-midnight` with honest loading/unavailable/pending/cancelled/failed/success states, Restore Purchases, close, support/privacy links when configured; "Choose your next mystery" on endings; temporary native cover objects; local analytics event layer with no remote sink.

Changed files: `src/game/{case,cases}.ts`, new case files, `src/game/{presentation,case-events}.ts`, `src/game/use-investigation.ts`, `src/game/tokens.ts`, `src/components/{investigation,case-library,game-ui}.tsx`, new `case-emblem.tsx`, `collection-offer.tsx`, `src/app/{_layout,after-midnight}.tsx`, `src/monetization/*`, `src/analytics/analytics.ts`, tests, `package.json`/lockfile, `.env.example`, docs.

Checks, screenshots and what remains: `docs/project/RELEASE_READINESS.md`. Short version: all local checks pass except pre-existing Expo patch drift and an offline Doctor schema fetch; AI blind solves (two rounds) found every intended answer after fixes; **no native purchase test and no human playtest has been done**, and app identifiers, store products and RevenueCat setup need your accounts (`PURCHASE_SETUP.md`). Not release-ready.

Documents: `MONETIZATION.md`, `AFTER_MIDNIGHT_COLLECTION.md`, `PURCHASE_SETUP.md`, `RELEASE_READINESS.md`, `BACKLOG.md`, `cases/*.md` (author-only).

## The Silent Piano (previous checkpoint)

Unchanged except its cover now uses a native piano emblem instead of the borrowed envelope. See `THIRD_CASE_REPORT.md`.
