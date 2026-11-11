# Ants

Can an ant colony exploit food sources using only local scent? Ants wander until they find food, then carry it home and drop a chemical trail on the way. Other searching ants follow the strongest scent nearby. The chemical spreads to neighboring cells (`diffusionRate`) and fades (`evaporationRate`), so only trails that are reinforced stay strong.

Three food piles at different distances from the nest are used up one by one.

Things to try:

- Raise `evaporationRate`. Do trails to the far pile still form?
- Vary `antCount` and compare the order in which the piles are emptied.

## Use

Choose **Ants** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ants/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `antCount` | `125` | integer; ≥ 0; ≤ 200 |
| `diffusionRate` | `50` | integer; ≥ 0; ≤ 99 |
| `evaporationRate` | `10` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `ants`, `cells`, `foodByPile`.

## Sources and limits

Adapted from the NetLogo *Ants* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The model has no route memory, central allocation or species-specific sensing. Efficient-looking trails show what local feedback can produce, not global optimality or a quantitative match to a real colony. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ants`.
