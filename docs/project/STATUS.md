# The Silent Piano — status

Checkpoint · 15 October 2026 · Windows. Baseline revision `eb1d1640a75c5202c1ec316590206de5b15cad74`. Full evidence is in `THIRD_CASE_REPORT.md`.

## Implemented

- Case `the-silent-piano` (edition 03, version 1): three deductions (how it was silenced, who did it, where the page went), two private sheets each, three hints per deduction, notebook of confirmed deductions, ending note that alone confirms motive. Content: `src/game/silent-piano.ts`. Author-only spec and solution: `docs/project/SILENT_PIANO.md` (never imported).
- Own save key `two-sides/the-silent-piano/v1`. The Missing Envelope (`two-sides/missing-envelope/v1`) and The Last Reservation keep their ids, content and keys; their content digests are pinned in `tests/existing-cases-compat.test.ts`.
- Small shared-UI change: optional per-case intro, cover-setting and ending labels (`CaseDefinition`), with the old wording as the fallback so the earlier cases render as before.

## Checks (final revision)

See the report for the exact commands and output. `npm run check` passes (typecheck, lint, 30 tests). Web export succeeds. `npx expo install --check` and `npx expo-doctor` do **not** pass: Expo patch drift (`expo`, `expo-router`, `@expo/ui`) and an offline schema fetch. Neither was introduced here and nothing was upgraded.

## Not verified

No physical-device or native run, no native snapshot-privacy check, no paired human playtest. The 10–15 minute duration and the fairness of the deductions are UNVALIDATED. The cover reuses the envelope illustration; no piano artwork exists yet.
