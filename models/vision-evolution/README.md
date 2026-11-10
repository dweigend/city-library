# Vision Evolution

Eye size changes perception across water and land while inherited traits and food encounters affect survival and reproduction. The constructed visual opportunity tests a hypothesis, without reconstructing a fossil lineage or establishing one cause of terrestrial evolution.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Vision Evolution`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/vision-evolution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialNumberFish` | `50` | integer; ≥ 0; ≤ 250 |
| `initialNumberFood` | `80` | integer; ≥ 0; ≤ 250 |
| `energyGainFromFood` | `100` | integer; ≥ 0; ≤ 300 |
| `foodReplenishRate` | `65` | integer; ≥ 0; ≤ 100 |
| `mutationRate` | `0.1` | number; ≥ 0; ≤ 1 |
| `reproductionRate` | `35` | integer; ≥ 0; ≤ 100 |
| `eyeCost` | `9` | number; ≥ 0; ≤ 10 |
| `showVision` | `true` | boolean |
| `maxEyeSize` | `5` | integer; ≥ 1; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `makeFood`, `makeFish`, `move`, `consumeEnergy`, `eatFood`, `death`, `reproduce`, `replenishFood`, `mutate`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `fish`, `food`, `cells`, `eyeSizeHistogram`, `landMobilityHistogram`, `foodPreferenceHistogram`.

The [UI binding](ui.ts) presents `Tick`, `Fish`, `Food`, `Water, land and vision`, `Population size`, `Average eye size`, `Selected fish`, `Terrestrial`, `Aquatic`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `vision-evolution` and links any shared checks.
