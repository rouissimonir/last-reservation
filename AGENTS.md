# TWO SIDES project rules

Build the contained two-player, one-phone Expo/React Native/TypeScript MVP in this folder. Preserve npm and package-lock.json. Use Expo Router for routes; keep game navigation separate from domain progression.

Before changing Expo or React Native APIs, read package.json and matching https://docs.expo.dev/versions/v57.0.0/ documentation; use https://docs.expo.dev/llms.txt for other topics. Install dependencies with npx expo install (including --dev for development tools).

Keep authored case content in src/game/case.ts and domain rules in the typed reducer. Preserve the canonical puzzle and evidence chain. CASE_PUBLIC.md has no answers, proofs, hints or ending. CASE_SOLUTION.md is author-only; never import docs into the app. Motive is confirmed only by Nora's note after recovery.

Conceal private evidence by unmounting it. Revisit through a neutral role handoff with explicit readiness. Resume/background/back navigation must conceal clues and never advance the case. The notebook contains confirmed deductions only. Validate saves, serialize writes, and never overwrite an unreadable save without explicit reset confirmation.

Use React Native components, StyleSheet tokens, real accessible text, safe areas, large controls and system font scaling. No essential animation/audio. No backend, authentication, purchases, remote analytics, AI APIs, publishing or uploads for this task. React DOM is retained solely as Expo's web runtime; do not build DOM-based UI.

Run npm run check, npx expo install --check, and npx expo-doctor before handoff. Verify browser behavior when available. Record actual results and native limitations in docs/STATUS.md. Never claim browser tests establish native snapshot privacy or physical-device behavior.

Keep README.md and this file concise; CLAUDE.md shares these exact rules. At a complete checkpoint inspect the diff, commit only this nested app, and pause implementation for review. Preserve parent-repository deletions and unrelated work.
