# Party

People compare the fraction of the other sex in their group with a tolerance and move between group sites when unhappy. The male/female labels and this one preference rule are source assumptions rather than a measured model of real social preferences.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Party`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/party/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `70` | integer; ≥ 0; ≤ 300 |
| `groupCount` | `10` | integer; ≥ 5; ≤ 20 |
| `tolerance` | `25` | number; ≥ 0; ≤ 99 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `setGroups`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `groups`.

The [UI binding](ui.ts) presents `People`, `Groups`, `Opposite-sex tolerance (%)`, `Tick`, `Happy`, `Single-sex groups`, `Party groups`, `Person`, `Number happy`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `party` and links any shared checks.
