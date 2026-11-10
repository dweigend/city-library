# Heroes and Cowards

Each actor moves relative to a selected friend and enemy, either toward a protective midpoint or away from danger. These geometric rules generate collective motion without a social decision or combat model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Heroes and Cowards`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/heroes-and-cowards/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `68` | integer; ≥ 3; ≤ 200 |
| `personalities` | `"mixed"` | `brave`, `cowardly`, `mixed` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `preset`, `setActors`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `diagnostic`, `agents`.

The [UI binding](ui.ts) presents `Tick`, `People`, `Movement`, `Friends and enemies`, `Selected person`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `heroes-and-cowards` and links any shared checks.
