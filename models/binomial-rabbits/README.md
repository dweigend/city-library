# Binomial Rabbits

Why do many random hops add up to a predictable spread? Each rabbit makes `hopCount` hops. On each hop it picks one of up to three hop lengths (`hop1` … `hop3`), weighted by `ratio1` … `ratio3`. The final positions of all rabbits form a distribution, plotted together with averages.

Things to try:

- Use two equal-weight hops of +1 and −1 and look at the shape of the distribution.
- Make the weights unequal. Where does the center of the distribution move?

## Use

Choose **Binomial Rabbits** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/binomial-rabbits/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `rabbitCount` | `2400` | integer; ≥ 1; ≤ 4000 |
| `hopCount` | `20` | integer; ≥ 0; ≤ 99 |
| `xScaling` | `1` | integer; ≥ 1; ≤ 10 |
| `hop1` | `1` | integer; ≥ -5; ≤ 5 |
| `hop2` | `-1` | integer; ≥ -5; ≤ 5 |
| `hop3` | `0` | integer; ≥ -5; ≤ 5 |
| `ratio1` | `1` | integer; ≥ 0; ≤ 10 |
| `ratio2` | `1` | integer; ≥ 0; ≤ 10 |
| `ratio3` | `0` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `goOneHop`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `rabbits`, `mean`, `xScale`, `yScale`, `distribution`.

## Sources and limits

Adapted from the NetLogo *Binomial Rabbits* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

With several hop patterns and a finite population, not every setting is a literal binomial experiment. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `binomial-rabbits`.
