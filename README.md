# TWO SIDES — The Bellweather Files

Cooperative mysteries for two people sharing one phone. **Free:** The Missing Envelope, The Last Reservation, The Silent Piano, The Masquerade Coat and The Music Box. **After Midnight Collection** (one non-consumable purchase through RevenueCat): The Room That Was Never Booked, The Last Call at Midnight and The Portrait Behind the Wall. Purchases need a native development or release build; the web preview and Expo Go show the collection locked. Lengths of the new cases are not yet measured; older duration targets remain UNVALIDATED. Current status: `docs/project/STATUS.md`; monetization rules: `docs/project/MONETIZATION.md`; store setup: `docs/project/PURCHASE_SETUP.md`.

**Submission work now targets iOS first.** See [the current submission gates](docs/project/IOS_SUBMISSION.md). The app is not ready for store submission until publisher configuration, native purchase/device checks and human playtests are complete. `npm run release:preflight` reports missing local configuration without printing values. Original launcher/splash art and six generated cover illustrations now replace the template logo and temporary case shapes. Help, support and privacy are reachable from the case library.

To open the paid cases in a local development preview without buying, start the web server with `EXPO_PUBLIC_DEV_PREVIEW_PREMIUM=1` (development bundles only; release builds ignore it).

## Windows setup and launch

The application is in the **nested** folder below. Use PowerShell. Node.js 22.13 or newer is required by Expo SDK 57; the connected machine was checked with Node 22.14.0 and npm 10.9.2.

```powershell
Set-Location -LiteralPath 'C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation'
npm ci
npm run web -- --lan --port 8081
```

