# Crystallization Basic

Atoms cool and then update crystal orientations in separate phases. Freezing counts and temperature distributions describe this staged local rule, without establishing an atomistic material model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Crystallization Basic`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/crystallization-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `31` | integer; ≥ 1; ≤ 31 |
| `height` | `31` | integer; ≥ 1; ≤ 31 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initMetalTemp` | `1550` | number; ≥ 1550; ≤ 2500 |
| `meltingTemp` | `550` | number; ≥ 500; ≤ 1500 |
| `roomTemp` | `100` | number; ≥ -20; ≤ 100 |
| `circle` | `false` | boolean |
| `histogram` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `coolAgents`, `rotate`, `recolor`, `setColor`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `tempRange`, `averageMetalTemp`, `frozenCount`, `atoms`, `histogram`.

The [UI binding](ui.ts) presents `Metal width`, `Metal height`, `Initial metal temperature`, `Tick`, `Average metal temperature`, `Source frozen count`, `Metal atoms`, `Temperatures`, `${Math.round(bin.lower)}–${Math.round(bin.upper)}`, `Number solidified` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `crystallization-basic` and links any shared checks.
