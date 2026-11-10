# Shepherds

Can collectors gather moving objects into one herd using only local rules? Shepherds wander until they find a sheep, carry it and drop it near other sheep. Unlike the chips in Termites, the sheep keep moving on their own at `sheepSpeed`, which constantly works against the herding.

The balance between shepherds and wandering sheep decides whether herds form and how long they last.

Things to try:

- Raise `sheepSpeed` step by step. Can the shepherds still keep herds together?
- Compare a few shepherds with many shepherds at the same `sheepCount`.

## Use

Choose **Shepherds** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/shepherds/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `sheepCount` | `150` | integer; ≥ 0; ≤ 500 |
| `shepherdCount` | `30` | integer; ≥ 0; ≤ 100 |
| `sheepSpeed` | `0.02` | number; ≥ 0; ≤ 0.2 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `herdingEfficiency`, `sheeplessNeighborhoods`, `sheep`, `shepherds`, `cells`.

## Sources and limits

Adapted from the NetLogo *Shepherds* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Real herding does not involve carrying animals; this is an abstract experiment in clustering mobile objects, not a model of livestock management. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `shepherds`.
