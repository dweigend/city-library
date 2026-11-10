# Structure from Random Thresholds

Can random fluctuations leave a lasting mark? Each cell holds a potential. In each step it averages its potential with its four neighbors and adds random signed noise. A cell whose potential passes `threshold` becomes active and stays active for good, even if its potential later falls.

Things to try:

- Raise `threshold`. How large do the active regions become, and how long does that take?
- Compare two seeds with the same threshold.

## Use

Choose **Structure from Random Thresholds** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-structure-from-randomness-2/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `threshold` | `4.5` | number; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setPotentials`, `setActivations`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Structure from Randomness 2* model by Wilensky (2007). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The active state and the changing potential are separate quantities. There are no buildings or budgets in this model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-structure-from-randomness-2`.
