# After Midnight implementation backlog (evidence-based)

Written 16 October 2026 from an audit of commit `8d293a1`. Status as of the end of this session.

| # | Finding in the repository | Work | Status |
|---|---|---|---|
| 1 | Only three free cases (`src/game/cases.ts`); library labelled "LOCAL DEVELOPMENT PREVIEW · All cases open" | Add two distinct free cases; replace the preview banner with free/paid sections | Done |
| 2 | No purchase, entitlement or analytics code anywhere in `src/`; no store SDK in `package.json` | Add RevenueCat via `npx expo install react-native-purchases expo-dev-client`; pure entitlement/purchase modules | Done (native untested) |
| 3 | `app.json` has no iOS bundle id or Android package | Choose identifiers; product ids derive from them | **Blocked: needs your decision** |
| 4 | Existing case digests pinned; `tests/existing-cases-compat.test.ts` asserts the catalogue had exactly three cases | Keep collection membership outside `CaseDefinition`; append new cases; update the count assertions only | Done |
| 5 | Save keys per case already validated and serialized (`storage.ts`) | Reuse unchanged for new cases; never store ownership | Done |
| 6 | Single Expo Router route; case navigation is internal state | Offer as its own route `/after-midnight`; close the case before opening it | Done |
| 7 | `Paper` hard-coded "OCTOBER 1994"; evidence kinds limited | Presentation map (`src/game/presentation.ts`) for date and cover object; add log/plan/archive kinds | Done |
| 8 | The Silent Piano reused the envelope cover | Native piano emblem (temporary) | Done |
| 9 | Ending only offered replay | "Choose your next mystery" on every ending | Done |
| 10 | `.gitignore` already ignores `.env*`, `*.p8`, credentials | Add `.env.example` with public keys only | Done |
| 11 | Expo patch drift (`expo`, `expo-router`, `@expo/ui`) predates this work | Left as is; upgrade in its own change | Open |
| 12 | No artwork generator in this session | Temporary native emblems; list final art | Open (art) |
| 13 | No human playtests exist for any case | Paired sessions for cases 04–08 | Open (people) |
| 14 | Native purchase behaviour cannot be exercised in a browser | EAS development build and sandbox tests (`PURCHASE_SETUP.md`) | Open (accounts) |
