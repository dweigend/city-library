# Household Energy Demand

How does moving an appliance from the evening to midday change a neighborhood's power demand? Each step is one hour. Every household draws a base load of 0.3 kW. An appliance adds 0.9 kW per household, split between the evening (18–21 h) and midday (12–15 h); `shiftedShare` is the part moved to midday. The model adds up demand in kW and energy in kWh.

Things to try:

- Compare the evening peak for `shiftedShare` 0 and 1.
- Change `shiftedShare` during a run with `setShiftedShare` and compare the daily energy total.

## Use

Choose **Household Energy Demand** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/household-energy-demand/model.ts";

const demand = create({ householdCount: 12, shiftedShare: 0.5 });
demand.advance(24);
const { demandKw, energyKwh } = demand.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `householdCount` | `12` | integer; ≥ 1; ≤ 100 | Households in the neighborhood |
| `shiftedShare` | `0.5` | number; ≥ 0; ≤ 1; step 0.1 | Share of the appliance load moved from evening to midday |

## Actions and observations

`advance()` runs hours; `setShiftedShare(share)` changes the shift during a run and rejects invalid values without changes. `exportMeasurements()` returns the recorded samples. `read()` includes `hour`, `demandKw`, `energyKwh`, per-household loads and a bounded `history` of at most 120 samples.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [resource-projection.test.ts](../../tests/resource-projection.test.ts). Passing them shows that the mechanism works as described, not that the model forecasts real household demand.
