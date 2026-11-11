# Machine Maintenance

How many repair teams does a set of machines need? Three machines fail after their working time (`failureMinutes`) and wait for one of `repairTeamCount` teams; a repair takes `repairMinutes`. The model records each machine's availability as the share of time it was working.

With the defaults, all three machines are down at minute 4. By minute 10, two repairs are done and the mean availability is 0.5. [10-machine-maintenance.ts](../../tests/public-contracts/des-models/10-machine-maintenance.ts) asserts these values.

Things to try:

- Switch to three teams with `setRepairTeams(3)` after the machines fail. How quickly are all running again?

## Use

Choose **Machine Maintenance** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-machine-maintenance/model.ts";

const maintenance = create();
maintenance.advance(10);
const { completedRepairCount, availability } = maintenance.read(); // 2, 0.5
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `repairTeamCount` | `1` | integer; ≥ 1; ≤ 3 | Repair teams |
| `repairMinutes` | `3` | integer; ≥ 1; ≤ 10 | Minutes per repair |
| `failureMinutes` | `4` | integer; ≥ 1; ≤ 20 | Working minutes before a failure |

## Actions and observations

`setRepairTeams(count)` changes the number of teams during a run. `read()` reports busy teams, waiting and operational machines, completed repairs, `availability`, each machine and a `trace`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. Failure cycles are synthetic. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
