# Heatbugs

How do individual temperature preferences shape where agents gather? Each bug has an ideal temperature and gives off heat. Heat spreads to neighboring cells and slowly escapes. A bug that is too warm or too cold moves to the best free neighboring cell, and with `randomMoveChance` it sometimes moves at random instead.

Because the bugs warm their own surroundings, they can end up gathering in clusters or keeping their distance.

Things to try:

- Narrow the range between `minIdealTemp` and `maxIdealTemp`. How does the unhappiness measure change?
- Use `deepFreeze` or `heatUp` during a run and watch how the bugs respond.

## Use

Choose **Heatbugs** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/heatbugs/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `bugCount` | `100` | integer; ≥ 0; ≤ 500 |
| `minIdealTemp` | `10` | integer; ≥ 0; ≤ 200 |
| `maxIdealTemp` | `40` | integer; ≥ 0; ≤ 200 |
| `minOutputHeat` | `5` | integer; ≥ 0; ≤ 100 |
| `maxOutputHeat` | `25` | integer; ≥ 0; ≤ 100 |
| `evaporationRate` | `0.01` | number; ≥ 0; ≤ 1 |
| `diffusionRate` | `0.9` | number; ≥ 0; ≤ 1 |
| `randomMoveChance` | `0` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `deepFreeze`, `heatUp`, `setColorMode`, `watch`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `colorByUnhappiness`, `watched`, `meanUnhappiness`, `maxUnhappiness`, `bugs`, `cells`.

## Sources and limits

Adapted from the NetLogo *Heatbugs* model by Wilensky (2004). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Unhappiness is the distance from an assigned ideal, not a biological welfare measure, and heat units are not calibrated. The rules come from an artificial-life benchmark, not from insect thermoregulation. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `heatbugs`.
