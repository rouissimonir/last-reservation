# The Masquerade Coat — author-only specification

Edition 04 · id `the-masquerade-coat` · version 1 · save key `two-sides/the-masquerade-coat/v1` · **free** (The Bellweather Files). Contains answers. Never imported by the app; playable text and the exact hints live in `src/game/masquerade-coat.ts`.

Primary mechanic: **order and position** — consecutive ticket numbers, relative places in a queue, the order of lift stops. Length not measured; provisional design target 10–15 minutes (unvalidated).

## Ground truth and timeline (29 October 1994, autumn masquerade)

| Time | Event |
|---|---|
| 19:20 | The string quartet hands in four overcoats together: tickets 31–34. |
| 19:21 | Agnes Hart, directly behind them, hands in her plain camel coat (grandmother's silver brooch pinned in the lining): ticket 35. |
| 19:24 | Margaret Lind hands in an identical plain camel coat: ticket 36. |
| evening | Agnes loses ticket 35 while dancing; Mrs Lind drops her own ticket 36. |
| ~22:35 | Mrs Lind finds ticket 35 by the punch bowl and believes it is hers. |
| 22:40 | Queue at the rope, front to back: Dr Quinn (red fox), Ms Ferreira (swan, feathered), Mr Okafor (silver fox), Mrs Lind (raven, feathered), Mr Pell (owl, feathered). Mrs Lind hands in 35 and receives Agnes's coat. |
| 22:46 | Mrs Lind rides lift 1 up; stops: first, third, fourth floors. She leaves at the second stop (third floor) and goes to Room 316. |
| 22:50 | Agnes finds her coat gone. Investigation begins. |

## Characters and what they know

- **Agnes Hart** (owner): knows she followed the musicians; never saw her number.
- **Jun Park** (attendant): saw the masks either side of whoever handed in 35; no names.
- **Masquerade steward**: recorded the queue and masks; not tickets.
- **Sam Achter** (lift attendant): remembers the order of stops and the raven-masked woman; not floors.
- **Margaret Lind**: innocent mistake; her apology at reception gives the reason.

## Evidence allocation

- MC1 · A: Agnes's account (immediately behind four musicians). B: ticket stubs 31–37 (35 and 36 both camel coats).
- MC2 · A: Jun (holder of 35 directly behind a fox, directly in front of feathers; definition of "behind"). B: steward's queue with masks; only one raven.
- MC3 · A: Sam sees the raven mask leave at the second stop and carry the coat into the single door opposite the lift. B: stop order (1st, 3rd, 4th) and the opposite-door mapping (108, 316, 412).

## Deductions, proofs and ruled-out options

1. **MC1 — 35.** Next number after 31–34. 34 is a musician's; 36 is the other camel coat three minutes later. A alone has no numbers; B alone leaves 35/36.
2. **MC2 — Mrs Lind** (requires MC1). Behind a fox: Ferreira (2), Lind (4). In front of feathers: Quinn (1), Okafor (3), Lind (4). Intersection: Lind. A alone has no queue; B alone has no ticket link.
3. **MC3 — Room 316** (requires MC2). Second stop = third floor; the observed opposite door is 316. Entry with the coat is witnessed, not assumed from a booking. A alone lacks the floor/room mapping; B alone lacks the observed stop.

Hints: three per deduction in the content module; hints 1–2 never name the answer (tested).

## Ending

Room 316 holds the coat and intact brooch. At reception Margaret explains the punch-bowl ticket and twin coats directly to Agnes. Her statement is recorded by the manager; no conveniently abandoned note is needed.

## Historical review record

AI blind solve (not human playtesting), round 1: all three answers found; one defect — two identical "fox" mask descriptions contradicted "no two guests wore the same design". Fixed (red fox / silver fox). No human playtest yet.

## 16 October repair checkpoint

Earlier AI review records are historical, not proof of fairness. The user-authorized repairs, counterexample checks and actual command/browser results are recorded in `docs/project/CASE_REPAIR_POLISH.md`. No human playtest or measured duration is claimed.
