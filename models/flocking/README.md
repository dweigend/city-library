# Flocking

How can a group move together without a leader? Each bird looks at neighbors within `vision`. If one is closer than `minimumSeparation`, it turns away; otherwise it turns to match its neighbors' heading and to move toward them. Each turn is limited by its own maximum (`maxSeparateTurn`, `maxAlignTurn`, `maxCohereTurn`).

Birds update one after another; as these local turns add up, flocks can form, merge and split.

Things to try:

- Set `maxAlignTurn` to 0. What happens to the flocks?
- Lower `vision` and compare the number and size of flocks.

## Use

Choose **Flocking** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/flocking/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `birdCount` | `300` | integer; ≥ 1; ≤ 1000 |
| `vision` | `5` | number; ≥ 0; ≤ 10 |
| `minimumSeparation` | `1` | number; ≥ 0; ≤ 5 |
| `maxAlignTurn` | `5` | number; ≥ 0; ≤ 20 |
| `maxCohereTurn` | `3` | number; ≥ 0; ≤ 20 |
| `maxSeparateTurn` | `1.5` | number; ≥ 0; ≤ 20 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `birds`.

## Sources and limits

Adapted from the NetLogo *Flocking* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Fixed turn limits and a chosen vision range leave out flight mechanics and sensing errors. A coherent flock shows the effect of the local rules, not route planning. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `flocking`.
