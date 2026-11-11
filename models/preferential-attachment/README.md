# Preferential Attachment

Why do some nodes in a growing network collect far more links than others? The network starts with two linked nodes. Each step adds one new node, which links to an existing node chosen with a probability proportional to that node's number of links. Well-connected nodes therefore keep attracting new links.

The degree distribution, also on a log scale, shows how the links are spread. This model is also the worked example in the [model authoring guide](../../docs/development/model-authoring.md).

Things to try:

- Run a few hundred steps with two seeds. Do the same early nodes become hubs?
- Compare the log-scale degree distribution after 100 and after 1000 steps.

## Use

Choose **Preferential Attachment** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/preferential-attachment/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Model-specific `read()` fields include `nodeCount`, `edgeCount`, `nodes`, `edges`, `distribution`, `logDistribution`.

## Sources and limits

Adapted from the NetLogo *Preferential Attachment* model by Wilensky (2005). Attribution and adaptation notes are in the comments of [model.ts](model.ts) and the retained source notices; the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

A finite degree distribution illustrates cumulative attachment. It does not show that any real network grew by this mechanism. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `preferential-attachment`.
