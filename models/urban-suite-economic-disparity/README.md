# Urban Suite - Economic Disparity

Rich and poor entrants search using different utilities and alter nearby price and quality; services can move or disappear. Binary incomes and the assumed attraction of jobs to valuable land are propositions rather than calibrated urban laws.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Economic Disparity`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-economic-disparity/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `numberOfTests` | `15` | integer; ≥ 0; ≤ 30 |
| `residentsPerJob` | `100` | integer; ≥ 0; ≤ 500 |
| `poorPerStep` | `5` | integer; ≥ 0; ≤ 15 |
| `richPerStep` | `5` | integer; ≥ 0; ≤ 15 |
| `poorPricePriority` | `0` | number; ≥ -1; ≤ 1 |
| `richQualityPriority` | `0` | number; ≥ -1; ≤ 1 |
| `maxJobs` | `10` | integer; ≥ 5; ≤ 20 |
| `deathRate` | `4` | integer; ≥ 0; ≤ 15 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setViewMode`, `setAgents`, `setLand`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `counter`, `viewMode`, `agents`, `cells`, `counts`, `medianTravelDistance`, `utilityRanges`.

The [UI binding](ui.ts) presents `Quality`, `Price`, `Distance`, `Poor utility`, `Rich utility`, `Location tests`, `Poor births per step`, `Rich births per step`, `Maximum jobs`, `Oldest residents removed` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-economic-disparity` and links the retained checks.
