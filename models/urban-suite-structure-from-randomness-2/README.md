# Structure from Random Thresholds

Staged potential averaging and signed noise feed a threshold whose activation persists. The irreversible displayed state and the changing potential are separate quantities, without buildings or resource budgets.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Structure from Random Thresholds`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-structure-from-randomness-2/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `threshold` | `4.5` | number; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setPotentials`, `setActivations`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`.

The [UI binding](ui.ts) presents `Tick`, `Above now`, `Activated`, `Mean potential`, `Max potential`, `Selected`, `Persistent activation`, `Cells above threshold · current predicate`, `Currently above`, `Potential · maximum and mean × 10` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-structure-from-randomness-2` and links the retained checks.
