# Ethnocentrism

Can favoring your own group evolve from local competition? Agents carry a group color and two inherited choices: whether to help neighbors of the same color and whether to help others. Helping costs the giver `costOfGiving` and benefits the receiver `gainOfReceiving`, which raises its chance to reproduce. Offspring inherit color and choices with `mutationRate`, immigrants arrive each step, and agents die with `deathRate`.

Things to try:

- Follow the four strategy shares over time with the defaults.
- Raise `costOfGiving`. Does any kind of helping survive?

## Use

Choose **Ethnocentrism** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ethnocentrism/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `setup` | `"empty"` | `empty`, `full` |
| `immigrantCountPerDay` | `1` | integer; ≥ 0; ≤ 100 |
| `initialPtr` | `0.12` | number; ≥ 0; ≤ 1 |
| `costOfGiving` | `0.01` | number; ≥ 0; ≤ 1 |
| `gainOfReceiving` | `0.03` | number; ≥ 0; ≤ 1 |
| `mutationRate` | `0.005` | number; ≥ 0; ≤ 1 |
| `deathRate` | `0.1` | number; ≥ 0; ≤ 1 |
| `immigrantChanceCooperateWithSame` | `0.5` | number; ≥ 0; ≤ 1 |
| `immigrantChanceCooperateWithDifferent` | `0.5` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setupEmpty`, `setupFull`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `agents`, `turn`, `cumulative`, `turnRatios`, `cumulativeRatios`, `last100Ratios`, `genotypes`, `genotypeMean`, `genotypePercent`, `last100`.

## Sources and limits

Adapted from the NetLogo *Ethnocentrism* model (© 2003 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Payoffs and group labels are stipulated rules, not an explanation of human identity. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ethnocentrism`.
