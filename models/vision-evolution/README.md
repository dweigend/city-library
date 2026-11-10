# Vision Evolution

Could seeing farther have helped animals move from water onto land? Fish-like agents search for food with eyes of an inherited size. Bigger eyes see farther, especially above water, but cost energy (`eyeCost`). Agents that eat enough reproduce, and eye size mutates with `mutationRate`.

Things to try:

- Set `eyeCost` to 0 and compare the average eye size over time.
- Lower `foodReplenishRate`. Does larger vision pay off more?

## Use

Choose **Vision Evolution** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/vision-evolution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialFishCount` | `50` | integer; ≥ 0; ≤ 250 |
| `initialFoodCount` | `80` | integer; ≥ 0; ≤ 250 |
| `energyGainFromFood` | `100` | integer; ≥ 0; ≤ 300 |
| `foodReplenishRate` | `65` | integer; ≥ 0; ≤ 100 |
| `mutationRate` | `0.1` | number; ≥ 0; ≤ 1 |
| `reproductionRate` | `35` | integer; ≥ 0; ≤ 100 |
| `eyeCost` | `9` | number; ≥ 0; ≤ 10 |
| `showVision` | `true` | boolean |
| `maxEyeSize` | `5` | integer; ≥ 1; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `makeFood`, `makeFish`, `move`, `consumeEnergy`, `eatFood`, `death`, `reproduce`, `replenishFood`, `mutate`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `fish`, `food`, `cells`, `eyeSizeHistogram`, `landMobilityHistogram`, `foodPreferenceHistogram`.

## Sources and limits

Adapted from the NetLogo *Vision Evolution* model by Gurkan, Head, Woods and Wilensky (2018). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The model tests a specific hypothesis in a constructed environment. It does not reconstruct a fossil lineage or show that vision caused the move to land. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `vision-evolution`.
