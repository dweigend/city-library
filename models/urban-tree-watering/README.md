# Urban Tree Watering

How should a fixed amount of water be shared among street trees? Each step is one day. Trees start with random soil moisture. The day's allowance of `dailyLiters` goes to the driest trees first, each filled up to 12 liters until the water runs out; ties keep a stable order. Afterwards every tree loses 2 liters.

Things to try:

- Lower `dailyLiters` with `setDailyLiters`. Which trees go without water?
- Find the allowance that keeps `meanMoisture` steady for the default ten trees.

## Use

Choose **Urban Tree Watering** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-tree-watering/model.ts";

const trees = create({ treeCount: 10, dailyLiters: 20, seed: 1 });
trees.advance(7);
const { meanMoisture, totalWaterLiters } = trees.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `treeCount` | `10` | integer; ≥ 2; ≤ 40 | Number of trees |
| `dailyLiters` | `20` | integer; ≥ 0; ≤ 100 | Water allowance per day |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 | Draws the initial moisture |

## Actions and observations

`advance()` runs days; `setDailyLiters(liters)` changes the allowance. `read()` reports `meanMoisture`, the water given today and in total, each tree's moisture and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [resource-projection.test.ts](../../tests/resource-projection.test.ts). Passing them shows that the mechanism works as described, not that the model is an irrigation recommendation.
