# Civic Office Queue

How long do residents wait at a service desk? Residents queue at a civic office and are served first come, first served by `clerkCount` clerks, each service taking `serviceMinutes`. Each step advances one minute and handles every event due in it. You can add residents and change the number of clerks during a run; removing a clerk lets the current service finish.

With the defaults (three residents, one clerk, two minutes each), service ends at minutes 2, 4 and 6 and the total waiting time is 6 minutes; [01-civic-office.ts](../../tests/public-contracts/des-models/01-civic-office.ts) asserts these values.

Things to try:

- Add a second clerk with `setClerks(2)` and compare the total waiting time.
- Add residents during a run with `addResident()` and watch the queue.

## Use

Choose **Civic Office Queue** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-civic-office/model.ts";

const office = create();
office.advance(6);
const { totalWaitMinutes, busyClerkCount } = office.read(); // 6, 0
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `residentCount` | `3` | integer; ≥ 0; ≤ 100 | Residents in the morning queue |
| `clerkCount` | `1` | integer; ≥ 1; ≤ 10 | Clerks serving in parallel |
| `serviceMinutes` | `2` | integer; ≥ 1; ≤ 20 | Minutes per service |

## Actions and observations

`addResident()` and `setClerks(count)` change the scenario during a run. `read()` reports the waiting residents, busy clerks, completed services, `totalWaitMinutes`, each resident and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
