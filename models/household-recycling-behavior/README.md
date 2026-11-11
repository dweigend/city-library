# Household Recycling Behavior

How does recycling spread through a neighborhood? Households sit in a ring, each linked to its two neighbors; at the start only the first household recycles. Each step, every household that does not recycle yet adopts with a chance of `influence` times the share of its neighbors who recycle. All households decide from the same previous state, so adoption cannot cascade within one step. Once adopted, recycling stays.

Things to try:

- Compare `influence` 0.2 and 1. How many steps until everyone recycles?
- Run the same settings with two seeds.

## Use

Choose **Household Recycling Behavior** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/household-recycling-behavior/model.ts";

const street = create({ householdCount: 12, influence: 0.5, seed: 1 });
street.advance(10);
const { adopterCount, share } = street.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `householdCount` | `12` | integer; ≥ 3; ≤ 40 | Households in the ring |
| `influence` | `0.5` | number; ≥ 0; ≤ 1; step 0.1 | Adoption chance when all neighbors recycle |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 | Seed for adoption draws |

## Actions and observations

`advance()` runs steps; `setInfluence(value)` changes the influence. `read()` reports `adopterCount`, `share`, the network `nodes` and `edges` and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [social-projection.test.ts](../../tests/social-projection.test.ts). Passing them shows that the mechanism works as described, not that the model predicts real recycling behavior.
