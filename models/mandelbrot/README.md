# Mandelbrot

How does a simple rule draw an endlessly detailed boundary? Every point c of the complex plane is tested by repeating z → z² + c from z = 0. Points whose values escape quickly are colored by how fast they escape; points that stay bounded within the iteration limit belong to the dark shape. Here, moving worker agents share the computation: each worker iterates the field it stands on, then hops on (`throw`).

Things to try:

- Change `agentCount` and compare how quickly the image fills in.
- Change `scaleFactor` to zoom and rebuild the plane.

## Use

Choose **Mandelbrot** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/mandelbrot/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Setup creates workers and the initial complex plane, not a finished image. Each `advance(1)` performs one worker sweep and advances the tick; only occupied eligible fields receive complex iterations. Several workers can update the same field in a sweep, so ticks, `iterationCount` and `computedFieldCount` measure different work. Run has no automatic full-image completion gate; pause manually. Change `scaleFactor` through setup to rebuild the plane; `Hide agents` only hides workers.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `agentCount` | `1500` | integer; ≥ 0; ≤ 1500 |
| `throw` | `10` | integer; ≥ 0; ≤ 99 |
| `scaleFactor` | `100` | integer; ≥ 1; ≤ 500 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `hideAgents`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `setupScale`, `maxIterationCount`, `fields`, `agents`, `computedFieldCount`, `iterationCount`.

## Sources and limits

Adapted from the NetLogo *Mandelbrot* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The finite iteration limit and grid decide the image; a point that has not escaped yet is not proven to belong to the set. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `mandelbrot`.
