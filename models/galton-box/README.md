# Galton Box

How do many left-or-right bounces build a bell curve? Balls drop through `rowCount` rows of pegs and bounce right with `chanceOfBouncingRight` percent at each peg. They collect in bins at the bottom; with `pileUp`, they stack into visible piles.

Things to try:

- Change `chanceOfBouncingRight` and watch where the peak of the histogram moves.
- Use few rows and many rows and compare the width of the distribution.

## Use

Choose **Galton Box** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/galton-box/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `rowCount` | `11` | integer; ≥ 1; ≤ 15 |
| `ballCount` | `75` | integer; ≥ 1; ≤ 1000 |
| `chanceOfBouncingRight` | `50` | integer; ≥ 0; ≤ 100 |
| `pileUp` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `ballCount`, `particles`, `pegs`, `counters`, `full`.

## Sources and limits

Adapted from the NetLogo *Galton Box* model by Wilensky (2002). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Collisions and pile-up make this a finite mechanical sample, not an endless sequence of coin flips. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `galton-box`.
