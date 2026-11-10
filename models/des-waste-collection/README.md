# Waste Collection Tour

How does truck size change a collection round? A truck drives a route over grid locations that hold 12 units of waste. It carries at most `loadCapacity` units and empties them at the depot, which takes `unloadMinutes`. Waste at the sites, on the truck and at the depot always adds up to 12.

With the defaults, all 12 units reach the depot by minute 12; a truck that carries one unit at a time finishes within 36 minutes. [06-waste-collection.ts](../../tests/public-contracts/des-models/06-waste-collection.ts) asserts both.

Things to try:

- Compare `loadCapacity` 1, 4 and 12. How many minutes does the round take?
- Raise `unloadMinutes`. When does the depot become the bottleneck?

## Use

Choose **Waste Collection Tour** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-waste-collection/model.ts";

const collection = create();
collection.advance(12);
const { deliveredWasteUnitCount, done } = collection.read(); // 12, true
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `loadCapacity` | `4` | integer; ≥ 1; ≤ 12 | Waste units the truck can carry |
| `unloadMinutes` | `2` | integer; ≥ 1; ≤ 10 | Minutes to unload at the depot |

## Actions and observations

`read()` reports remaining, carried and delivered waste, the busy depot, the truck, the grid `fields` and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. There is no emissions or cost calibration. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
