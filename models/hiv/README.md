# HIV Transmission

How do partnership length, condom use and testing change how a sexually transmitted infection spreads? People move, form couples with `averageCouplingTendency` and stay together for about `averageCommitment` steps. Infection can pass within a couple, unless a condom is used (`averageCondomUse`). People get tested with `averageTestFrequency`; in this model, those who know they are infected always practice safer sex.

Things to try:

- Raise `averageTestFrequency` and compare the percentage infected over time.
- Change `averageCommitment`. Do longer partnerships slow or speed the spread?

## Use

Choose **HIV Transmission** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/hiv/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPersonCount` | `300` | integer; ≥ 50; ≤ 500 |
| `averageCommitment` | `50` | number; ≥ 1; ≤ 200 |
| `averageCouplingTendency` | `5` | number; ≥ 0; ≤ 10 |
| `averageCondomUse` | `0` | number; ≥ 0; ≤ 10 |
| `averageTestFrequency` | `0` | number; ≥ 0; ≤ 2 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `go`, `setParameters`, `randomNear`, `assignCommitment`, `assignCouplingTendency`, `assignCondomUse`, `assignTestFrequency`, `setupPeople`, `checkSliders`, `move`, `couple`, `uncouple`, `infect`, `test`, `percentInfected`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `infectionChance`, `symptomsShow`, `percentInfected`, `agents`, `cells`.

## Sources and limits

Adapted from the NetLogo *HIV* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Infection and symptoms are simplified, the population is closed, and the model does not estimate any individual's medical risk. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `hiv`.
