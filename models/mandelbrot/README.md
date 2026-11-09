# Mandelbrot

Moving agents distribute complex-number iteration work across fields and record escape behavior. The finite iteration limit and sampling grid determine the image; undecided points are not a proof of set membership.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Mandelbrot`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/mandelbrot/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Setup creates workers and the initial complex plane, not a finished image. Each `advance(1)` performs one worker sweep and advances the tick; only occupied eligible fields receive complex iterations. Several workers can update the same field in a sweep, so ticks, `iterations` and `computedFields` measure different work. Run has no automatic full-image completion gate; pause manually. Change `scaleFactor` through setup to rebuild the plane; `Hide agents` only hides workers.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numAgents` | `1500` | integer; ≥ 0; ≤ 1500 |
| `throw` | `10` | integer; ≥ 0; ≤ 99 |
| `scaleFactor` | `100` | integer; ≥ 1; ≤ 500 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `hideAgents`, `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `setupScale`, `maxIterations`, `fields`, `agents`, `computedFields`, `iterations`.

The [UI binding](ui.ts) presents `Number of agents`, `Hide agents`, `Tick`, `Computed fields`, `Total iterations`, `Mandelbrot`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `mandelbrot` and links any shared checks.
