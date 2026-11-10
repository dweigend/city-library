# Segregation

Can mild preferences about who lives next door add up to strongly separated neighborhoods? This model lets you test the idea Thomas Schelling made famous.

Blue and orange residents fill most cells of a wrapping grid. A resident is content when at least `similarWanted` percent of its occupied neighboring cells (the eight around it) belong to its own group; a resident without neighbors is content too. On each step, every discontented resident, in random order, takes short random walks until it reaches an empty cell. Contentment is recomputed after all moves. The run stops on its own when everyone is content, or when the grid has no empty cell left.

`percentSimilar` measures the result: the share of same-group neighbors, summed over all residents.

With the defaults (seed 1, density 95, `similarWanted` 30), everyone is content after 17 steps and `percentSimilar` has risen from 49.5 to 74.4. With `similarWanted` 50 and otherwise the same settings, the run ends after 24 steps at 85.3. Other seeds give other numbers.

Things to try:

- Raise `similarWanted` step by step and follow `percentSimilar` and the number of steps until the run stops. Is there a threshold beyond which it no longer settles?
- Lower `density` to 50. How do more empty cells change the number of steps and the final `percentSimilar`?
- Change `similarWanted` during a run with `setRules`. Does an arrangement that looked settled start moving again?

## Use

Choose **Segregation** in [Agent Lab](../../ui/agent-lab/README.md). Select a resident to inspect its neighborhood.

From a script in the repository root:

```ts
import { create } from "./models/segregation/model.ts";

const simulation = create({ seed: 1 });
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `51` | integer; ≥ 3; ≤ 101 |
| `height` | `51` | integer; ≥ 3; ≤ 101 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `95` | integer; ≥ 50; ≤ 99 |
| `similarWanted` | `30` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

- `setRules({ similarWanted })` changes the threshold and recomputes contentment at once.
- `setResidents([...])` replaces all residents with a fixed arrangement, which is useful for exact tests.

Model-specific `read()` fields include `residents`, `counts`, `percentSimilar`, `percentUnhappy` and `stopReason`. The [model contract](contract.md) defines the procedures and their boundary behavior.

## Sources and limits

Adapted from Uri Wilensky's NetLogo *Segregation* model (1997). Attribution, license and the list of changes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The model is a thought experiment. Two groups, free relocation and a fixed contentment rule leave out housing costs, discrimination and institutions, so a separated final pattern shows what the stated local rule can produce, not why real cities are segregated. Seeded runs differ from NetLogo because the random generator differs.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `segregation`.
