# Urban Suite - Recycling

Recyclers and wasteful agents draw energy from resources using different extraction and restoration rules. Discrete regeneration and recycling costs are explicit abstractions rather than measured household material flows.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Recycling`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-recycling/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `recyclerCount` | `25` | integer; ≥ 0; ≤ 50 |
| `wastefulCount` | `25` | integer; ≥ 0; ≤ 50 |
| `maxStoredEnergy` | `50` | integer; ≥ 10; ≤ 100 |
| `recyclingWasteCost` | `0.5` | number; ≥ 0; ≤ 2 |
| `resourceRegeneration` | `25` | integer; ≥ 0; ≤ 100 |
| `agentsSeekResources` | `false` | boolean |
| `showEnergy` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setPeople`, `setResources`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `cells`, `counts`, `landPercentages`.

The [UI binding](ui.ts) presents `Recyclers`, `Wastefuls`, `Maximum energy`, `Waste recycling cost`, `Seek resources`, `Tick`, `New (%)`, `Recycled (%)`, `Waste (%)`, `Selected` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-recycling` and links any shared checks.
