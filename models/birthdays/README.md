# Birthdays

How likely is it that two people in a room share a birthday? Each trial gives 23 people a random birthday out of 365 days and records whether any two match. The success rate over many trials can be compared with the theoretical chance for 23 people, which is just over one half.

Things to try:

- Run a few hundred trials and compare `successRate` with the theoretical value.
- Compare the success rate after 10, 100 and 1000 trials.

## Use

Choose **Birthdays** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/birthdays/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Live references: `world`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `days`, `people`, `successCount`, `successRate`.

## Sources and limits

Adapted from the NetLogo *Birthdays* model by Wilensky (2004). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The year has 365 equally likely days; leap days and seasonal birth patterns are left out. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `birthdays`.
