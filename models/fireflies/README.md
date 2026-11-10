# Fireflies

Moving fireflies adjust their phase through local flashing neighbors, with recoloring delayed according to the source order. The flashing count summarizes pulse coupling rather than a measured insect light-response curve.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Fireflies`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/fireflies/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `1500` | integer; ≥ 0; ≤ 2000 |
| `flashLength` | `1` | integer; ≥ 1; ≤ 10 |
| `cycleLength` | `10` | integer; ≥ 5; ≤ 100 |
| `flashesToReset` | `1` | integer; ≥ 1; ≤ 3 |
| `strategy` | `"delay"` | `delay`, `advance` |
| `showDarkFireflies` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `flashingCount`, `fireflies`.

The [UI binding](ui.ts) presents `Tick`, `Flashing`, `Fireflies`, `Selected firefly`, `Flashing fireflies`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `fireflies` and links any shared checks.
