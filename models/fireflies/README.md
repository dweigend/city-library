# Fireflies

When do flashing insects start to flash in unison? Each firefly runs through a cycle of `cycleLength` steps and flashes at its start. When a firefly sees at least `flashCountToReset` flashing neighbors, it adjusts its own clock according to the chosen `strategy`. Fireflies also keep moving.

The flash count shows how many fireflies light up in each step, so synchronized flashing would appear as sharp peaks.

Things to try:

- Compare the two `strategy` values with the same seed.
- Lower `fireflyCount`. Does synchronization still appear, and how long does it take?

## Use

Choose **Fireflies** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/fireflies/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `fireflyCount` | `1500` | integer; ≥ 0; ≤ 2000 |
| `flashLength` | `1` | integer; ≥ 1; ≤ 10 |
| `cycleLength` | `10` | integer; ≥ 5; ≤ 100 |
| `flashCountToReset` | `1` | integer; ≥ 1; ≤ 3 |
| `strategy` | `"delay"` | `delay`, `advance` |
| `showDarkFireflies` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `flashingCount`, `fireflies`.

## Sources and limits

Adapted from the NetLogo *Fireflies* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Discrete counters and simple perception stand in for real signal recognition and measured light responses. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `fireflies`.
