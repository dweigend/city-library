# Consumer Choice

Do people choose a product because it is better or because their friends do? Consumers in a network choose between an orange and a blue product. Each choice mixes their own experience of quality, information from network neighbors (`informationExchange`) and the pull of what is common (`normInfluence`); now and then they simply try the other product (`exploration`).

Things to try:

- Make the products equally good and raise `normInfluence`. Does one product take over?
- Give blue a higher quality but start with mostly orange users (`initialOrangePercent`).

## Use

Choose **Consumer Choice** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/consumer-choice/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `consumerCount` | `100` | integer; ≥ 0; ≤ 1000 |
| `meanConnectionCount` | `5` | integer; ≥ 0; ≤ 10 |
| `initialOrangePercent` | `50` | number; ≥ 0; ≤ 100 |
| `normInfluence` | `0.15` | number; ≥ 0; ≤ 1 |
| `informationExchange` | `0.05` | number; ≥ 0; ≤ 1 |
| `exploration` | `0.01` | number; ≥ 0; ≤ 1 |
| `qualityOrange` | `0.5` | number; ≥ 0; ≤ 1 |
| `qualityBlue` | `0.5` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `consumers`, `edges`.

## Sources and limits

Adapted from the NetLogo *Consumer Choice* model (© 2024 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Fixed behavioral weights and a two-product market do not estimate real demand or pricing. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `consumer-choice`.
