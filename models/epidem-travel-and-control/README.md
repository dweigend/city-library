# epiDEM Travel and Control

Travel tendencies and social links combine with isolation, hospital, inoculation and recovery rules. Perfect recovered immunity and simplified intervention behavior constrain any comparison of policies.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `epiDEM Travel and Control`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/epidem-travel-and-control/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPeople` | `250` | integer; ≥ 50; ≤ 400 |
| `initialAmbulance` | `2` | integer; ≥ 0; ≤ 4 |
| `infectionChance` | `55` | number; ≥ 0; ≤ 100 |
| `recoveryChance` | `45` | number; ≥ 0; ≤ 100 |
| `averageRecoveryTime` | `110` | number; ≥ 0; ≤ 300 |
| `averageIsolationTendency` | `5` | number; ≥ 0; ≤ 50 |
| `averageHospitalGoingTendency` | `5` | number; ≥ 0; ≤ 50 |
| `inoculationChance` | `10` | number; ≥ 0; ≤ 100 |
| `intraMobility` | `0.4` | number; ≥ 0; ≤ 1 |
| `travelTendency` | `1` | number; ≥ 0; ≤ 1 |
| `edges` | `false` | boolean |
| `travel` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setupGlobals`, `setupPeople`, `setupAmbulance`, `assignTendency`, `makeNetwork`, `move`, `clearCount`, `infect`, `isolate`, `hospitalize`, `unisolate`, `maybeRecover`, `calculateR0`, `go`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `betaN`, `gamma`, `r0`, `nbInfectedPrevious`, `infectedCount`, `curedCount`, `cells`, `edges`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `Infected`, `Recovered`, `R0`, `Infection rate`, `Recovery rate`, `epiDEM Travel and Control`, `History`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `epidem-travel-and-control` and links any shared checks.
