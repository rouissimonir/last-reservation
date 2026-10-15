# Fix logs

## 2026-10-15 — iOS bundle: native modules not found

Log as reported (verbatim):

```
iOS Bundled 164ms node_modules\expo-router\entry.js (1 module)
 WARN  No native ExponentConstants module found, are you sure the expo-constants's module is linked properly?
 ERROR  [runtime not ready]: Error: Cannot find native module 'ExpoAsset'
 ERROR  [runtime not ready]: Error: Cannot find native module 'ExpoAsset'
 ERROR  [runtime not ready]: Invariant Violation: "main" has not been registered. This can happen if:
* Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
```

Status: open (not yet diagnosed or fixed).

### Fuller log from the same run

```
› Using Expo Go (Press s to switch to development build)
› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
iOS Bundled 54919ms node_modules\expo-router\entry.js (1289 modules)
iOS Bundled 2140ms node_modules\expo-router\entry.js (1 module)
iOS Bundled 164ms node_modules\expo-router\entry.js (1 module)
 WARN  No native ExponentConstants module found, are you sure the expo-constants's module is linked properly?
 ERROR  [runtime not ready]: Error: Cannot find native module 'ExpoAsset'
 ERROR  [runtime not ready]: Error: Cannot find native module 'ExpoAsset'
 ERROR  [runtime not ready]: Invariant Violation: "main" has not been registered. This can happen if:
* Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
* A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called.
```

Observations:
- The session ran in Expo Go, not a development build.
- The project is on Expo SDK 57 (`expo ~57.0.29`, `react-native 0.86.3`), per `package.json`.
- The "main has not been registered" error follows the missing-native-module errors, so it is probably a consequence and not a separate fault.
- Likely cause (unverified): the installed Expo Go app does not match SDK 57, so it lacks the native modules.
