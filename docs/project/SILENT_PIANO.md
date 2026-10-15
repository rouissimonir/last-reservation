# The Silent Piano — case specification (author-only)

Third Bellweather case, edition 03. This file contains answers and proofs. It is never imported by the app; playable content lives in `src/game/silent-piano.ts`. Status: written for this implementation because no earlier spec existed; content is UNVALIDATED until two real people play it.

## Contract

- Case id `the-silent-piano`, version 1, save key `two-sides/the-silent-piano/v1`.
- Three deductions (SP1–SP3), each needing one private sheet per role (A witness, B records). Neither sheet alone is sufficient.
- Fixed A-then-B reading per round, neutral handoff with explicit readiness, three free progressive hints per round, notebook of confirmed deductions only, ending note confirms motive.
- Does not touch `the-missing-envelope` (key `two-sides/missing-envelope/v1`) or `the-last-reservation`.
- 10–15 minutes, UNVALIDATED.

## Premise

Bellweather Hotel ballroom, 25 October 1994. Pianist Tomas Reyes was to premiere his “Waltz for a Closed Room” at 21:00. At 20:40 the grand piano made no sound and the recital was cancelled. The last page of the score is also missing. Suspects with access: Ines Calder (tuner), Hugo Lang (stage manager), Marguerite Doyle (events manager). Witnesses: Tomas Reyes, Petra Voss (page-turner), Lewis Ash (porter).

## Deductions

### SP1 — How was the piano silenced?
Options: felt strip across the strings / action wedged locked / dampers clipped down. Correct: **a felt strip across the strings**.
- A (SP-A1, Tomas): every key moved freely; he touched neither pedals nor the inside of the piano.
- B (SP-B1, maker's chart plus the house technician's 20:42 test: every damper lifted; keys untested). Chart, exhaustive: felt strip = keys free + dampers lift; wedged action = keys stuck + dampers lift; clipped dampers = keys free + dampers stay down.
- A alone: free keys leave strip or clips. B alone: lifting dampers leave strip or wedge. Together only the strip.

### SP2 — Who silenced the piano?
Options: Ines Calder / Hugo Lang / Marguerite Doyle. Correct: **Ines Calder**.
- A (SP-A2, Petra): piano rang at 20:05; she watched continuously until 20:25; at 20:09 two people were near the piano but only one reached inside the lid; she saw neither face nor the object. The strings were touched once between 20:05 and 20:25, at 20:09. The last page, marked VII in pencil, was on the music desk at 20:05 and the desk was bare at 20:25.
- B (SP-B2, door and equipment log): ballroom locked 20:25–20:38. Ines near piano 19:55–20:10, carried a felt strip. Hugo near piano 20:08–20:11, carried wooden wedges. Marguerite near piano 20:12–20:25, also carried a felt strip. Verified inventories; nobody carried anything unlisted.
- At 20:09 only Ines and Hugo were near (Marguerite arrived at 20:12). Ines and Marguerite carried felt, so the item alone leaves two and the time alone leaves two (Ines, Hugo); together only Ines. Requires SP1 and both sheets.

### SP3 — Where did Ines carry the missing last page?
Options: prop store / green room / instrument cupboard. Correct: **the prop store**.
- A (SP-A3, Lewis): two people left by the stage-right door, the first at 20:10 with a flat folder, a pencilled VII showing at the corner of the music inside, the second empty-handed. He followed the first: door with a brass handle, three steps up, then the door closed.
- B (SP-B3, exit log and plan): the only paper anyone carried out was Ines's folder (the page was on the desk at 20:05 and gone at 20:25, per SP-A2); first to leave stage-right at 20:10 was Ines; second at 20:11 was Hugo. Plan (exhaustive): prop store brass handle, 3 steps; green room brass handle, 5 steps; instrument cupboard iron handle, 3 steps.
- Brass leaves prop store or green room; three steps leaves prop store or cupboard; both leave the prop store. The log ties the folder-carrier to Ines, so the route is hers. Requires SP2.

## Ending (motive only via the note)

Recovery: the last page and Ines's note are in the prop store. Note: Ines recognised the waltz's closing theme as her late teacher's, unpublished, and silenced the piano to delay a credit-less premiere, saving the page unharmed. Before the note, deductions establish actions and place, not intent.

## Review focus

See the Codex review guidance in `AGENTS.md`: private clue leakage, ambiguous deductions, incorrect hints, save isolation, existing-case regressions, unsupported completion claims.

## Acceptance checklist

- [ ] Case `the-silent-piano` plays start to ending: SP1, SP2, SP3, recovery note.
- [ ] Each deduction needs both sheets; no option fits one sheet alone.
- [ ] Hints 1 and 2 never name the answer; no hint reveals a later round or the motive.
- [ ] Private sheets unmount at handoff, background, resume and back; none advances the case.
- [ ] Notebook shows confirmed deductions only; motive appears only in Ines's note.
- [ ] Save key `two-sides/the-silent-piano/v1` is validated, serialized and never overwrites an unreadable save without reset confirmation.
- [ ] `the-missing-envelope` (key `two-sides/missing-envelope/v1`) and `the-last-reservation` are unchanged and still pass.
- [ ] `npm run check`, `npx expo install --check` and `npx expo-doctor` run; results recorded in `docs/STATUS.md`.
- [ ] No claim that browser tests prove native privacy or device behavior.
