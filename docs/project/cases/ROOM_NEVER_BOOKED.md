# The Room That Was Never Booked — author-only specification

Edition 06 · id `the-room-never-booked` · version 1 · save key `two-sides/the-room-never-booked/v1` · **After Midnight Collection** (paid). Contains answers. Playable text and hints: `src/game/room-never-booked.ts`.

Primary mechanic: **timeline reconstruction from overlapping accounts.** Witnesses know the order of sounds and events but not clock times; logs know exact times of some of those events. Players align the two repeatedly. Provisional design target 40–60 minutes (unvalidated; not advertised).

Name check: The Last Reservation is about a real booking falsely cancelled; this case is the reverse (a room used without any booking) and uses a different mechanic and cast.

## Ground truth and timeline (night of 4–5 November 1994)

| Time | Event |
|---|---|
| 22:00 | Night porter Abel Finch and chambermaid Dora Pike sign out the two master keys (chained to their belts). |
| 23:30 | Evening round: every booked guest in their room. Every sellable room is let. Room 309 is out of order (broken radiator), unsold. |
| 23:40 | Lionel Grey (307, next to 309) leaves his door ajar to read. |
| 23:55 | Engineer Carl Brandt starts a basement-panel session (to 00:20). |
| 23:58 | Hannah Wells, 19, misses her connection, arrives dry with a small suitcase and £4. Receptionist Grace Holloway says the hotel is full. Abel sits her by the fire. |
| 00:04 | Grace begins the night audit in the back office (session to 00:14). |
| 00:05 | Rain begins. Dora arrives at Room 214 (Amara Osei's cold radiator) and stays until after 00:15. |
| ~00:06 | Abel takes Hannah up in the lift (still running) with a tea tray. |
| 00:08 | Abel unlocks 309 with master key 1. Grey hears two sets of footsteps, a key, the door. |
| 00:15 | Carl switches the lift off; its hum stops. |
| 00:41 | Abel leaves 309 alone by the service stairs (Grey: one heavy set; heels stay). |
| 00:45 | Abel back on the desk with Grace until 06:05. |
| 03:12–03:15 | Dora's linen round on the third floor; she opens no room. |
| 05:41 | Hannah leaves 309 by the service stairs. |
| ~05:42 | Carl, on the basement landing with his back to the doors, sees her go down past the ground floor into one of the two basement doors (the laundry). |
| 05:45 | Grey's booked call rings. |
| 06:00 | Lift on by time switch. Housekeeper finds 309 slept in, two teacups, empty. |
| 06:05 | Master keys returned. Abel later tells investigators a taxi story. |

## Characters and knowledge

- **Abel Finch** (porter): did it from kindness; lies about a taxi to keep Grace out of trouble; left money in the till.
- **Grace Holloway** (receptionist): truthful; knows the lobby was empty after the audit and that Abel returned alone.
- **Dora Pike** (chambermaid): with Mrs Osei for the whole entry window; later linen round.
- **Carl Brandt** (engineer): basement panel; saw Hannah descend.
- **Lionel Grey** (guest, 307): heard the order of events; no clock.
- **Amara Osei** (guest, 214): Dora's alibi via the rain and the hum.
- **Hannah Wells**: the unbooked guest.

## Evidence and deductions

1. **RB1 — Between 00:05 and 00:15.** A: Grey's order (rain → 309 opened → hum stops). B: rain 00:05, lift off 00:15, 309 out of order, key cabinet unopened. Neither alone gives times for the door.
2. **RB2 — Abel Finch** (RB1). A: Osei with Dora from rain start to hum stop. B: only two master keys open 309; a verified custody record establishes exclusive use by the named holders with no loans, exchanges or assisted use; intact numbered seals support continuity. Grace and Carl hold none. B alone leaves Abel/Dora; A alone cannot exclude Grace/Carl.
3. **RB3 — She went up to 309 with Abel** (RB2; reuses RB-A1, RB-A2). A: Grace (lobby empty after the audit, watched to morning) versus Abel's taxi story. B: front doors unopened after 23:58, yard door shut, no taxi call, Grace's and Carl's unbroken sessions, guest-room door counters 23:30–00:30 (only 214 and 309). Taxi, yard and lobby are all excluded; every other person is accounted for.
4. **RB4 — At 05:41** (RB3). A: Grey (one heavy set left first, heels stayed; later light steps a few minutes before his booked call); Grace (Abel with her from his return to 06:05). B: stair counter 00:41, 03:12, 03:15, 05:41; Abel on desk 00:45; Dora's linen round 03:12–03:15; Grey's call at 05:45; room empty at 06:00.
5. **RB5 — The laundry** (RB4). A: Carl saw her pass the ground floor to the basement and go through one of two doors; she has not come back. B: boiler room locked since 00:20 with Carl's only key, no lock use; laundry one door, no other exit; yard alarmed and unopened.

Ruled-out options are listed in each round's `proof` in the content module.

## Ending

Laundry drying room: Hannah with her suitcase, and Abel's note to the morning manager (four pounds, cold room with a bed, he pays — envelope in the till marked 309 — taxi story to protect Grace, 07:10 train). Motive only in the note.

## Historical review record (AI, not human playtesting)

Round 1 blind solve: all five answers found. Defects fixed: RB4 solvable from A alone (options reworded to times; Dora's round and Grey's booked call added); RB2 relied on the eventual liar's signed claim (keys now chained, verified); Carl's timing and the 06:00 lift switch-on clarified; guest-door window widened to 23:30. Round 2: all unique, none solvable from one sheet; fixed Dora's "never on the third floor" conflict with her linen round, and the key cabinet versus master-key office ambiguity; removed "early … train" so A cannot place the call by common sense. No human playtest yet.

## 16 October repair checkpoint

Earlier AI review records are historical, not proof of fairness. The user-authorized repairs, counterexample checks and actual command/browser results are recorded in `docs/project/CASE_REPAIR_POLISH.md`. No human playtest or measured duration is claimed.
