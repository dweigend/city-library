# Border Town Settlement

How do migration, income and access to services shape informal settlements at a border? Migrants arrive near people from their home region, find work in factories (maquiladoras), earn and spend money and look for affordable places close to services. Where settlements become dense, infrastructure follows. Building the city happens in a separate setup phase before the household dynamics start.

Things to try:

- Change `requiredCapital` and compare where migrants are able to settle.
- Reduce `serviceCenterCount` to 1 and compare the settlement pattern.

## Use

Choose **Border Town Settlement** in [Model Lab](../../ui/model-lab/README.md). Setup creates a cleared instance. Build the city with Cityscape step, 100 cityscape calls, or Cityscape continue / Keep building. Use Step or Run/Pause only when the Phase monitor becomes `ready`; the shared GO controls are guarded until then.

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-tijuana-bordertowns/model.ts";

const simulation = create();
simulation.advanceCityscape(1); // One bounded cityscape call, not a readiness guarantee.
if (simulation.read().setupDone) simulation.advance(1);
const observation = simulation.read();
```

Call `advanceCityscape(count)` in bounded batches and inspect `read().setupDone` and `phase` before requesting more work. The setup phase generates roads, seeds residents and runs initial economics; its duration and success are not guaranteed by a seed. Once ready, setup resets the tick and increments `epoch`; `advance(count)` then runs household and city dynamics. Before readiness it returns a `guarded` result with no completed calls, and further cityscape calls are guarded after readiness. `clear()` removes the city, resets setup and time, and begins a new epoch without recreating the seeded instance. Source failures can throw after partial work; `lastFailure`, `warnings` and `traces` retain diagnostic observations.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maquiladoraCount` | `8` | integer; ≥ 1; ≤ 8 |
| `serviceCenterCount` | `3` | integer; ≥ 1; ≤ 3 |
| `migrationTicks` | `3` | integer; ≥ 1; ≤ 20 |
| `crossingTicks` | `15` | integer; ≥ 1; ≤ 20 |
| `buildingTicks` | `6` | number; ≥ 0.5; ≤ 6 |
| `initDensity` | `0.7` | number; ≥ 0.5; ≤ 1 |
| `coloniaSize` | `2` | number; ≥ 0; ≤ 2 |
| `requiredCapital` | `500` | number; ≥ 150; ≤ 1200 |
| `carryingCapacity` | `6` | integer; ≥ 1; ≤ 6 |
| `visualUpdate` | `"off"` | `off`, `elevation`, `land-value-gradient`, `colonias`, `units-with-no-water`, `units-with-no-electricity` |
| `colorCode` | `true` | boolean |
| `cityGrowth` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `clear`, `advanceCityscape`, `setRules`, `updateDisplay`, `addNode`, `setScenario`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `epoch`, `globals`, `setupDone`, `phase`, `cells`, `agents`, `counts`, `seedMigrants`, `reports`, `lastFailure`, `warnings`, `traces`.

The [model contract](contract.md) defines the procedures and their boundary behavior.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Tijuana Bordertowns* model by De Leon, Felsen and Wilensky (2007). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The rules form a teaching scenario about a border town, not a forecast for present-day Tijuana. Setup duration and success are not guaranteed by a seed. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-tijuana-bordertowns`.
