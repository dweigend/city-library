# Forest Fire

How dense must a forest be for a fire to cross it? Trees fill the grid randomly with `density` percent. The fire starts at the left edge. Each step, the trees burning at its start ignite their four direct neighbors, then turn into fading embers. Empty cells stop the fire.

`percentBurned` shows how much of the original forest burned.

Things to try:

- Try `density` values between 50 and 65. Does the fire reach the right edge?
- Use the same density with several seeds. How much does the burned share vary?

## Use

Choose **Forest Fire** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/fire/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `251` | integer; ≥ 3; ≤ 301 |
| `height` | `251` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `57` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setForest`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `initialTreeCount`, `burnedTreeCount`, `percentBurned`, `counts`.

## Sources and limits

Adapted from the NetLogo *Fire* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The forest has no wind, fuel differences or regrowth; this is a percolation experiment, not a wildfire forecast. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `fire`.
