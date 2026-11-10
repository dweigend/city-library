# Urban Pollution and Health

Plants reset local pollutant sources, trees remove pollution and moving people gain or lose health under the configured rules. The field and health measures are abstract rather than air-quality units or epidemiological risk estimates.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Pollution and Health`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-pollution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialPopulation` | `30` | integer; ≥ 0; ≤ 100 |
| `powerPlants` | `2` | integer; ≥ 0; ≤ 20 |
| `birthRate` | `0.1` | number; ≥ 0; ≤ 0.2 |
| `plantingRate` | `0.05` | number; ≥ 0; ≤ 0.1 |
| `pollutingRate` | `3` | integer; ≥ 0; ≤ 5 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setPeople`, `setTrees`, `setEnvironment`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `trees`, `cells`, `counts`, `totalPollution`.

The [UI binding](ui.ts) presents `Initial people`, `Tick`, `People`, `Trees`, `Power plants`, `Total pollution`, `Selected`, `People, trees and pollution`, `World status · counts and total pollution`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-pollution` and links any shared checks.
