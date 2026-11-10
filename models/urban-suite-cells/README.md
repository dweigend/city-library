# Urban Suite - Cells

How do growth rules shape the form of a city? Cells are active or empty. An empty cell becomes active with `probability` when the number of active neighbors matches `countRule` for the chosen `neighborhood`. With `ageLimit`, active cells expire after a while.

Things to try:

- Compare the `neighborhood` options with the same `countRule`.
- Set `ageLimit` to 0 and then to a small value. How does the growth form change?

## Use

Choose **Urban Suite - Cells** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-cells/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `neighborhood` | `"von-neumann"` | `von-neumann`, `moore`, `displaced-von-n`, `h`, `moore-von-n` |
| `countRule` | `"exactly-one"` | `positive`, `exactly-one`, `at-most-two` |
| `probability` | `100` | integer; ≥ 0; ≤ 100 |
| `ageLimit` | `55` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `addRandomSeed`, `cycleColors`, `setCells`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `startingColor`, `cells`, `counts`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Cells* model by Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The lattice has no households, prices or transport; it only shows growth forms. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-cells`.
