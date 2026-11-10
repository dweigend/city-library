# Dining Philosophers

Asynchronously activated philosophers compete for adjacent forks and alternate between states. Marked-fork cooperation is an explicit alternative to uncoordinated acquisition; finite runs alone do not prove freedom from starvation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Dining Philosophers`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/dining-philosophers/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `philosopherCount` | `20` | integer; ≥ 2; ≤ 40 |
| `hungryChance` | `0.5` | number; ≥ 0; ≤ 1 |
| `fullChance` | `0.5` | number; ≥ 0; ≤ 1 |
| `cooperation` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `activate`, `counts`, `setParameters`, `setScenario`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `philosophers`, `forks`.

The [UI binding](ui.ts) presents `Philosophers`, `Tick`, `Thinking`, `Hungry`, `Eating`, `Table`, `Spaghetti consumed`, `Consumed`, `Resource allocation`, `Fork ownership` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `dining-philosophers` and links any shared checks.
