# EV Charging Queue

Who gets a charger first when cars queue? Electric vehicles wait for `chargerCount` chargers. Waiting vehicles are served by priority, sessions can have different lengths, and a waiting vehicle can give up. Each step advances one minute.

With the defaults (two chargers, sessions of 2, 4 and 2 minutes), the vehicles finish at minutes 2, 4 and 4; [02-ev-charging.ts](../../tests/public-contracts/des-models/02-ev-charging.ts) asserts this and that a cancellation never releases another vehicle's charger.

Things to try:

- Add a vehicle with `addVehicle` and then `abandonWaiting`. Does anyone else lose their slot?
- Reduce the chargers with `setChargers(1)` during a run.

## Use

Choose **EV Charging Queue** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-ev-charging/model.ts";

const charging = create();
charging.advance(4);
const { completedVehicleCount, activeVehicleCount } = charging.read(); // 3, 0
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `chargerCount` | `2` | integer; ≥ 1; ≤ 10 | Chargers available |
| `sessionMinutes` | `2` | integer; ≥ 1; ≤ 30 | Default session length in minutes |
| `vehicleCount` | `3` | integer; ≥ 0; ≤ 100 | Vehicles at the start |

## Actions and observations

`addVehicle`, `abandonWaiting` and `setChargers` change the scenario during a run; [model.ts](model.ts) has their typed arguments. `read()` reports active and waiting vehicles, completed and abandoned sessions, each vehicle and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. Session lengths are inputs, not battery physics. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
