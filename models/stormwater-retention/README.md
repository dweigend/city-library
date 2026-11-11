# Stormwater Retention

When does a retention basin overflow? Each step is one hour. Rain at `rainMmPerHour` falls on a small catchment, and part of it runs off into the basin. The basin drains at most 0.2 m³ per hour. When it fills past `capacityM3`, the extra water overflows, and the model records when, within the hour, the basin reached capacity. Inflow always equals stored plus drained plus overflowing water.

Things to try:

- Raise `rainMmPerHour` during a run with `setRain`. When does the first overflow happen?
- Set rain to 0 after an overflow and watch the basin drain.

## Use

Choose **Stormwater Retention** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/stormwater-retention/model.ts";

const basin = create({ rainMmPerHour: 20, capacityM3: 3 });
basin.advance(1);
const { storedM3, dischargedM3, overflowM3 } = basin.read(); // 0.7, 0.2, 0
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `rainMmPerHour` | `20` | integer; ≥ 0; ≤ 50 | Rainfall intensity |
| `capacityM3` | `3` | integer; ≥ 1; ≤ 10 | Basin capacity |

## Actions and observations

`advance()` runs hours; `setRain(mmPerHour)` changes the rainfall during a run. `read()` reports stored, total inflow, drained and overflow volumes, per-hour values, the number of capacity crossings, `lastCrossingHour` and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [resource-projection.test.ts](../../tests/resource-projection.test.ts). Passing them shows that the mechanism works as described, not that the model is a drainage design tool. Hydraulic routing and soil processes are left out.
