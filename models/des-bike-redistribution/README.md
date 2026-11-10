# DES Bike Redistribution

How does a truck rebalance a bike-sharing fleet? Three stations start with 6, 0 and 0 bikes. A truck that carries `truckCapacity` bikes moves them along network travel times until every station holds `targetBikeCount`. Bikes at stations plus bikes on the truck always add up to 6.

With the defaults, the stations hold 2, 2 and 2 bikes after four minutes; with a one-bike truck, the same is reached within ten minutes. [08-bike-redistribution.ts](../../tests/public-contracts/des-models/08-bike-redistribution.ts) asserts both.

Things to try:

- Compare `truckCapacity` 1, 2 and 4. How many trips are needed?

## Use

Choose **DES Bike Redistribution** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-bike-redistribution/model.ts";

const bikes = create();
bikes.advance(4);
const stationCounts = bikes.read().stations.map((station) => station.bikeCount); // [2, 2, 2]
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `targetBikeCount` | `2` | integer; ≥ 1; ≤ 6 | Bikes each station should hold |
| `truckCapacity` | `2` | integer; ≥ 1; ≤ 6 | Bikes the truck can carry |

## Actions and observations

`read()` reports delivered and in-transit bikes, the total, each station, the truck and its `trips`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. Demand is synthetic. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
