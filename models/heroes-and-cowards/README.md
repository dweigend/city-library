# Heroes and Cowards

Can a simple geometric rule make a crowd move in organized ways? Each person picks one friend and one enemy. Brave people move to a point between friend and enemy, as if to protect the friend; cowards move behind their friend so the friend shields them. `personalities` sets everyone brave, everyone cowardly or a mix.

Things to try:

- Compare all-brave and all-coward runs with the same seed.
- Use `preset` to try the prepared arrangements.

## Use

Choose **Heroes and Cowards** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/heroes-and-cowards/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `personCount` | `68` | integer; ≥ 3; ≤ 200 |
| `personalities` | `"mixed"` | `brave`, `cowardly`, `mixed` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `preset`, `setActors`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `diagnostic`, `agents`.

## Sources and limits

Adapted from the NetLogo *Heroes and Cowards* model (© 2014 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The rules are pure geometry; there is no social decision-making or combat. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `heroes-and-cowards`.
