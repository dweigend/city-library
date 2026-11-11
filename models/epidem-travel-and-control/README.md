# Epidemic Travel and Control

How do travel and control measures change an epidemic? This model extends epiDEM Basic. People live in separate regions and may travel between them (`travel`, `travelTendency`), may form social links (`edges`), may isolate themselves or go to hospital according to individual tendencies, and may be inoculated. Ambulances bring people to hospital.

Things to try:

- Switch `travel` on and off with the same seed. Does the infection reach all regions?
- Raise `averageIsolationTendency` and compare the infected count.

## Use

Choose **Epidemic Travel and Control** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/epidem-travel-and-control/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialPersonCount` | `250` | integer; ≥ 50; ≤ 400 |
| `initialAmbulanceCount` | `2` | integer; ≥ 0; ≤ 4 |
| `infectionChance` | `55` | number; ≥ 0; ≤ 100 |
| `recoveryChance` | `45` | number; ≥ 0; ≤ 100 |
| `averageRecoveryTime` | `110` | number; ≥ 0; ≤ 300 |
| `averageIsolationTendency` | `5` | number; ≥ 0; ≤ 50 |
| `averageHospitalGoingTendency` | `5` | number; ≥ 0; ≤ 50 |
| `inoculationChance` | `10` | number; ≥ 0; ≤ 100 |
| `intraMobility` | `0.4` | number; ≥ 0; ≤ 1 |
| `travelTendency` | `1` | number; ≥ 0; ≤ 1 |
| `edges` | `false` | boolean |
| `travel` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `setupGlobals`, `setupPeople`, `setupAmbulance`, `assignTendency`, `makeNetwork`, `move`, `clearCount`, `infect`, `isolate`, `hospitalize`, `unisolate`, `maybeRecover`, `calculateR0`, `go`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `betaN`, `gamma`, `r0`, `previousNewlyInfectedPersonCount`, `infectedCount`, `curedCount`, `cells`, `edges`, `agents`.

## Sources and limits

Adapted from the NetLogo *epiDEM Travel and Control* model by Yang and Wilensky (2011). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Recovery gives perfect immunity, the virus never changes and interventions are simplified. Comparisons between policies hold only within these assumptions. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `epidem-travel-and-control`.
