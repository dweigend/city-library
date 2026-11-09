# El Farol

Each person scores prediction strategies against attendance history and uses a selected forecast to decide whether to attend. A capacity threshold and adaptive forecasts create coordination pressure without proving convergence to one optimal attendance pattern.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `El Farol`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/el-farol/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `memorySize` | `5` | integer; ≥ 1; ≤ 10 |
| `numberStrategies` | `10` | integer; ≥ 1; ≤ 20 |
| `overcrowdingThreshold` | `60` | integer; ≥ 0; ≤ 100 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `randomStrategy`, `updateStrategies`, `moveToEmptyOneOf`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `attendance`, `crowded`, `plotHistory`, `people`, `cells`.

The [UI binding](ui.ts) presents `Number of strategies`, `Week`, `Attendance`, `Crowded`, `Homes and bar`, `Bar attendance`, `Patron`, `Threshold`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `el-farol` and links the retained checks.
