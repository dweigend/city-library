# Wolf Sheep Predation

Can predators and prey keep each other in check when every animal follows only a few local rules? Sheep and wolves wander and reproduce with a fixed chance per step. Wolves spend energy every step and gain it by eating sheep they meet; a wolf without energy dies. In the `sheep-wolves-grass` mode, sheep spend energy too and must eat grass, which grows back `grassRegrowth` steps after being eaten. In the simpler `sheep-wolves` mode, sheep need no food.

Population curves can rise and fall in linked waves, but they come from individual encounters, not from the classic predator–prey equations.

Things to try:

- Compare the two `mode` values with the same seed. Which one keeps both species alive longer?
- Change `grassRegrowth` in the grass mode and follow the sheep and wolf counts. How does the timing of the waves shift?

## Use

Choose **Wolf Sheep Predation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/wolf-sheep-predation/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `mode` | `"sheep-wolves"` | `sheep-wolves`, `sheep-wolves-grass` |
| `initialSheepCount` | `100` | integer; ≥ 0; ≤ 250 |
| `initialWolfCount` | `50` | integer; ≥ 0; ≤ 250 |
| `sheepGain` | `4` | integer; ≥ 0; ≤ 50 |
| `wolfGain` | `20` | integer; ≥ 0; ≤ 100 |
| `sheepReproduce` | `4` | integer; ≥ 1; ≤ 20 |
| `wolfReproduce` | `5` | integer; ≥ 0; ≤ 20 |
| `grassRegrowth` | `30` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `counts`, `agents`, `cells`, `stopReason`.

## Sources and limits

Adapted from the NetLogo *Wolf Sheep Predation* model by Wilensky (1997). Attribution and adaptation notes are in the comments of [model.ts](model.ts) and the retained source notices; the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Random movement, fixed reproduction chances and simple energy budgets stand in for real animal behavior. The model shows what these rules can produce; it does not predict real populations. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `wolf-sheep-predation`.
