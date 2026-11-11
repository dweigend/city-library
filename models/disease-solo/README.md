# Disease Solo

How does the way people move change their exposure to infection? You control one person among wandering androids. An infected agent can infect others it meets with `infectionChance`. Androids can be set to `chase` or `avoid` the person, which changes how often contacts happen. `setupKeep` keeps the current androids for a new round, `setupClear` replaces them.

Things to try:

- Turn on `avoid` and compare how long the person stays healthy.
- Turn on `chase`. How quickly does the infection spread among androids?

## Use

Choose **Disease Solo** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/disease-solo/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `androidCount` | `60` | integer; ≥ 1; ≤ 300 |
| `infectionChance` | `100` | number; ≥ 0; ≤ 100 |
| `stepSize` | `1` | integer; ≥ 1; ≤ 5 |
| `chase` | `false` | boolean |
| `avoid` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `go`, `setParameters`, `setupClear`, `setupKeep`, `setupWorld`, `infect`, `move`, `createSomeAndroids`, `createUser`, `androidsWander`, `avoid`, `chase`, `spreadDisease`, `maybeGetSick`, `getSick`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `sickCount`, `runNumber`, `delay`, `agents`.

## Sources and limits

Adapted from the NetLogo *Disease Solo* model by Wilensky (2005). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Contacts are stylized; the model does not measure real contact behavior. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `disease-solo`.
