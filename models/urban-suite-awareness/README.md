# Civic Awareness Spread

How does awareness of an issue spread and fade? People move around. They gain awareness points at information centers and from aware people they meet, and lose them when they go without contact for long (`nonUsageLimit`). Highly aware people become activists and open new centers.

Things to try:

- Lower `centerCount`. Does awareness die out?
- Raise `nonUsageLimit` and compare the share of activists.

## Use

Choose **Civic Awareness Spread** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-awareness/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `personCount` | `60` | integer; ≥ 0; ≤ 300 |
| `centerCount` | `20` | integer; ≥ 0; ≤ 100 |
| `nonUsageLimit` | `100` | integer; ≥ 0; ≤ 500 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setPeople`, `setCenters`, `placeCenter`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `cells`, `counts`, `meanAwareness`, `meanNonUsage`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Awareness* model by Felsen and Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Awareness points and thresholds are invented measures, not observed attitudes. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-awareness`.
