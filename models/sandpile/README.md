# Sandpile

Can slow, steady loading produce avalanches of every size? Grains of sand are dropped onto a grid at a random place or a chosen location (`dropLocation`). A cell holding four or more grains topples: it passes one grain to each of its four neighbors, which may topple in turn. Grains that fall off the edge are lost. The model records the size and duration of each avalanche.

Things to try:

- Start with `initial` set to random and to a uniform level. How long until avalanches of many sizes appear?
- Drop all grains in the center and look at the shape that forms.

## Use

Choose **Sandpile** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/sandpile/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `101` | integer; ≥ 3; ≤ 201 |
| `height` | `101` | integer; ≥ 3; ≤ 201 |
| `seed` | `1` | integer |
| `initial` | `"random"` | `random`, `uniform` |
| `grainsPerField` | `1` | integer; ≥ 0; ≤ 3 |
| `dropLocation` | `"random"` | `center`, `random`, `mouse-click` |
| `animateAvalanches` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `dropAt`, `exploreAt`, `clearExplore`, `setExploreMode`, `clearData`, `setupUniform`, `setupRandom`, `setLive`, `stabilize`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `exploreMode`, `total`, `totalOnTick`, `average`, `cells`, `sizePlot`, `lifetimePlot`, `sizes`, `lifetimes`.

## Sources and limits

Adapted from the NetLogo *Sandpile* model by Weintrop, Tisue, Tinker, Head and Wilensky (2011). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Avalanche statistics depend on the finite grid and the driving rule; a finite histogram does not prove a scaling law. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `sandpile`.
