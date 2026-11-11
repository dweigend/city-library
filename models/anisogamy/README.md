# Anisogamy

Why do most species have small sperm and large eggs? Adults release gametes of an inherited size. Gametes move, and two that touch fuse into a zygote, which survives only if the combined size passes `zygoteFitnessThreshold`; gametes that are too small to survive on their own are removed by `gameteFitnessThreshold`. Zygotes grow into adults, `maxAdultCount` limits the population, and gamete size mutates with `mutationSigma`.

The question is whether a population that starts with similar gamete sizes splits into small and large types.

Things to try:

- Switch on `speedSizeCorrelation` so smaller gametes move faster, and compare the size distribution.
- Change `zygoteFitnessThreshold` and compare runs.

## Use

Choose **Anisogamy** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/anisogamy/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

`advance(1)` is one population-update sweep, not necessarily one integer tick. Read `tickAdvanceAmount` and `wholeTick` alongside `tick` when comparing gamete encounters and adult changes; a depleted population can end progression.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `maxAdultCount` | `100` | integer; ≥ 10; ≤ 500 |
| `worldSize` | `65` | integer; ≥ 1; ≤ 97 |
| `zygoteFitnessThreshold` | `0.45` | number; ≥ 0; ≤ 0.5 |
| `gameteFitnessThreshold` | `0` | number; ≥ 0; ≤ 0.51 |
| `mutationSigma` | `0.025` | number; ≥ 0; ≤ 0.1 |
| `speedSizeCorrelation` | `false` | boolean |
| `allowAssortativeFusion` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `restoreDefaultParameters`, `produceGametes`, `becomeAdult`, `enforceCarryingCapacity`, `fuseIfTouchingAnotherGamete`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `tickAdvanceAmount`, `wholeTick`, `cells`, `traitDistribution`, `adults`, `gametes`, `zygotes`.

## Sources and limits

Adapted from the NetLogo *Anisogamy* model by Aslan, Dabholkar, Woods and Wilensky (2023). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The model is a thought experiment about reproductive investment, not a reconstruction of how anisogamy evolved in any lineage. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `anisogamy`.
