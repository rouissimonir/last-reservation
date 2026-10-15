# iOS startup report — 15 October 2026

Status: **BLOCKED pending the installed iPhone client's version/SDK and installation source, followed by a native retest.** The failure was reported in `fixes/logs.md`; it has not been reproduced on connected iOS hardware. No native fix is claimed.

## What was verified locally

- App directory: `C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation`.
- Both running Metro servers, ports 8081 and 8082, return that exact `projectRoot`, SDK `57.0.0`, runtime `exposdk:57.0.0`, and `node_modules/expo-router/entry`. Neither currently serves the old outer template. Both processes were preserved.
- Installed dependency tree resolves one SDK-57 set: `expo 57.0.29`, `react-native 0.86.3`, `expo-asset 57.0.20`, `expo-constants 57.0.22`, `expo-modules-core 57.0.23`. `expo-asset` is provided by the existing Expo dependency; it is not a missing npm package.
- `npx expo-modules-autolinking resolve --platform apple --json` resolves `expo-asset` → `AssetModule` / `ExpoAsset` pod, and `expo-constants` → `ConstantsModule` / `EXConstants` pod. This verifies local discovery, not the modules inside the already installed iPhone binary.
- package.json has the normal Expo Router entry. app.json has no conflicting `sdkVersion` or custom runtime override. There is no custom Metro/Babel resolver or native project generated in this app.
- `npm run check` passed TypeScript, lint and all 14 tests. `npx expo install --check` reported dependencies up to date. The latest supplemental Doctor attempt failed its online config-schema fetch (one failed check); the earlier morning 21/21 result remains historical, not a native runtime guarantee.
- The localhost:8081 browser preview still renders both cases. The LAN address observed during diagnosis was `192.168.1.163`; addresses may change.

## Findings and boundaries

The reported `ExpoAsset` native-module exception is the first fatal error. The later “main has not been registered” is consistent with startup stopping before registration. Adding a second AppRegistry registration or hiding the exception would not supply the absent native implementation. Expo describes this ordering in its [registration troubleshooting guide](https://docs.expo.dev/troubleshooting/application-has-not-been-registered/).

An incompatible or incomplete installed native client is a strong hypothesis, not a verified device diagnosis. Expo's current [compatibility guidance](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) says each Expo Go build contains one SDK and the physical-iOS App Store client stops at SDK 54. If this phone uses that store client, it cannot run this SDK-57 project. A matching SDK-57 client or a project-specific development binary is required. The [SDK-57 asset reference](https://docs.expo.dev/versions/v57.0.0/sdk/asset/) lists expo-asset as included in the matching Expo Go build.

If the installed client is already a custom SDK-57 build, the App Store mismatch explanation does not establish the cause. Inspect its actual native build/modules and rebuild the appropriate client if necessary; JavaScript dependency alignment and exports cannot prove what was installed on the phone.

## Play now in the iPhone browser

Use Safari, connected to the same Wi-Fi as the PC, and open `http://192.168.1.163:8081/`. This is the web preview, not an Expo Go QR-code session and not a verified native app. If the IP changes, find the current address with:

```powershell
Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway } | Select-Object InterfaceAlias, IPv4Address
```

If the server needs restarting, stop its own terminal with Ctrl+C, then run:

```powershell
Set-Location -LiteralPath 'C:\Users\thinkpad t490\Documents\apps\last-reservation\last-reservation'
npm run web -- --lan --port 8081
```

The existing server is already running. Do not start another copy merely to use the browser. Saves are separate between localhost, LAN addresses and Expo Go; a different origin may show a fresh case while the original save remains intact.

## Finish native validation

Record the installed Expo Go app version and supported SDK, its source (App Store/custom/TestFlight), and the iOS version. A question requesting this information is pending in the chat. With a confirmed matching client, restart only the intended native Metro session from the nested app folder using `npm start -- --go --lan --clear --port 8082`, then retest launch and report the first error if it persists. Clearing Metro alone does not install missing native code.

Obtaining a matching physical-iOS custom Expo Go/development build may require Apple signing/membership and a build/distribution workflow. None was started; no payment, signing credential, store upload, SDK downgrade, forced dependency upgrade, manual registration or stub native module was introduced. Game/case/artwork code and existing saves remain unchanged.
