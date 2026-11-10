# HIV

People move, form and dissolve couples, use condoms and test according to individual tendencies. Infection and symptoms are simplified model processes; the counters do not estimate individual medical risk.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `HIV`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/hiv/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPeople` | `300` | integer; ≥ 50; ≤ 500 |
| `averageCommitment` | `50` | number; ≥ 1; ≤ 200 |
| `averageCouplingTendency` | `5` | number; ≥ 0; ≤ 10 |
| `averageCondomUse` | `0` | number; ≥ 0; ≤ 10 |
| `averageTestFrequency` | `0` | number; ≥ 0; ≤ 2 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `go`, `setParameters`, `randomNear`, `assignCommitment`, `assignCouplingTendency`, `assignCondomUse`, `assignTestFrequency`, `setupPeople`, `checkSliders`, `move`, `couple`, `uncouple`, `infect`, `test`, `percentInfected`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `infectionChance`, `symptomsShow`, `percentInfected`, `agents`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Infected %`, `HIV`, `History`, `Known %`, `Coupled`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `hiv` and links any shared checks.
