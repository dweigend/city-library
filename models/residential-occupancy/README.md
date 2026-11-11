# Residential Occupancy

What happens when more households apply than there are dwellings? Applicants queue for `slotCount` dwelling slots in arrival order. Each step is one day, and every three days one household moves out, which frees exactly one slot for the next applicant in line. You can also call `moveOut` yourself or change the number of slots.

Things to try:

- Use more applicants than slots and follow the waiting count over time.
- Add slots during a run with `setSlots`. Who gets them?

## Use

Choose **Residential Occupancy** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/residential-occupancy/model.ts";

const housing = create({ applicantCount: 8, slotCount: 3 });
housing.advance(3);
const { occupiedSlotCount, waitingHouseholdCount } = housing.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `applicantCount` | `8` | integer; ≥ 1; ≤ 40 | Households applying for a dwelling |
| `slotCount` | `3` | integer; ≥ 1; ≤ 20 | Available dwelling slots |

## Actions and observations

`advance()` runs days; `moveOut()` releases one granted dwelling; `setSlots(count)` changes the capacity. `read()` reports occupied and available slots, the waiting count, each household and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [model-occupancy.test.ts](../../tests/model-occupancy.test.ts) and [social-projection.test.ts](../../tests/social-projection.test.ts). Passing them shows that the mechanism works as described, not that the model forecasts housing markets. Lease lengths are not modeled.
