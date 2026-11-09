# Virus

Moving hosts become infected, recover or die, while immunity and demographic renewal alter susceptibility. The finite population and contact rules illustrate persistence mechanisms without forecasting a real virus.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Virus`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/virus/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberPeople` | `150` | integer; ≥ 10; ≤ 300 |
| `infectiousness` | `65` | number; ≥ 0; ≤ 99 |
| `chanceRecover` | `75` | number; ≥ 0; ≤ 99 |
| `duration` | `20` | number; ≥ 0; ≤ 99 |
| `agentShape` | `"person"` | `person`, `circle` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `go`, `setParameters`, `setupAgents`, `updateGlobalVariables`, `getOlder`, `move`, `infect`, `recoverOrDie`, `reproduce`, `getSick`, `getHealthy`, `becomeImmune`, `immune`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `percentInfected`, `percentImmune`, `lifespan`, `carryingCapacity`, `chanceReproduce`, `immunityDuration`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `Infected %`, `Immune %`, `Virus`, `History`, `Population`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `virus` and links any shared checks.
