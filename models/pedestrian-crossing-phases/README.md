# Pedestrian Crossing Phases

How does a fixed signal cycle let a waiting group cross? Each step is one minute. The light is red for three minutes and then green for `greenMinutes`. While it is green, every waiting pedestrian starts crossing; a crossing pedestrian arrives one minute later. All pedestrians decide from the same previous state before anyone moves.

Things to try:

- Set `greenMinutes` to 1 and 4 and count the minutes until everyone has arrived.

## Use

Choose **Pedestrian Crossing Phases** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/pedestrian-crossing-phases/model.ts";

const crossing = create({ pedestrianCount: 8, greenMinutes: 2 });
crossing.advance(5);
const { signal, waitingPedestrianCount, arrivedPedestrianCount } = crossing.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `pedestrianCount` | `8` | integer; ≥ 1; ≤ 40 | Pedestrians waiting at the start |
| `greenMinutes` | `2` | integer; ≥ 1; ≤ 4 | Length of the green phase in minutes |

## Actions and observations

`advance()` runs minutes. `read()` reports the `signal`, the counts of waiting, crossing and arrived pedestrians, each person's stage and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [model-regressions.test.ts](../../tests/model-regressions.test.ts). Passing them shows that the mechanism works as described, not that the model says anything about traffic safety.
