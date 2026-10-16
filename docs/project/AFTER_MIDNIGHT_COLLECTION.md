# After Midnight Collection

“One purchase. Two players. Three new mysteries.” One non-consumable purchase unlocks the three cases below. Spoiler-free summary; answers live only in the author specifications in `docs/project/cases/`.

| File | Case | Primary mechanic | Deductions | Author spec |
|---|---|---|---|---|
| 06 | The Room That Was Never Booked | Rebuilding a night from overlapping accounts that rarely mention a clock, pinned to exact logs | 5 | `cases/ROOM_NEVER_BOOKED.md` |
| 07 | The Last Call at Midnight | Reading the building as a map: sounds, door mechanics, key access and sightlines | 5 | `cases/LAST_CALL.md` |
| 08 | The Portrait Behind the Wall | Document provenance and sequence: watermarks, letterheads, a newspaper lining, typewriter faults | 5 | `cases/PORTRAIT_BEHIND_WALL.md` |

Compared with the free cases (three deductions of mostly two-attribute matching), each premium case has five deductions, four options in most rounds, later rounds that reuse earlier sheets (`evidenceRefs` reach back), three-way eliminations, decoys that are consistent but look wrong (old paper used later; the second set of footsteps), and an ending note that confirms motive only after every action has been proven.

All three are set in November 1994, after the free cases, inside the established Bellweather timeline. They reuse no answers or plots from earlier cases. "The Room That Was Never Booked" was checked against The Last Reservation: that case is a real booking falsely cancelled; this one is a room used with no booking, solved by a different mechanic with a different cast.

## The free collection is complete

The existing three free cases were verified (ids, content digests pinned in `tests/existing-cases-compat.test.ts`, save keys, 30 earlier tests). Two new, distinct free cases bring it to five:

- **04 The Masquerade Coat** — order and position (ticket sequence, queue places, lift stops). Spec `cases/MASQUERADE_COAT.md`.
- **05 The Music Box** — weight arithmetic, testing claims against records, directions on a plan. Spec `cases/MUSIC_BOX.md`.

## Integrity checks performed

- Structural validation (`validateCase`): unique ids, three hints each, valid options, backward-only prerequisites and evidence references. Catalogue validation: every case in exactly one collection.
- Tests: every new case played to its ending in code with every wrong option rejected; hints 1–2 never contain the answer; motive keywords appear only in the ending note; mechanics tests confirm the key facts sit on the intended sheet.
- **AI blind solves (not human playtesting).** Independent Claude subagents received only the player-facing text, without answers, hints or endings, and solved each case. Round 1 found every intended answer but reported defects (one sheet sufficing in four deductions, three wording contradictions, guessable watermark order, one leaked fact). All were fixed. Round 2 on the revised text again found every intended answer, reported each deduction as unique and needing both sheets, and raised smaller wording issues, which were fixed. Details in each spec's review record.

## Cover art — temporary

No image-generation tool was available in this session. Each new case has a **temporary** cover object drawn with native views (`src/components/case-emblem.tsx`): mask (04), music box (05), key and blank tag (06), telephone (07), empty gilt frame with a silhouette (08), and a piano for The Silent Piano (03, replacing the borrowed envelope). They carry no text and no clue. They are not final art.

Artwork still needed (transparent PNG, same treatment as `assets/art/optimized/case-envelope.png`, no text, no clue content): a masquerade mask with a camel-coat sleeve; a wrapped music box; an old brass room key with a blank tag; a 1990s hotel desk telephone; an ornate empty frame against broken plaster; a ballroom grand piano. Shared backgrounds, the handoff folder and paper are reused.

## Not yet done

- Human paired playtests of all five new cases (fairness, hint quality, length). Lengths are not advertised; the provisional design target for each premium case is 40–60 minutes and for each new free case 10–15 minutes, both unmeasured.
- Final artwork (above).
- Native purchase tests (see `PURCHASE_SETUP.md`).
