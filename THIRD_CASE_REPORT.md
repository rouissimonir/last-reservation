# THIRD_CASE_REPORT — The Silent Piano

Date: 15 October 2026 · Windows 11 · Expo SDK 57 · baseline `eb1d1640a75c5202c1ec316590206de5b15cad74`.

## What was built

The Silent Piano (`the-silent-piano`, edition 03): three deductions, private role handoffs, three free hints each, a notebook of confirmed deductions, an ending whose note confirms motive, and an independent save key. `docs/project/SILENT_PIANO.md` did not exist, so it was written first (author-only, contains answers). The two earlier cases are untouched.

Answers, for the record: the piano was silenced by a felt strip; Ines Calder laid it; she carried the missing page (marked VII) to the prop store.

## Checks run on the final revision

Commands were run from the app folder. Results:

- `npm run check` (typecheck, lint, tests): exit 0, 30 tests pass, 0 fail. Tests added: `silent-piano.test.ts` (content logic), `silent-piano-flow.test.ts`, `silent-piano-save.test.ts`, `existing-cases-compat.test.ts`.
- `npx expo export --platform web`: exit 0, 3 static routes. Not a native build.
- `npx expo install --check`: **fails**. `expo` 57.0.29 (wants ~57.0.30), `expo-router` 57.0.27 (wants ~57.0.28) and `@expo/ui` 57.0.24 (wants ~57.0.25) are behind. `package.json` and the lockfile are unchanged from the baseline, so this is drift in Expo's published versions, not this work. I did not upgrade.
- `npx expo-doctor`: **19/21**. One failure is the app-config schema fetch (`fetch failed`, network); the other is the same version drift.

## Browser run (local web preview, port 8099)

Played The Silent Piano start to finish by driving the UI: library, intro, roles, neutral handoff before every sheet, both private sheets per round, a wrong answer rejected, hints 1–3, correct answer, confirmed screen, notebook, ending note and proof chain. A page reload on a private sheet came back to the neutral library with progress intact (2 of 3), and the other two cases still showed “Not started”. Blur, `document.hidden` and `pagehide` each concealed the sheet, and the saved `read` flags did not change. No console errors. Reset worked and cleared only this case.

Screenshots are in `docs/screenshots/2026-10-15/` (`silent-piano-*`, `library-with-silent-piano-375.jpg`): cover, intro, handoff, witness sheet, discuss, confirmed, ending. After scripted interaction the tool captured the 375px layout cropped on the right (the page itself measured 375px wide), so the ending screenshot is from the desktop-width pane. Browser results do not establish native snapshot privacy or device behaviour.

## Codex checkpoint reviews

Codex CLI 0.153.4, ChatGPT sign-in, `codex review` supported. Every review used a detached worktree at the committed SHA, `--base` the fixed baseline, read-only sandbox, one reviewer at a time, 1200–1500 s timeout, no API fallback. `--base` cannot be combined with a prompt, so the game-specific guidance lives in `AGENTS.md` (mirrored in `CLAUDE.md`, which must stay identical). Logs and the run record are outside the repo: `%LOCALAPPDATA%\Temp\cx\logs\` and `EXPERIMENT.txt` there.

Failed runs, none treated as approval: usage error (prompt with `--base`); configured model `gpt-6-luna` unsupported on this account (retried with `gpt-6-astra`); worktree under Temp unreadable by the sandbox (moved to `C:\cxr`); one run I aborted because it started in the main checkout instead of the snapshot.

| Milestone | Snapshot | Result |
|---|---|---|
| 1 Content and logic | `80aa6e4` | 4 findings, all valid: SP2 solvable from one sheet, page not tied to the folder, Hugo's exit outside his presence window, ending labels hard-coded to another case. Fixed in `b4f94ab`. |
| 1, cycle 1 | `b4f94ab` | 2 findings, valid: SP1 solvable from one sheet, page still not identified in the folder. Fixed in `1d86f98` (moves the damper test to B, marks the page VII). |
| 1, cycle 2 | `1d86f98` | No actionable defects. |
| 2 Playable flow | `c1f7daa` | No concrete defects. |
| 3 Save, privacy, compatibility | `133f075` | No concrete defects. |
| 4 Final, whole diff from baseline | `50310ff` | No concrete defects. Checks on this revision: `npm run check` 30/30 pass, web export exit 0. A docs-only edit to this row followed; no code changed after the review. |

Limits of the reviews: the worktrees have no `node_modules`, so Codex could not run typecheck; I ran every check myself. A review finding no defects is evidence, not proof.

## Unverified and remaining

- No physical-device or native run; no native snapshot-privacy check.
- No paired human playtest: the 10–15 minute target, fairness of the deductions and the hint wording are UNVALIDATED.
- The cover uses the envelope illustration; a piano illustration has not been made.
- Expo patch updates are pending and Doctor needs a network retry.
- `.claude/launch.json` (preview config, port 8099) is untracked and not committed.
- `docs/project/SILENT_PIANO.md` also has an acceptance checklist added during the session that I did not write; it is unchecked and I left it as found.
