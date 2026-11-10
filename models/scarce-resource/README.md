# Scarce Resource

Who gets the last unit when two people ask for it? One indivisible unit and two applicants, A and B, each wanting one. Allocation is an explicit decision: call `allocate("A")` or `allocate("B")`. The first valid allocation uses up the inventory, so the second request fails. Stepping the model does not allocate anything, because the model does not invent a priority.

It is an original City Library teaching model about allocation, not a scheduling or fairness algorithm.

## Use

Choose **Scarce Resource** in [Agent Lab](../../ui/agent-lab/README.md) and use the allocation actions. Setup creates a fresh allocation.

From a script in the repository root:

```ts
import { create } from "./models/scarce-resource/model.ts";

const allocation = create();
allocation.allocate("A"); // true
allocation.allocate("B"); // false: nothing left
console.log(allocation.read()); // inventoryUnitCount 0, aliceReceivedUnitCount 1, unmetUnitCount 1
```

[model.ts](model.ts) also exports the lower-level functions `createAllocation`, `chooseApplicant`, `transferOne` and `observe`. With them, an applicant that is no longer eligible is rejected without changing any state. The public contract script [04-scarce-resource.ts](../../tests/public-contracts/city-simulation/04-scarce-resource.ts) asserts priority order and rejection.
