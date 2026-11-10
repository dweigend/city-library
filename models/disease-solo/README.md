# Disease Solo

A controlled person shares space with wandering androids; contact, chasing and avoidance determine infection opportunities. Keep/clear setup actions distinguish retaining a population from replacing it; contacts are stylized rather than measured.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Disease Solo`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/disease-solo/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `androidCount` | `60` | integer; ≥ 1; ≤ 300 |
| `infectionChance` | `100` | number; ≥ 0; ≤ 100 |
| `stepSize` | `1` | integer; ≥ 1; ≤ 5 |
| `chase` | `false` | boolean |
| `avoid` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `go`, `setParameters`, `setupClear`, `setupKeep`, `setupWorld`, `infect`, `move`, `createSomeAndroids`, `createUser`, `androidsWander`, `avoid`, `chase`, `spreadDisease`, `maybeGetSick`, `getSick`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `sickCount`, `runNumber`, `delay`, `agents`.

The [UI binding](ui.ts) presents `Infect`, `Keep plots`, `Clear plots`, `Up`, `Right`, `Down`, `Left`, `Tick`, `Sick`, `Run` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `disease-solo` and links any shared checks.
