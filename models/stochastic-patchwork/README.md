# Stochastic Patchwork

How much does the share of a color in a sample vary? Every cell in a square block of `blockSide` × `blockSide` cells gets the target color with `targetPercent` probability. Each step recolors the block and records the share of target-colored cells. The histogram of these shares shows how much samples of that size scatter around the target.

Things to try:

- Change `blockSide` and compare the width of the histogram.
- Set `targetPercent` near 0 or 100. Does the histogram change shape?

## Use

Choose **Stochastic Patchwork** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/stochastic-patchwork/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `blockSide` | `3` | integer; ≥ 1; ≤ 17 |
| `targetPercent` | `50` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `targetCount`, `cells`, `samples`, `histogram`.

## Sources and limits

Adapted from the NetLogo *Stochastic Patchwork* model by Abrahamson and Wilensky (2004). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The finite recording window distinguishes the recorded shares from the theoretical distribution of sample proportions. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `stochastic-patchwork`.
