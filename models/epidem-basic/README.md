# Basic Epidemic

How does a rare infection spread through a population that is fully susceptible? People move around. An infected person can infect a susceptible neighbor with `infectionChance`, and after about `averageRecoveryTime` an infected person recovers with `recoveryChance`. Recovered people stay immune. The population is closed: nobody is born, dies or leaves. The model reports infected and cured counts and estimates R0 from its own infection history.

Things to try:

- Lower `infectionChance` and compare the peak of infected people.
- Change `initialPersonCount` at the same chances. How does density change the course?

## Use

Choose **Basic Epidemic** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/epidem-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPersonCount` | `100` | integer; ≥ 50; ≤ 400 |
| `infectionChance` | `30` | number; ≥ 0; ≤ 100 |
| `recoveryChance` | `60` | number; ≥ 0; ≤ 100 |
| `averageRecoveryTime` | `210` | number; ≥ 0; ≤ 300 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setupPeople`, `move`, `clearCount`, `infect`, `maybeRecover`, `calculateR0`, `go`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `betaN`, `gamma`, `r0`, `previousNewlyInfectedPersonCount`, `infectedCount`, `curedCount`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *epiDEM Basic* model by Yang and Wilensky (2011). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The counts and R0 come from this model's random encounters. They are not estimates for a real disease. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `epidem-basic`.
