# Urban Suite - Tijuana Bordertowns

Migrants seek compatriots and affordable serviced sites while earnings, spending, settlement density and infrastructure interact. These stylized rules form a pedagogical border-town scenario rather than a contemporary Tijuana forecast.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Tijuana Bordertowns`. Press Setup to create a cleared instance. Build the city with Cityscape step, 100 cityscape calls, or Cityscape continue / Keep building. Use Step or Run/Pause only when the Phase monitor becomes `ready`; the shared GO controls are guarded until then. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-tijuana-bordertowns/model.ts";

const simulation = create();
simulation.advanceCityscape(1); // One bounded cityscape call, not a readiness guarantee.
if (simulation.read().setupDone) simulation.advance(1);
const observation = simulation.read();
```

Call `advanceCityscape(count)` in bounded batches and inspect `read().setupDone` and `phase` before requesting more work. The setup phase generates roads, seeds residents and runs initial economics; its duration and success are not guaranteed by a seed. Once ready, setup resets the tick and increments `epoch`; `advance(count)` then runs household and city dynamics. Before readiness it returns a `guarded` result with no completed calls, and further cityscape calls are guarded after readiness. `clear()` removes the city, resets setup and time, and begins a new epoch without recreating the seeded instance. Source failures can throw after partial work; `lastFailure`, `warnings` and `traces` retain diagnostic observations.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maquiladoras` | `8` | integer; ≥ 1; ≤ 8 |
| `serviceCenters` | `3` | integer; ≥ 1; ≤ 3 |
| `migrationTicks` | `3` | integer; ≥ 1; ≤ 20 |
| `crossingTicks` | `15` | integer; ≥ 1; ≤ 20 |
| `buildingTicks` | `6` | number; ≥ 0.5; ≤ 6 |
| `initDensity` | `0.7` | number; ≥ 0.5; ≤ 1 |
| `coloniaSize` | `2` | number; ≥ 0; ≤ 2 |
| `requiredCapital` | `500` | number; ≥ 150; ≤ 1200 |
| `carryingCapacity` | `6` | integer; ≥ 1; ≤ 6 |
| `visualUpdate` | `"off"` | `off`, `elevation`, `land value gradient`, `colonias`, `units with no water`, `units with no electricity` |
| `colorCode` | `true` | boolean |
| `cityGrowth` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `clear`, `advanceCityscape`, `setRules`, `updateDisplay`, `addNode`, `setScenario`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `epoch`, `globals`, `setupDone`, `phase`, `cells`, `agents`, `counts`, `seedMigrants`, `reports`, `lastFailure`, `warnings`, `traces`.

The [UI binding](ui.ts) presents `Clear`, `Cityscape step`, `100 cityscape calls`, `Cityscape continue`, `Keep building`, `Update now`, `Initial density`, `Phase`, `Tick`, `Epoch` and further views or controls.

The [detailed model contract](contract.md) defines the public procedures and boundary behavior.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-tijuana-bordertowns` and links any shared checks.
