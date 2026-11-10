# Segregation

Agents compare nearby similarity with a threshold and relocate sequentially when dissatisfied. A satisfied final arrangement reflects the specified local preferences and vacancies, not a complete causal model of residential segregation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Segregation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/segregation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `51` | integer; ≥ 3; ≤ 101 |
| `height` | `51` | integer; ≥ 3; ≤ 101 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `95` | integer; ≥ 50; ≤ 99 |
| `similarWanted` | `30` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setResidents`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `residents`, `counts`, `percentSimilar`, `percentUnhappy`, `stopReason`.

The [UI binding](ui.ts) presents `Density (%)`, `Similar neighbors wanted (%)`, `Tick`, `Residents`, `Unhappy`, `Unhappy (%)`, `Similar (%)`, `State`, `Selected`, `Neighborhood` and further views or controls.

The [detailed model contract](contract.md) defines the public procedures and boundary behavior.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `segregation` and links any shared checks.
