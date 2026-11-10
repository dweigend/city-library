# Rebellion

When do individual grievances turn into open protest? Citizens feel a grievance that grows with their hardship and falls with `governmentLegitimacy`. They estimate the risk of arrest from the police and active rebels within `vision`. A citizen rebels when grievance outweighs risk. Police arrest visible rebels, who go to jail for up to `maxJailTerm` steps.

Things to try:

- Lower `governmentLegitimacy` slowly and watch the count of active rebels.
- Raise `initialCopDensity`. Does protest disappear or come in bursts?

## Use

Choose **Rebellion** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/rebellion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialCopDensity` | `4` | number; ≥ 0; ≤ 100 |
| `initialAgentDensity` | `70` | number; ≥ 0; ≤ 100 |
| `vision` | `7` | number; ≥ 0; ≤ 10 |
| `governmentLegitimacy` | `0.82` | number; ≥ 0; ≤ 1 |
| `maxJailTerm` | `30` | integer; ≥ 0; ≤ 50 |
| `movement` | `true` | boolean |
| `visualization` | `"2d"` | `2d`, `3d` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `watchOne`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `watchedId`, `agents`.

## Sources and limits

Adapted from the NetLogo *Rebellion* model (© 2004 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Legitimacy, risk aversion and vision are theoretical variables, not calibrated political measures. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `rebellion`.
