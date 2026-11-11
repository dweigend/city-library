# Tumor Growth

Why can a tumor come back after treatment? Cells come in two kinds. Stem cells renew themselves when they divide; transitory cells divide only a limited number of times and then die. Treatment actions remove the original stem cell, moving stem cells or all transitory cells, so you can test which removal stops growth under these rules.

Things to try:

- Use `killTransitoryCells` and watch whether the tumor regrows.
- Compare it with `killOriginalStemCell` and `killMovingStemCell`.

## Use

Choose **Tumor Growth** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/tumor/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `leaveTrail` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `setStem`, `forwardCell`, `moveTransitionalCells`, `mitosis`, `death`, `evaluateParams`, `killOriginalStemCell`, `killMovingStemCell`, `killTransitoryCells`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cellCount`, `cells`, `trails`.

## Sources and limits

Adapted from the NetLogo *Tumor* model by Zacijek and Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Persistence after a treatment follows from the chosen cell hierarchy, not from clinical data. The model makes no prediction about real tumors or therapies. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `tumor`.
