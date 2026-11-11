# Virus

What lets an infection persist in a population? People move, age, reproduce and die. A sick person can infect healthy people nearby with `infectiousness`. After `duration` steps, a sick person recovers with `chanceRecover` and becomes immune for some time, or dies. Births bring new susceptible people.

Things to try:

- Lower `chanceRecover`. Does the infection burn out or persist?
- Shorten `duration` and compare the share of immune people.

## Use

Choose **Virus** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/virus/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `personCount` | `150` | integer; ≥ 10; ≤ 300 |
| `infectiousness` | `65` | number; ≥ 0; ≤ 99 |
| `chanceRecover` | `75` | number; ≥ 0; ≤ 99 |
| `duration` | `20` | number; ≥ 0; ≤ 99 |
| `agentShape` | `"person"` | `person`, `circle` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `go`, `setParameters`, `setupAgents`, `updateGlobalVariables`, `getOlder`, `move`, `infect`, `recoverOrDie`, `reproduce`, `getSick`, `getHealthy`, `becomeImmune`, `immune`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `percentInfected`, `percentImmune`, `lifespan`, `carryingCapacity`, `chanceReproduce`, `immunityDuration`, `agents`.

## Sources and limits

Adapted from the NetLogo *Virus* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Contact comes from random movement, not a measured social network, and the model does not forecast a real virus. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `virus`.
