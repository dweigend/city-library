# Water Allocation

Who gets water when supply runs short? Four districts each request 3 units of water, but only `supplyUnitCount` units are available. Requests are served first come, first served; unmet demand is recorded rather than hidden. `addSupply()` adds supply and serves the next waiting district.

With the default 6 units, the first two districts get 3 each and 6 units remain unmet. Two calls to `addSupply()` cover the full demand of 12. [09-water-allocation.ts](../../tests/public-contracts/des-models/09-water-allocation.ts) asserts these values.

Things to try:

- Add supply step by step and watch which district is served next.

## Use

Choose **Water Allocation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-water-allocation/model.ts";

const water = create();
water.advance();
const { supplied, unmet } = water.read(); // 6, 6
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `supplyUnitCount` | `6` | integer; ≥ 3; ≤ 12; step 3 | Water units available at the start |
| `transferMinutes` | `1` | integer; ≥ 1; ≤ 10 | Minutes per allocation transfer |

## Actions and observations

`addSupply()` adds supply during a run and rejects negative amounts. `read()` reports supplied, committed, available and unmet units, waiting districts and each district.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. It allocates units only; there are no pressure, flow or water-quality claims. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
