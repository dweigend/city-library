# Party

Can a party sort itself into single-sex groups even if everyone tolerates a mixed group? Guests stand in `groupCount` groups. A guest is uncomfortable when the share of the other sex in their group exceeds `tolerance` percent and then moves to another group. The model counts how many groups end up single-sex.

Things to try:

- Raise `tolerance` step by step. How many single-sex groups remain?
- Change `groupCount` with the same tolerance.

## Use

Choose **Party** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/party/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `personCount` | `70` | integer; ≥ 0; ≤ 300 |
| `groupCount` | `10` | integer; ≥ 5; ≤ 20 |
| `tolerance` | `25` | number; ≥ 0; ≤ 99 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `setGroups`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `groups`.

## Sources and limits

Adapted from the NetLogo *Party* model (© 1997 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The two labels and one tolerance rule are assumptions from the source, not a measured model of social preferences. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `party`.