Open [http://localhost:8081](http://localhost:8081) on this PC. The first bundle may take a minute. Keep the terminal running; Ctrl+C stops it. If a preview is already running, open its URL instead of starting a second server. If 8081 is occupied by another app, stop that app or choose another port and use the URL Expo prints.

### Your phone

The simplest route today is the **phone browser**. Connect the phone and PC to the same Wi-Fi. While the web server is running, open `http://<PC-Wi-Fi-IPv4>:8081` in Safari or Chrome. At implementation time this PC's address was [http://192.168.1.163:8081](http://192.168.1.163:8081); DHCP can change it. Find the current address with:

```powershell
Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway } | Select-Object InterfaceAlias, IPv4Address
```

If the phone cannot connect, check that both devices are on the same non-isolated Wi-Fi and that Windows permits Node.js on your private network. No tunnel, hosting, account or paid build is needed for browser play. Saves are local to each browser/device/origin; localhost and the Wi-Fi address have separate saves.

For a native Expo Go session, stop the web server and run:

```powershell
npm start -- --lan --go
```

Use a **matching SDK 57** native client and scan Expo's terminal QR code. Expo's current [physical-iOS compatibility guidance](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) says the App Store Expo Go client stops at SDK 54; it cannot run this SDK-57 project. For an immediate iPhone playtest, open the web preview in Safari. A matching custom native client requires a separate native build/distribution workflow. See `docs/IOS_RUNTIME_TROUBLESHOOTING.md` for the reported missing-module failure, verified local checks and pending client information. No native launch fix or physical-device success is claimed.

## Checks

The active Git root, verified on 16 October, is now `C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation`. Run all npm commands there. Historical overnight reports refer to the separate outer repository. Do not clean or stage parent-repository work.

```powershell
npm run typecheck
npm run lint
npm run test:ci
npm run build:preview
npx expo install --check
npx expo-doctor
npm run release:preflight
```

`typecheck` uses strict TypeScript; `lint` uses Expo ESLint. `test:ci` runs the Node test-runner suite through tsx once and exits; it has no watch mode. Tests cover all authored walkthroughs, wrong choices, read/hint gates, duplicate/stale submissions, case-specific saving/reset, malformed saves, write failures, broken/cyclic content references, entitlement boundaries and release configuration checks. `build:preview` performs a real Expo web export into ignored `dist/`; it does not publish anything. `npm run check` remains available for typecheck, lint and tests together. Optional `npx expo export --platform all` checks iOS/Android JavaScript bundling, not native compilation or device behavior. Release preflight intentionally fails until the publisher's iOS identifier, Apple public SDK key and live URLs are configured.

`test:ci` includes `test:domain` (62 tsx tests) and `test:ui` (13 Jest Expo/RNTL component/SDK tests, `--ci --runInBand`): **75 tests**. Both exit without watching. Coverage includes private-sheet unmounting, route focus, revoked access, damaged-save UI, purchase-provider timing, collection navigation, native external-link registration and privacy-manifest merging. `test-renderer` is pinned to 1.2.0 for React 19.2.3 compatibility. Native boundaries are mocked; these do not contact a store or replace device testing.

The native URL-entry filter is not a dependency-advisory fix or a replacement for signed-device checks. Current evidence: [privacy/link checkpoint](docs/project/PRIVACY_AND_LINK_CHECKPOINT.md); data flow and archive gates: [privacy inventory](docs/project/PRIVACY_DATA_INVENTORY.md). Earlier browser regression captures are recorded in [submission regression](docs/project/SUBMISSION_REGRESSION.md).

Install future dependencies with `npx expo install <package>` (or `--dev` for tools). Preserve package-lock.json and SDK-compatible versions.

## Human inspection

See `docs/MORNING_HANDOFF.md` for actual results, screenshot links and a ten-minute inspection checklist. Answer sequences and narrative proofs are kept in the author-only case-solution documents. Use fresh players without those documents for fairness/duration playtests.

## Review map and limits

- `src/game/case.ts`: preserved mini-case evidence, hints and ending. `src/game/last-reservation.ts`: full-case content. `src/game/cases.ts`: catalog, metadata and structural reference validation.
- `src/game/engine.ts`: typed investigation reducer and separate presentation types. Domain progress never depends on back navigation or route history.
- `src/game/storage.ts`: case-specific strict save validation and sequential writes. The original mini-case save key is retained. A failed load never writes; replacement needs confirmation and affects one case. Failed writes display a retry banner. Session-only play preserves the old save, but leaves memory when its case screen is closed.
- `src/components/case-library.tsx`: free and After Midnight sections, separate progress cards, open/continue and confirmed replay. `src/components/collection-offer.tsx` and `src/app/after-midnight.tsx`: the offer. `src/monetization/`: catalogue, access, purchase state and RevenueCat service (`service.native.ts`; web uses `service.ts`).
- `src/components/investigation.tsx`: native UI. Private branches unmount on conceal; no side-by-side clues. Notebook contains confirmed deductions and role-labelled revisit buttons only.
- `src/components/game-ui.tsx` and `src/game/tokens.ts`: shared palette, spacing, paper variants, role icons, controls, background layers and reduced-motion-aware reveals. All case text stays in native Text. The private reader's bottom action occupies a reserved sibling area below the scroll view; shared screens have no persistent footer.
- `assets/art/`: supplied hotel background, transparent envelope and closed folder, and paper texture. Originals are preserved; smaller local copies in `optimized/` are bundled. See the asset README for names, dimensions and preparation. Earlier artwork and prompts remain in `visual/`. No fonts or artwork are fetched remotely during play.
- `docs/CASE_PUBLIC.md`: spoiler-free reviewer handoff, in unlock order.
- `docs/CASE_SOLUTION.md`: author-only proofs, hints and ending; never imported by the app.
- `docs/LAST_RESERVATION_PUBLIC.md` and `docs/LAST_RESERVATION_SOLUTION.md`: full-case player overview and separate author timeline/proofs/ending.
- `docs/STATUS.md`: actual validation and remaining checks.

Native AppState handling returns to cover when inactive/backgrounded; Android back does the same. Browser visibility/pagehide/blur conceals content. These are best-effort lifecycle responses, **not verified native screenshot protection**. No screen-capture prevention is installed. Short 160ms reveals and press feedback respect reduced motion; outgoing private content unmounts immediately and never crossfades into the next role. There is no essential audio, backend, authentication or remote analytics. The only purchase is the After Midnight Collection through RevenueCat. React DOM is inherited solely for Expo's web runtime; the UI uses React Native components and StyleSheet, with Expo LinearGradient for decorative shading.

The separate parent repository contains unrelated work preserved by this session. Checkpoints include this app only. Hourly in-chat checks look for new `fixes.md` findings and record verified fixes/rejections in `docs/FIXES_LOG.md`; the separate kit runner has not been started. The user's current submission goal supersedes the historical overnight implementation scope.
