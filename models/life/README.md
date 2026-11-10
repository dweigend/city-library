# Life

All cells count the old generation on a toroidal grid before births and deaths are committed. The familiar birth-at-three and survival-at-two-or-three rule is deterministic; initialization alone supplies variation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Life`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/life/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `101` | integer; ≥ 3; ≤ 301 |
| `height` | `101` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialDensity` | `35` | number; ≥ 0; ≤ 100 |
| `initialization` | `"random"` | `random`, `blank` |
| `foreground` | `"#660f40"` | text |
| `background` | `"#d2ece4"` | text |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setCells`, `setCell`, `setDrawing`, `beginBrush`, `moveBrush`, `endBrush`, `setColors`, `recolor`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `counts`, `density`, `drawing`, `brush`.

The [UI binding](ui.ts) presents `Draw cells`, `Recolor`, `Toggle selected cell`, `Tick`, `Living`, `Density`, `Cells`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `life` and links any shared checks.
