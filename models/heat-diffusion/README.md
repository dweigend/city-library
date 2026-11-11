# Heat Diffusion

How do fixed edge temperatures shape the temperature of a plate? A square plate starts at `initialPlateTemp`. Its four edges are held at fixed temperatures. Each step, the plate's cells exchange heat with their neighbors in random order, at a rate set by the material (`materialType`) or by `alpha`.

Things to try:

- Compare aluminum with a slower material. How long until the plate settles?
- Set all edges to the same temperature and watch the plate even out.

## Use

Choose **Heat Diffusion** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/heat-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `51` | integer; ≥ 5; ≤ 101 |
| `height` | `51` | integer; ≥ 5; ≤ 101 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialPlateTemp` | `44` | number; ≥ 1; ≤ 100 |
| `leftTemp` | `1` | number; ≥ 1; ≤ 100 |
| `rightTemp` | `50` | number; ≥ 1; ≤ 100 |
| `topTemp` | `50` | number; ≥ 1; ≤ 100 |
| `bottomTemp` | `50` | number; ≥ 1; ≤ 100 |
| `alpha` | `0.8418` | number; ≥ 0.001; ≤ 10 |
| `materialType` | `"aluminum"` | `wood`, `stone`, `iron`, `aluminum`, `silver`, `other` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `updateFieldAt`, `updateAlpha`, `heatDiffusivity`, `setRules`, `setTemperatures`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `plateSize`, `minTemp`, `maxTemp`, `heatDiffusivity`, `cells`.

## Sources and limits

Adapted from the NetLogo *Heat Diffusion* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The random update order differs from a simultaneous numerical solution of the heat equation. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `heat-diffusion`.
