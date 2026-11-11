# Genetic Drift by Contact

Can a population lose its diversity when no trait has an advantage? Agents of `colorCount` colors wander. When two meet, one copies the other's color. Nothing favors any color, yet a color that disappears can never come back. Walls can be drawn to split the space into separate groups.

Things to try:

- Compare `colorCount` 2 and 10. How long does it take until one color remains?
- Divide the space with a wall. Do the two sides end up with the same color?

## Use

Choose **Genetic Drift by Contact** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/gendrift-t-interact/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `agentCount` | `300` | integer; ≥ 1; ≤ 1000 |
| `colorCount` | `5` | integer; ≥ 2; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setParameters`, `placeWall`, `removeWall`, `removeAllWalls`, `setWallMode`, `drawWall`, `makeAgent`, `meet`, `moveOffWall`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `maxPercent`, `wallMode`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *GenDrift T interact* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Color copying stands for neutral drift, not mating or chromosomes. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `gendrift-t-interact`.
