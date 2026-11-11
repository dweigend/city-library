# Crystallization

How do crystal grains form as metal cools? Atoms start hot (`initMetalTemp`) with random orientations and cool toward `roomTemp`. Once an atom is below `meltingTemp` and touches solid neighbors, it aligns with them and freezes. Separate seeds of solid lead to grains with different orientations and boundaries between them.

Things to try:

- Change `roomTemp` and compare the number and size of the grains.
- Use the `circle` shape and compare the grain pattern.

## Use

Choose **Crystallization** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/crystallization-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `31` | integer; ≥ 1; ≤ 31 |
| `height` | `31` | integer; ≥ 1; ≤ 31 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initMetalTemp` | `1550` | number; ≥ 1550; ≤ 2500 |
| `meltingTemp` | `550` | number; ≥ 500; ≤ 1500 |
| `roomTemp` | `100` | number; ≥ -20; ≤ 100 |
| `circle` | `false` | boolean |
| `histogram` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `coolAgents`, `rotate`, `recolor`, `setColor`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `tempRange`, `averageMetalTemp`, `frozenCount`, `atoms`, `histogram`.

## Sources and limits

Adapted from the NetLogo *Crystallization Basic* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Freezing counts and temperatures describe this staged rule, not an atomistic material model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `crystallization-basic`.
