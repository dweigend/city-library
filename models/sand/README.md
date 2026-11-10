# Sand

Falling sand uses staged local rules so a generation reads a consistent old field before movement is committed. Pile geometry is the consequence of a cellular rule rather than a granular-mechanics solver.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Sand`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/sand/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `81` | integer; ≥ 5; ≤ 201 |
| `height` | `81` | integer; ≥ 5; ≤ 201 |
| `seed` | `1` | integer |
| `releaseChance` | `100` | number; ≥ 0; ≤ 100 |
| `spacing` | `3` | integer; ≥ 2; ≤ 15 |
| `density` | `10` | number; ≥ 0; ≤ 50 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `spout`, `moveAllSand`, `dumpSand`, `setLive`, `setSand`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `surfaceY`, `spoutY`, `cells`.

The [UI binding](ui.ts) presents `Release chance (%)`, `Dump density (%)`, `Dump sand`, `Tick`, `Sand sites`, `Sand`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `sand` and links any shared checks.
