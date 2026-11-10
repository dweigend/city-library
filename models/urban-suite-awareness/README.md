# Civic Awareness Spread

People gain awareness through information centers and informed contacts, lose it through disuse and can become activists. Awareness points and thresholds are invented operational measures rather than observed attitudes.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Civic Awareness Spread`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-awareness/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `people` | `60` | integer; ≥ 0; ≤ 300 |
| `centers` | `20` | integer; ≥ 0; ≤ 100 |
| `nonUsageLimit` | `100` | integer; ≥ 0; ≤ 500 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setPeople`, `setCenters`, `placeCenter`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `cells`, `counts`, `meanAwareness`, `meanNonUsage`.

The [UI binding](ui.ts) presents `Non-usage limit`, `Tick`, `Unaware`, `Aware`, `Well-informed`, `Activists`, `Centers`, `Mean awareness`, `Mean non-usage`, `Selected` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-awareness` and links the retained checks.
