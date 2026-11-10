# Traffic on One Lane

Can a traffic jam appear with no obstacle on the road? Cars drive one behind the other around a closed loop. Each car speeds up by `acceleration` when the road ahead is free and slows down by `deceleration` when a car is close ahead.

Things to try:

- Raise `carCount` step by step. When do stop-and-go waves appear?
- Change `deceleration`. Do jams move faster or slower along the road?

## Use

Choose **Traffic on One Lane** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/traffic-basic/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `carCount` | `20` | integer; ≥ 1; ≤ 51 |
| `acceleration` | `0.0045` | number; ≥ 0; ≤ 0.0099 |
| `deceleration` | `0.026` | number; ≥ 0; ≤ 0.099 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `slowDownCar`, `speedUpCar`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `selectedCarId`, `cars`, `cells`.

## Sources and limits

Adapted from the NetLogo *Traffic Basic* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

All cars follow the same simplified rule on one lane, so this shows the mechanism, not real freeway traffic. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `traffic-basic`.
