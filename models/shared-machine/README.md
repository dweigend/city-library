# Shared Machine

How do reservation, failure and repair interact when two users share one machine? A workshop holds two units of material and one machine. User A or B reserves the machine, starts a job, which consumes one unit, and completes it. A reservation can be cancelled before the start. A running job can fail: the machine goes into repair, no extra material is consumed and the used unit is not refunded, and repair succeeds only after one hour has passed.

Each step advances the clock by one hour. Steps never retry rejected requests; the order of operations is up to you. It is an original City Library teaching model.

## Use

Choose **Shared Machine** in [Model Lab](../../ui/model-lab/README.md) and use the reserve, start, cancel, fail, repair and complete actions.

From a script in the repository root:

```ts
import { create } from "./models/shared-machine/model.ts";

const workshop = create();
workshop.reserve("A");
workshop.start("A");
workshop.fail();
workshop.repair();   // false: the hour has not passed yet
workshop.advance(1);
workshop.repair();   // true
console.log(workshop.read()); // phase "idle", inventoryUnitCount 1, consumedUnitCount 1
```

Every action returns `true` when it was applied and `false` when it was rejected without changes. [model.ts](model.ts) also exports the same operations as standalone functions. The public contract script [05-shared-machine.ts](../../tests/public-contracts/city-simulation/05-shared-machine.ts) asserts the reservation, failure and repair rules.
