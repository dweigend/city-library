# Dining Philosophers

How can processes share resources without getting stuck? Philosophers sit around a table with one fork between each pair. They switch between thinking, being hungry and eating, and each needs both neighboring forks to eat. `hungryChance` and `fullChance` set how often they change state. With `cooperation` on, they follow a marked-fork rule that avoids everyone holding one fork and waiting forever.

Things to try:

- Run with `cooperation` off. Does the table ever lock up?
- Switch `cooperation` on and compare how often each philosopher eats.

## Use

Choose **Dining Philosophers** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/dining-philosophers/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `philosopherCount` | `20` | integer; ≥ 2; ≤ 40 |
| `hungryChance` | `0.5` | number; ≥ 0; ≤ 1 |
| `fullChance` | `0.5` | number; ≥ 0; ≤ 1 |
| `cooperation` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `activate`, `counts`, `setParameters`, `setScenario`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `philosophers`, `forks`.

## Sources and limits

Adapted from the NetLogo *Dining Philosophers* model by Wilensky (2003). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Finite runs cannot prove that no philosopher starves; that needs an argument, not a simulation. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `dining-philosophers`.
