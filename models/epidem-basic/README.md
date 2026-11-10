# epiDEM Basic

Moving susceptible people can become infected and later recover in a closed population. Reported epidemic counts and R0 use the model's own infection history; they are not fitted estimates for a named disease.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `epiDEM Basic`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/epidem-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPersonCount` | `100` | integer; ≥ 50; ≤ 400 |
| `infectionChance` | `30` | number; ≥ 0; ≤ 100 |
| `recoveryChance` | `60` | number; ≥ 0; ≤ 100 |
| `averageRecoveryTime` | `210` | number; ≥ 0; ≤ 300 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setupPeople`, `move`, `clearCount`, `infect`, `maybeRecover`, `calculateR0`, `go`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `betaN`, `gamma`, `r0`, `nbInfectedPrevious`, `infectedCount`, `curedCount`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `Infected`, `Recovered`, `R0`, `Infection rate`, `Recovery rate`, `epiDEM Basic`, `History`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `epidem-basic` and links any shared checks.
