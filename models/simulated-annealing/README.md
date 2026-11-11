# Simulated Annealing

Can accepting a worse move help find a better solution? A black-and-white image is scrambled. The energy is lower when pixels form vertical stripes. Each step tries to swap pixels within `swapRadius`. Better swaps are always accepted; worse swaps are accepted with a chance that shrinks as the temperature falls by `coolingRate`.

Things to try:

- Set `coolingRate` high and low. Which leaves fewer defects?
- Switch on `acceptEqualChanges` and compare.

## Use

Choose **Simulated Annealing** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/simulated-annealing/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `30` | integer; ≥ 2; ≤ 201 |
| `height` | `30` | integer; ≥ 2; ≤ 201 |
| `seed` | `1` | integer |
| `coolingRate` | `1` | number; ≥ 0; ≤ 50 |
| `swapRadius` | `1` | integer; ≥ 1; ≤ 5 |
| `acceptEqualChanges` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `energyAt`, `attemptSwap`, `setScenario`, `totalEnergy`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `temperature`, `globalEnergy`, `attemptCount`, `acceptedSwapCount`, `brightness`, `cells`.

## Sources and limits

Adapted from the NetLogo *Simulated Annealing* model by Stonedahl and Wilensky (2009). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Reaching low energy does not prove the global minimum was found. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `simulated-annealing`.
